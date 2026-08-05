"use client";

import { toast } from "sonner";

export function useUndoDelete() {
  function deleteWithUndo(deleteFn: () => unknown, undoFn: () => void, label: string) {
    let undone = false;

    toast(`"${label}" eliminado`, {
      action: {
        label: "Deshacer",
        onClick: () => {
          undone = true;
          undoFn();
          toast.success("Acción deshecha");
        },
      },
      duration: 5000,
      onAutoClose: () => {
        if (!undone) void deleteFn();
      },
    });
  }

  return { deleteWithUndo };
}
