import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import {
  buildTopCategoriesWithOther,
  formatMonthRangeLabel,
  getCurrentMonthRange,
  getPeriodSummary,
} from "@/lib/dashboard";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const range = getCurrentMonthRange();
  const summary = await getPeriodSummary(userId, range);
  const periodLabel = formatMonthRangeLabel(range.start, range.end);
  const breakdownRows = buildTopCategoriesWithOther(summary.categories);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">今月の精算</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <SummaryCard
          label={
            <>
              あなたが立て替えた分
              <br />
              相手の支払予定額
            </>
          }
          amount={summary.partnerTotal}
          caption={periodLabel}
        />

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
