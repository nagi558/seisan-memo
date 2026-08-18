"use client";

import { useActionState, useState } from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { TriangleAlert } from "lucide-react";

import { deleteAccount, type DeleteAccountState } from "@/app/(main)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONFIRM_TEXT = "削除";

export function DeleteAccountDialog() {
  const [confirmText, setConfirmText] = useState("");
  const initialState: DeleteAccountState = {};
  const [state, formAction, pending] = useActionState(deleteAccount, initialState);

  const canSubmit = confirmText === CONFIRM_TEXT && !pending;

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={<Button variant="destructive" className="h-11 w-full rounded-xl text-base" />}>
        アカウントを削除
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <AlertDialog.Popup className="border-border bg-card fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5 shadow-lg">
          <div className="flex flex-col gap-3">
            <div className="bg-destructive/10 flex size-10 items-center justify-center rounded-full">
              <TriangleAlert className="text-destructive size-5" />
            </div>

            <AlertDialog.Title className="text-foreground text-lg font-semibold">
              アカウントを削除しますか？
            </AlertDialog.Title>

            <AlertDialog.Description className="text-muted-foreground text-sm leading-relaxed">
              アカウントと、支出・カテゴリ・相手の呼び名などの関連データがすべて削除されます。この操作は元に戻せません。
              <br />
              本サービス内のデータとGoogle連携情報が削除されますが、Googleアカウント自体は削除されません。
            </AlertDialog.Description>
          </div>

          <form action={formAction} className="mt-5 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="delete-confirm" className="text-muted-foreground">
                確認のため「{CONFIRM_TEXT}」と入力してください
              </Label>
              <Input
                id="delete-confirm"
                name="confirm"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                autoComplete="off"
              />
            </div>

            {state.error ? <p className="text-destructive text-sm">{state.error}</p> : null}

            <div className="mt-2 flex flex-col gap-2">
              <Button
                type="submit"
                variant="destructive"
                disabled={!canSubmit}
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
