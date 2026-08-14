import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { getCurrentMonthRange, getPeriodSummary } from "@/lib/dashboard";
import { splitExpense } from "@/lib/expense";
import { prisma } from "@/lib/prisma";

function formatDate(date: Date) {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

export default async function ExpenseCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const expense = await prisma.expense.findFirst({
    where: { id, userId },
    include: { category: true },
  });

  if (!expense) {
    notFound();
  }

  const { selfShare, partnerShare } = splitExpense(expense.amount, expense.selfSharePercent);

  const { partnerTotal: monthlyPartnerTotal } = await getPeriodSummary(
    userId,
    getCurrentMonthRange(),
  );

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center gap-6 px-4 py-10 text-center">
        <div className="relative flex size-20 items-center justify-center">
          <span className="bg-accent absolute top-0 right-1 size-2.5 rounded-full" />
          <span className="bg-primary absolute bottom-1 left-0 size-2 rounded-full" />
          <span className="bg-accent/70 absolute top-3 left-1 size-1.5 rounded-full" />
          <span className="bg-primary/70 absolute right-0 bottom-3 size-1.5 rounded-full" />
          <div className="bg-primary flex size-16 items-center justify-center rounded-full">
            <CheckCircle2 className="text-primary-foreground size-9" />
          </div>
        </div>

        <h1 className="text-foreground text-xl font-semibold">登録が完了しました！</h1>

        <div className="border-border bg-card flex w-full items-center gap-3 rounded-2xl border p-4 text-left shadow-sm">
          <div className="bg-secondary flex size-10 shrink-0 items-center justify-center rounded-full">
            <ShoppingBag className="text-secondary-foreground size-5" />
          </div>
          <div className="flex flex-1 flex-col">
            <p className="text-foreground font-medium">
              {expense.description ?? expense.category.name}
            </p>
            <p className="text-muted-foreground text-sm">{formatDate(expense.spentAt)}</p>
          </div>
          <p className="text-foreground text-lg font-bold">
            ¥{expense.amount.toLocaleString()}
          </p>
        </div>

        <div className="flex w-full items-center gap-3">
          <div className="bg-primary/10 flex-1 rounded-xl px-3 py-3 text-center">
            <p className="text-primary text-xs font-medium">あなたの負担額</p>
            <p className="text-primary text-xl font-bold">¥{selfShare.toLocaleString()}</p>
          </div>
          <div className="bg-accent/10 flex-1 rounded-xl px-3 py-3 text-center">
            <p className="text-accent text-xs font-medium">相手の負担額</p>
            <p className="text-accent text-xl font-bold">¥{partnerShare.toLocaleString()}</p>
          </div>
        </div>

        <div className="from-primary to-primary/80 flex w-full flex-col gap-1 rounded-2xl bg-gradient-to-br p-5 text-center shadow-sm">
          <p className="text-primary-foreground/90 text-sm font-medium">
            今月の相手の支払予定額
          </p>
          <p className="text-primary-foreground text-3xl font-bold">
            ¥{monthlyPartnerTotal.toLocaleString()}
          </p>
        </div>

        <Button
          render={<Link href="/" />}
          className="h-11 w-full rounded-xl text-base"
        >
          トップページに戻る
        </Button>
      </main>
    </div>
  );
}
