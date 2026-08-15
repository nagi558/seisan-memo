"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { deleteExpense } from "./actions";

export function DeleteExpenseButton({ expenseId }: { expenseId: string }) {
  return (
    <form
      action={deleteExpense}
      onSubmit={(event) => {
        if (!window.confirm("この支出を削除しますか？")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={expenseId} />
      <Button type="submit" variant="ghost" size="icon" aria-label="削除">
        <Trash2 className="text-destructive size-4" />
      </Button>
    </form>
  );
}
