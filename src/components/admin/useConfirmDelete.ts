"use client";

import { useCallback, useState } from "react";

type PendingDelete = {
  title: string;
  description: string;
  onConfirm: () => void;
};

export function useConfirmDelete() {
  const [pending, setPending] = useState<PendingDelete | null>(null);

  const requestDelete = useCallback((options: PendingDelete) => {
    setPending(options);
  }, []);

  const cancelDelete = useCallback(() => {
    setPending(null);
  }, []);

  const confirmDelete = useCallback(() => {
    pending?.onConfirm();
    setPending(null);
  }, [pending]);

  return {
    pending,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
