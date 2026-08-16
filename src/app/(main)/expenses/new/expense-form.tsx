"use client";

import { useActionState, useRef, useState } from "react";
import { CalendarDays, FileText, Tag, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { splitExpense } from "@/lib/expense";
import { cn } from "@/lib/utils";

import type { ExpenseFormState } from "../actions";

const emptyExpenseFormState: ExpenseFormState = {};

function todayDateInputValue() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// spentAtは<input type="date">のYYYY-MM-DD文字列（タイムゾーン情報なし）のため、
// Dateオブジェクトを経由せず文字列のまま組み立てて表示のズレを避ける。
function formatSpentAtDisplay(value: string) {
  const parts = value.split("-");
  if (parts.length !== 3) {
    return value;
  }
  const [year, month, day] = parts;
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export function ExpenseForm({
  categoryNames,
  partnerLabel,
  action,
  initialState = emptyExpenseFormState,
  submitLabel = "登録する",
  pendingLabel = "登録中...",
  hiddenFields,
  confirmStep = false,
}: {
  categoryNames: string[];
  partnerLabel: string;
  action: (state: ExpenseFormState, formData: FormData) => Promise<ExpenseFormState>;
  initialState?: ExpenseFormState;
  submitLabel?: string;
  pendingLabel?: string;
  hiddenFields?: Record<string, string>;
  // 新規登録画面のみ入力→確認の2ステップにする。編集画面は従来どおり即時送信のまま。
  confirmStep?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState<"input" | "confirm">("input");
  const [spentAt, setSpentAt] = useState(state.values?.spentAt ?? todayDateInputValue());
  const [categoryName, setCategoryName] = useState(state.values?.categoryName ?? "");
  const [description, setDescription] = useState(state.values?.description ?? "");
  const [amount, setAmount] = useState(state.values?.amount ?? "");
  const [selfSharePercent, setSelfSharePercent] = useState(state.values?.selfSharePercent ?? "50");

  // createExpense/updateExpenseがエラーを返した場合（成功時はredirectするためこの
  // コンポーネントは再レンダリングされない）、入力内容を見直せるよう入力画面へ戻す。
  // useEffectではなく、レンダー中にstateの変化を検知してsetStateするReact推奨パターン
  // （https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes）
  // を使い、cascading re-renderを避ける。
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state.errors) {
      setStep("input");
    }
  }

  const amountValue = Number(amount);
  const percentValue = Number(selfSharePercent);
  const hasValidPreview =
    /^\d+$/.test(amount.trim()) &&
    /^\d+$/.test(selfSharePercent.trim()) &&
    amountValue > 0 &&
    percentValue >= 0 &&
    percentValue <= 100;
  const preview = hasValidPreview ? splitExpense(amountValue, percentValue) : null;

  const selfPercentDisplay = Number.isFinite(percentValue)
    ? Math.min(100, Math.max(0, percentValue))
    : 50;
  const partnerPercentDisplay = 100 - selfPercentDisplay;

  const isConfirmStep = confirmStep && step === "confirm";

  function handleGoToConfirm() {
    // ネイティブのrequired等の検証は、これまでsubmitボタンが担っていたため、
    // ボタン種別をtype="button"に変えた分をここで明示的に走らせる。
    // ただしこれはUXのためのゲートであり、最終的な検証・認可はサーバー側の
    // createExpenseを信頼する（クライアント側はセキュリティ境界として扱わない）。
    if (!formRef.current?.reportValidity()) {
      return;
    }
    if (!hasValidPreview) {
      return;
    }
    setStep("confirm");
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}

      {state.errors?._form ? (
        <p className="text-destructive text-sm">{state.errors._form[0]}</p>
      ) : null}

      {isConfirmStep ? (
        <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm">
          <p className="text-muted-foreground text-sm font-medium">内容を確認してください</p>

          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                日付
              </dt>
              <dd className="text-foreground font-medium">{formatSpentAtDisplay(spentAt)}</dd>
            </div>

            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground flex items-center gap-1.5">
                <Tag className="size-4" />
                カテゴリ
              </dt>
              <dd className="text-foreground font-medium">{categoryName}</dd>
            </div>

            {description ? (
              <div className="flex items-center justify-between gap-2">
                <dt className="text-muted-foreground flex items-center gap-1.5">
                  <FileText className="size-4" />
                  内容
                </dt>
                <dd className="text-foreground font-medium">{description}</dd>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <dt className="text-muted-foreground flex items-center gap-1.5">
                <Wallet className="size-4" />
                支払った金額
              </dt>
              <dd className="text-foreground text-lg font-bold">
                ¥{amountValue.toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <div className={cn("flex flex-col gap-4", isConfirmStep && "hidden")}>
        <div className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="spentAt" className="text-muted-foreground gap-1.5">
              <CalendarDays className="size-4" />
              日付
            </Label>
            <Input
              id="spentAt"
              name="spentAt"
              type="date"
              value={spentAt}
              onChange={(event) => setSpentAt(event.target.value)}
              required
            />
            {state.errors?.spentAt ? (
              <p className="text-destructive text-sm">{state.errors.spentAt[0]}</p>
            ) : null}
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoryName" className="text-muted-foreground gap-1.5">
              <Tag className="size-4" />
              カテゴリ
            </Label>
            <Input
              id="categoryName"
              name="categoryName"
              list="category-list"
              placeholder="例: 楽天市場"
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              autoComplete="off"
              required
            />
            <datalist id="category-list">
              {categoryNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {state.errors?.categoryName ? (
              <p className="text-destructive text-sm">{state.errors.categoryName[0]}</p>
            ) : null}
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-muted-foreground gap-1.5">
              <FileText className="size-4" />
              内容（任意）
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="例: ベビースケール"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {state.errors?.description ? (
              <p className="text-destructive text-sm">{state.errors.description[0]}</p>
            ) : null}
          </div>

          <div className="bg-border h-px" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amount" className="text-muted-foreground gap-1.5">
              <Wallet className="size-4" />
              支払った金額
            </Label>
            <div className="relative">
              <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base">
                ¥
              </span>
              <Input
                id="amount"
                name="amount"
                inputMode="numeric"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-11 pl-7 text-lg font-semibold"
                required
              />
            </div>
            {state.errors?.amount ? (
              <p className="text-destructive text-sm">{state.errors.amount[0]}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm">
        <Label htmlFor="selfSharePercent" className="text-muted-foreground">
          負担割合
        </Label>

        <input
          id="selfSharePercent"
          name="selfSharePercent"
          type="range"
          min={0}
          max={100}
          step={1}
          value={selfSharePercent}
          onChange={(event) => setSelfSharePercent(event.target.value)}
          aria-label="自分の負担割合"
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow",
            isConfirmStep && "hidden",
          )}
          style={{
            background: `linear-gradient(to right, var(--primary) ${selfPercentDisplay}%, var(--accent) ${selfPercentDisplay}%)`,
          }}
        />

        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex-1 rounded-xl px-3 py-2.5 text-center">
            <p className="text-primary text-xs font-medium">自分</p>
            <p className="text-primary text-lg font-bold">{selfPercentDisplay}%</p>
          </div>
          <span className="text-muted-foreground font-medium">:</span>
          <div className="bg-accent/10 flex-1 rounded-xl px-3 py-2.5 text-center">
            <p className="text-accent text-xs font-medium">{partnerLabel}</p>
            <p className="text-accent text-lg font-bold">{partnerPercentDisplay}%</p>
          </div>
        </div>

        {state.errors?.selfSharePercent ? (
          <p className="text-destructive text-sm">{state.errors.selfSharePercent[0]}</p>
        ) : null}
      </div>

      <div className="border-border bg-muted/40 flex flex-col gap-3 rounded-2xl border p-5">
        <p className="text-muted-foreground text-sm font-medium">負担額プレビュー</p>
        {preview ? (
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex-1 rounded-xl px-3 py-3 text-center">
              <p className="text-primary text-xs font-medium">自分の負担額</p>
              <p className="text-primary text-xl font-bold">
                ¥{preview.selfShare.toLocaleString()}
              </p>
            </div>
            <div className="bg-accent/10 flex-1 rounded-xl px-3 py-3 text-center">
              <p className="text-accent text-xs font-medium">{partnerLabel}の負担額</p>
              <p className="text-accent text-xl font-bold">
                ¥{preview.partnerShare.toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            金額と負担割合を入力すると負担額が表示されます
          </p>
        )}
      </div>

      {confirmStep && step === "input" ? (
        <Button
          type="button"
          onClick={handleGoToConfirm}
          className="h-11 w-full rounded-xl text-base"
        >
          確認画面へ
        </Button>
      ) : confirmStep ? (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("input")}
            className="h-11 flex-1 rounded-xl text-base"
          >
            戻る
          </Button>
          <Button type="submit" disabled={pending} className="h-11 flex-1 rounded-xl text-base">
            {pending ? pendingLabel : submitLabel}
          </Button>
        </div>
      ) : (
        <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl text-base">
          {pending ? pendingLabel : submitLabel}
        </Button>
      )}
    </form>
  );
}
