import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    APP_URL: z.string().url().default("http://localhost:3000"),
    MONGODB_URI: z
      .string()
      .min(1)
      .refine(
        (value) => value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
        "MONGODB_URI must start with mongodb:// or mongodb+srv://",
      ),
    SESSION_SECRET: z.string().min(1),
    ADMIN_EMAIL: z.string().email().default("admin@gaila.ae"),
    ADMIN_PASSWORD: z.string().min(8).optional(),
    ADMIN_NAME: z.string().min(1).default("Gaila Admin"),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === "production" && env.SESSION_SECRET.length < 32) {
      ctx.addIssue({
        code: "custom",
        path: ["SESSION_SECRET"],
        message: "SESSION_SECRET must be at least 32 characters in production.",
      });
    }

    if (env.NODE_ENV === "production" && (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 8)) {
      ctx.addIssue({
        code: "custom",
        path: ["ADMIN_PASSWORD"],
        message: "ADMIN_PASSWORD must be at least 8 characters in production.",
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getPublicUrl(path = "") {
  const base = getEnv().APP_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath === "/" ? "" : cleanPath}`;
}
