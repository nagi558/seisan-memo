"use client";

import { useActionState, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Pencil, Trash2, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { deleteCategory, updateCategory } from "./actions";

export function CategoryListItem({
  id,
  name,
  expenseCount,
}: {
  id: string;
  name: string;
  expenseCount: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateState, updateAction, updatePending] = useActionState(updateCategory, {
    values: { name },
  });

  // 更新成功時（エラーなし）は編集フォームを自動的に閉じる。useEffectではなく、
  // expense-form.tsxと同様レンダー中にstateの変化を検知するReact推奨パターンを使う。
  const [lastHandledUpdateState, setLastHandledUpdateState] = useState(updateState);
  if (updateState !== lastHandledUpdateState) {
    setLastHandledUpdateState(updateState);
    if (!updateState.errors) {
      setIsEditing(false);
    }
  }

  const canDelete = expenseCount === 0;

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 px-4 py-3">
        <form action={updateAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={id} />
          <Input
            name="name"
            defaultValue={updateState.values?.name ?? name}
            autoFocus
            required
          />
          <Button type="submit" size="icon" aria-label="保存" disabled={updatePending}>
            <Pencil />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="キャンセル"
            disabled={updatePending}
            onClick={() => setIsEditing(false)}
          >
            <X />
          </Button>
        </form>
        {updateState.errors?.name ? (
          <p className="text-destructive text-sm">{updateState.errors.name[0]}</p>
        ) : null}
        {updateState.errors?._form ? (
          <p className="text-destructive text-sm">{updateState.errors._form[0]}</p>
        ) : null}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex flex-col">
        <span className="text-foreground text-sm font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{expenseCount}件の支出</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="カテゴリ名を編集"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="size-4" />
        </Button>

        {canDelete ? (
          <DeleteCategoryButton id={id} name={name} />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            aria-label="支出が紐づいているカテゴリは削除できません"
            disabled
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </li>
  );
}

function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteCategory, {});

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="ghost" size="icon" aria-label={`${name}を削除`} />}>
        <Trash2 className="text-destructive size-4" />
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <AlertDialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5 shadow-lg">
          <div className="flex flex-col gap-3">
            <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-full">
              <TriangleAlert className="text-destructive size-5" />
            </div>

            <AlertDialog.Title className="text-foreground text-lg font-semibold">
              このカテゴリを削除しますか？
            </AlertDialog.Title>

            <AlertDialog.Description className="text-muted-foreground text-sm leading-relaxed">
              「{name}」を削除します。この操作は元に戻せません。
            </AlertDialog.Description>
          </div>

          <form action={formAction} className="mt-5 flex flex-col gap-3">
            <input type="hidden" name="id" value={id} />

            {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="destructive"
                disabled={pending}
                className="h-11 w-full rounded-xl text-base"
              >
                {pending ? "削除中..." : "削除する"}
              </Button>
              <AlertDialog.Close
                render={<Button variant="outline" className="h-11 w-full rounded-xl text-base" />}
                disabled={pending}
              >
                キャンセル
              </AlertDialog.Close>
            </div>
          </form>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
