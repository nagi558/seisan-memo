"use client";

import { useActionState, useState } from "react";
import { CalendarDays, FileText, Tag, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { splitExpense } from "@/lib/expense";

import type { ExpenseFormState } from "../actions";

const emptyExpenseFormState: ExpenseFormState = {};

function todayDateInputValue() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function ExpenseForm({
  categoryNames,
  partnerLabel,
  action,
  initialState = emptyExpenseFormState,
  submitLabel = "登録する",
  pendingLabel = "登録中...",
  hiddenFields,
}: {
  categoryNames: string[];
  partnerLabel: string;
  action: (state: ExpenseFormState, formData: FormData) => Promise<ExpenseFormState>;
  initialState?: ExpenseFormState;
  submitLabel?: string;
  pendingLabel?: string;
  hiddenFields?: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [amount, setAmount] = useState(state.values?.amount ?? "");
  const [selfSharePercent, setSelfSharePercent] = useState(state.values?.selfSharePercent ?? "50");

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

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))
        : null}

      {state.errors?._form ? (
        <p className="text-destructive text-sm">{state.errors._form[0]}</p>
      ) : null}

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
            defaultValue={state.values?.spentAt ?? todayDateInputValue()}
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
            defaultValue={state.values?.categoryName ?? ""}
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
            defaultValue={state.values?.description ?? ""}
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
          className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
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

      <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl text-base">
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}
