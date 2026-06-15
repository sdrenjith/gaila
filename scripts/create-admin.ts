import { config } from "dotenv";
import { hash } from "bcryptjs";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { connectDB, disconnectDB } from "../src/lib/db";
import { getEnv } from "../src/lib/env";
import { AdminUser } from "../src/models/AdminUser";

const localEnv = resolve(process.cwd(), ".env.local");
if (existsSync(localEnv)) {
  config({ path: localEnv });
}
config();

async function createAdmin() {
  const env = getEnv();
  if (!env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_PASSWORD is required to create an admin user.");
  }

  await connectDB();
  await AdminUser.updateOne(
    { email: env.ADMIN_EMAIL.toLowerCase() },
    {
      $set: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL.toLowerCase(),
        passwordHash: await hash(env.ADMIN_PASSWORD, 12),
        role: "admin",
        status: "active",
      },
    },
    { upsert: true },
  );

  console.log(`Admin user ready: ${env.ADMIN_EMAIL}`);
}

createAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDB();
  });
