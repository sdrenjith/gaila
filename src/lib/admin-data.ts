import "server-only";

import { connectDB } from "@/lib/db";
import { serializeDoc } from "@/lib/serialize";
import { AdminUser } from "@/models/AdminUser";

export async function getAdminUsers() {
  await connectDB();
  const users = await AdminUser.find().select("name email role status lastLoginAt createdAt").sort({ createdAt: -1 }).lean();
  return serializeDoc<{
    _id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLoginAt?: string;
    createdAt?: string;
  }[]>(users);
}
