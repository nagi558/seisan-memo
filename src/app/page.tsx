import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CategoryBreakdown, type CategoryBreakdownRow } from "@/components/dashboard/category-breakdown";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { formatMonthRangeLabel, getCurrentMonthRange, getMonthlySummary } from "@/lib/dashboard";

const TOP_CATEGORY_COUNT = 3;
const OTHER_CATEGORY_KEY = "__other__";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const range = getCurrentMonthRange();
  const summary = await getMonthlySummary(userId, range);
  const periodLabel = formatMonthRangeLabel(range.start, range.end);

  const topCategories = summary.categories.slice(0, TOP_CATEGORY_COUNT);
  const restCategories = summary.categories.slice(TOP_CATEGORY_COUNT);
  const otherTotal = restCategories.reduce((sum, category) => sum + category.amountTotal, 0);

  const breakdownRows: CategoryBreakdownRow[] = [
    ...topCategories.map((category) => ({
      key: category.categoryId,
      name: category.name,
      amountTotal: category.amountTotal,
    })),
    ...(restCategories.length > 0
      ? [{ key: OTHER_CATEGORY_KEY, name: "その他", amountTotal: otherTotal }]
      : []),
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">今月の精算</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6 pb-24">
        <SummaryCard partnerTotal={summary.partnerTotal} periodLabel={periodLabel} />

        {breakdownRows.length > 0 ? (
          <CategoryBreakdown rows={breakdownRows} />
        ) : (
          <div className="border-border bg-card flex flex-col items-center gap-2 rounded-2xl border p-8 text-center">
            <p className="text-muted-foreground text-sm">今月の支出はまだ登録されていません。</p>
          </div>
        )}

        <Button
          render={<Link href="/expenses/new" />}
          className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 w-full gap-1.5 rounded-xl text-base"
        >
          <Plus className="size-5" />
          支出を追加
        </Button>
      </main>
    </div>
  );
}
