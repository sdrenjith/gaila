"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, useTransition } from "react";
import type { AdminActionState } from "@/app/actions/admin";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { useToast } from "@/components/admin/Toaster";

type DeleteActionFormProps = {
  action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>;
  id: string;
  itemLabel: string;
  buttonLabel?: string;
  description?: string;
  className?: string;
  buttonClassName?: string;
};

const initialState: AdminActionState = { ok: false, message: "" };

export function DeleteActionForm({
  action,
  id,
  itemLabel,
  buttonLabel,
  description,
  className,
  buttonClassName = "w-full rounded-full border border-red-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50",
}: DeleteActionFormProps) {
  const router = useRouter();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!state.message) {
      return;
    }

    push({ message: state.message, variant: state.ok ? "success" : "error" });
    if (state.ok) {
      setOpen(false);
      router.refresh();
    }
  }, [push, router, state.message, state.ok]);

  const handleConfirm = () => {
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => formAction(formData));
  };

  return (
    <div className={className}>
      <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
        {buttonLabel ?? `Delete ${itemLabel}`}
      </button>
      <ConfirmDeleteDialog
        open={open}
        title={`Delete ${itemLabel}?`}
        description={
          description ?? `This will permanently remove “${itemLabel}”. This action cannot be undone.`
        }
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
