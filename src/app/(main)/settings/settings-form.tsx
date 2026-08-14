"use client";

import { useActionState } from "react";
import { CalendarDays, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { updateSettings, type SettingsFormState } from "./actions";

const CLOSING_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => i + 1);

export function SettingsForm({
  name,
  partnerName,
  closingDay,
}: {
  name: string;
  partnerName: string;
  closingDay: number | null;
}) {
  const initialState: SettingsFormState = {
    values: {
      name,
      partnerName,
      closingDay: closingDay ? String(closingDay) : "",
    },
  };
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.errors?._form ? (
        <p className="text-destructive text-sm">{state.errors._form[0]}</p>
      ) : null}
      {state.success ? <p className="text-primary text-sm">保存しました</p> : null}

      <div className="border-border bg-card flex flex-col gap-5 rounded-2xl border p-5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="text-muted-foreground gap-1.5">
            <User className="size-4" />
            あなたの呼び名
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="例: たろう"
            defaultValue={state.values?.name ?? name}
            required
          />
          {state.errors?.name ? (
            <p className="text-destructive text-sm">{state.errors.name[0]}</p>
          ) : null}
        </div>

        <div className="bg-border h-px" />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partnerName" className="text-muted-foreground gap-1.5">
            <Users className="size-4" />
            相手の呼び名（任意）
          </Label>
          <Input
            id="partnerName"
            name="partnerName"
            placeholder="例: はなこ"
            defaultValue={state.values?.partnerName ?? partnerName}
          />
          {state.errors?.partnerName ? (
            <p className="text-destructive text-sm">{state.errors.partnerName[0]}</p>
          ) : null}
        </div>

        <div className="bg-border h-px" />

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="closingDay" className="text-muted-foreground gap-1.5">
            <CalendarDays className="size-4" />
            締め日
          </Label>
          <select
            id="closingDay"
            name="closingDay"
            defaultValue={state.values?.closingDay ?? (closingDay ? String(closingDay) : "")}
            className="border-input h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
          >
            <option value="">毎月末日</option>
            {CLOSING_DAY_OPTIONS.map((day) => (
              <option key={day} value={day}>
                毎月{day}日
              </option>
            ))}
          </select>
          {state.errors?.closingDay ? (
            <p className="text-destructive text-sm">{state.errors.closingDay[0]}</p>
          ) : null}
        </div>
      </div>

      <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl text-base">
        {pending ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
