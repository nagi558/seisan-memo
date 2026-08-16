import { Pencil, Plus, Receipt } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { splitExpense } from "@/lib/expense";
import { prisma } from "@/lib/prisma";
import { getUserSettings, resolvePartnerLabel } from "@/lib/settings";

import { CategoryFilterTabs } from "./category-filter-tabs";
import { DeleteExpenseButton } from "./delete-expense-button";

function formatDate(date: Date) {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getUserSettings(userId);
  const partnerLabel = resolvePartnerLabel(settings.partnerName);

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const sp = await searchParams;
  // 不正なcategoryId・他ユーザーのcategoryId・未指定はすべて「すべて」（絞り込みなし）として扱う。
  const selectedCategoryId =
    categories.find((category) => category.id === sp.category)?.id ?? null;

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
    },
    include: { category: true },
    orderBy: [{ spentAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">支出一覧</h1>
        <Button
          render={<Link href="/expenses/new" />}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1 rounded-full px-3"
        >
          <Plus className="size-4" />
          追加
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 px-4 py-6 sm:px-6">
        <CategoryFilterTabs categories={categories} selectedCategoryId={selectedCategoryId} />

        {expenses.length === 0 ? (
          <div className="border-border bg-card flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border p-10 text-center">
            <Receipt className="text-muted-foreground size-10" />
            <p className="text-muted-foreground">
              {selectedCategoryId
                ? "このカテゴリの支出はまだ登録されていません。"
                : "まだ支出が登録されていません。"}
            </p>
            <Button
              render={<Link href="/expenses/new" />}
              className="bg-accent text-accent-foreground hover:bg-accent/90 mt-2 rounded-full"
            >
              最初の支出を追加する
            </Button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {expenses.map((expense) => {
              const { selfShare, partnerShare } = splitExpense(
                expense.amount,
                expense.selfSharePercent,
              );

              return (
                <li
                  key={expense.id}
                  className="border-border bg-card flex flex-col gap-2 rounded-2xl border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-sm">
                      {formatDate(expense.spentAt)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                        {expense.category.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="編集"
                        render={<Link href={`/expenses/${expense.id}/edit`} />}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <DeleteExpenseButton expenseId={expense.id} />
                    </div>
                  </div>
                  {expense.description ? (
                    <p className="text-foreground font-medium">{expense.description}</p>
                  ) : null}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-lg font-bold">
                      ¥{expense.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5">
                        自分 ¥{selfShare.toLocaleString()}
                      </span>
                      <span className="bg-accent/10 text-accent rounded-full px-2 py-0.5">
                        {partnerLabel} ¥{partnerShare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
