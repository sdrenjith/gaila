"use client";

import { useActionState } from "react";
import { loginAction, type AdminActionState } from "@/app/actions/admin";

const initialState: AdminActionState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm text-stone-700" suppressHydrationWarning>
        Email
        <input name="email" type="email" required autoComplete="email" suppressHydrationWarning className="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none focus:border-amber-500" />
      </label>
      <label className="grid gap-2 text-sm text-stone-700" suppressHydrationWarning>
        Password
        <input name="password" type="password" required autoComplete="current-password" suppressHydrationWarning className="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-950 outline-none focus:border-amber-500" />
      </label>
      <button disabled={pending} className="gold-gradient rounded-full px-5 py-3 font-semibold text-white hover:brightness-105 disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
    </form>
  );
}
