import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getUserSettings, resolvePartnerLabel } from "@/lib/settings";

import { updateExpense, type ExpenseFormValues } from "../../actions";
import { ExpenseForm } from "../../new/expense-form";

// spentAtは@db.Dateのため、DateオブジェクトはUTC深夜として保持される。
// ローカルタイムゲッターを使うとサーバーのタイムゾーンによっては日付が1日ずれるため、
// UTC基準のゲッターでYYYY-MM-DD形式に変換する。
function toDateInputValue(date: Date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function EditExpensePage({
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

  const settings = await getUserSettings(userId);
  const partnerLabel = resolvePartnerLabel(settings.partnerName);

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { name: true },
  });

  const initialValues: ExpenseFormValues = {
    spentAt: toDateInputValue(expense.spentAt),
    categoryName: expense.category.name,
    description: expense.description ?? "",
    amount: String(expense.amount),
    selfSharePercent: String(expense.selfSharePercent),
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="支出一覧に戻る"
          render={<Link href="/expenses" />}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-foreground text-lg font-semibold">支出を編集</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6 sm:max-w-lg">
        <ExpenseForm
          categoryNames={categories.map((category) => category.name)}
          partnerLabel={partnerLabel}
          action={updateExpense}
          initialState={{ values: initialValues }}
          submitLabel="更新する"
          pendingLabel="更新中..."
          hiddenFields={{ id: expense.id }}
        />
      </main>
    </div>
  );
}
