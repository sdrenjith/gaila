"use client";

import { useActionState, useEffect, useTransition } from "react";
import { updateLeadStatusAction, type AdminActionState } from "@/app/actions/admin";
import { useToast } from "@/components/admin/Toaster";
import type { LeadRecord } from "@/types/cms";

const initialState: AdminActionState = { ok: false, message: "" };

const statusBadge: Record<LeadRecord["status"], string> = {
  new: "bg-[var(--gold-light)]/40 text-[var(--gold-deep)]",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-emerald-100 text-emerald-700",
  closed: "bg-stone-200 text-stone-600",
};

export function LeadStatusForm({ lead }: { lead: LeadRecord }) {
  const { push } = useToast();
  const [state, formAction, pending] = useActionState(updateLeadStatusAction, initialState);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.message) {
      push({ message: state.message, variant: state.ok ? "success" : "error" });
    }
  }, [push, state.message, state.ok]);

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => formAction(new FormData(event.currentTarget)));
      }}
    >
      <input type="hidden" name="id" value={lead._id} />
      <select
        name="status"
        defaultValue={lead.status}
        className={`rounded-full border-none px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] outline-none ${statusBadge[lead.status] || "bg-stone-100"}`}
      >
        {(["new", "contacted", "qualified", "closed"] as LeadRecord["status"][]).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-stone-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
