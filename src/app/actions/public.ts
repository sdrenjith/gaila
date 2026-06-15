"use server";

import { revalidatePath } from "next/cache";
import { getTrustedClientIp } from "@/lib/client-ip";
import { connectDB } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validators";
import { Lead } from "@/models/Lead";

export type LeadActionState = {
  ok: boolean;
  message: string;
};

function rateLimitKey(formData: FormData, trustedIp: string | null): string {
  if (trustedIp) {
    return `ip:${trustedIp}`;
  }

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (email) {
    return `email:${email}`;
  }

  return "anonymous";
}

export async function submitLead(_: LeadActionState, formData: FormData): Promise<LeadActionState> {
  const honeypot = String(formData.get("website") || "").trim();
  if (honeypot) {
    return { ok: false, message: "Unable to submit your enquiry." };
  }

  const trustedIp = await getTrustedClientIp();
  const rateLimit = await checkRateLimit(rateLimitKey(formData, trustedIp));
  if (!rateLimit.allowed) {
    return {
      ok: false,
      message: "Too many enquiries. Please try again in a few minutes.",
    };
  }

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    company: formData.get("company") || "",
    service: formData.get("service") || "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Please check the form." };
  }

  await connectDB();
  await Lead.create(parsed.data);
  revalidatePath("/admin/leads");

  return {
    ok: true,
    message: "Thanks. Your enquiry has been sent to Gaila.",
  };
}
