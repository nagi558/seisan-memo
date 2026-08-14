import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CategoryIcon } from "@/components/dashboard/category-icon";
import { Button } from "@/components/ui/button";
import { formatMonthRangeLabel, getCurrentMonthRange, getPeriodSummary } from "@/lib/dashboard";
import { getUserSettings } from "@/lib/settings";

export default async function CategoriesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getUserSettings(userId);
  const range = getCurrentMonthRange(new Date(), settings.closingDay);
  const summary = await getPeriodSummary(userId, range);
  const periodLabel = formatMonthRangeLabel(range.start, range.end);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <Button variant="ghost" size="icon" aria-label="ホームに戻る" render={<Link href="/" />}>
          <ArrowLeft />
        </Button>
        <h1 className="text-foreground text-lg font-semibold">カテゴリ一覧</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        <p className="text-muted-foreground text-sm">{periodLabel}</p>

        {summary.categories.length === 0 ? (
          <div className="border-border bg-card flex flex-col items-center gap-2 rounded-2xl border p-8 text-center">
            <p className="text-muted-foreground text-sm">今月の支出はまだ登録されていません。</p>
          </div>
        ) : (
          <ul className="border-border bg-card divide-border divide-y rounded-2xl border shadow-sm">
            {summary.categories.map((category) => {
              const percent =
                summary.amountTotal > 0
                  ? Math.round((category.amountTotal / summary.amountTotal) * 100)
                  : 0;

              return (
                <li
                  key={category.categoryId}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
                      <CategoryIcon name={category.name} className="size-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm font-medium">{category.name}</span>
                      <span className="text-muted-foreground text-xs">{category.count}件</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      ¥{category.amountTotal.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground w-10 text-right text-xs">
                      {percent}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center justify-between px-1">
          <span className="text-foreground text-sm font-semibold">合計</span>
          <span className="text-foreground text-sm font-semibold">
            ¥{summary.amountTotal.toLocaleString()}（{summary.expenseCount}件）
          </span>
        </div>
      </main>
    </div>
  );
}
