"use client";

import { useActionState, useEffect } from "react";
import type { AdminActionState } from "@/app/actions/admin";
import { useToast } from "@/components/admin/Toaster";

type ActionFormProps = {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
};

const initialState: AdminActionState = { ok: false, message: "" };

export function ActionForm({ action, children, className, submitLabel = "Save changes" }: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const { push } = useToast();

  useEffect(() => {
    if (state.message) {
      push({ message: state.message, variant: state.ok ? "success" : "error" });
    }
  }, [state, push]);

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stone-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {pending ? <p className="text-sm text-stone-500">Saving changes…</p> : null}
      </div>
    </form>
  );
}
