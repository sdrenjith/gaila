import "server-only";

import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/session";
import { AdminUser } from "@/models/AdminUser";
import type { AdminRole } from "@/types/cms";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

const ADMIN_ROLES: AdminRole[] = ["admin", "editor"];

// Precomputed bcrypt hash used when no user exists to reduce timing leaks.
const DUMMY_PASSWORD_HASH = "$2b$12$yNbu2.5pf26BFKiBzIulOutoHYfCPhPGRiAPjY.tK7EJx4xYDGnOq";

function secretKey() {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}

function parseRole(value: unknown): AdminRole | null {
  if (value === "admin" || value === "editor") {
    return value;
  }
  return null;
}

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createSession(user: AdminSession) {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: getEnv().NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const role = parseRole(payload.role);
    if (!role) {
      return null;
    }

    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function authenticateAdmin(email: string, password: string) {
  await connectDB();
  const user = await AdminUser.findOne({ email: email.toLowerCase(), status: "active" });
  const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
  const valid = await verifyPassword(password, passwordHash);

  if (!user || !valid) {
    return null;
  }

  user.lastLoginAt = new Date();
  await user.save();

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: ADMIN_ROLES.includes(user.role as AdminRole) ? (user.role as AdminRole) : "editor",
  };
}
