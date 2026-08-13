import { redirect } from "next/navigation";

import { CategoryLegend } from "@/components/dashboard/category-legend";
import { DonutChart } from "@/components/dashboard/donut-chart";
import { PeriodNav } from "@/components/dashboard/period-nav";
import { ReportTypeTabs, type ReportType } from "@/components/dashboard/report-type-tabs";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { auth } from "@/auth";
import {
  buildTopCategoriesWithOther,
  formatYearLabel,
  formatYearMonthLabel,
  getMonthRange,
  getPeriodSummary,
  getYearRange,
} from "@/lib/dashboard";

const SEGMENT_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function parseReportType(value: string | undefined): ReportType {
  return value === "year" ? "year" : "month";
}

type ReportSegment = {
  key: string;
  name: string;
  amountTotal: number;
  percent: number;
  color: string;
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; year?: string; month?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const sp = await searchParams;
  const today = new Date();
  const type = parseReportType(sp.type);

  const yearParam = Number(sp.year);
  const year = Number.isInteger(yearParam) ? yearParam : today.getFullYear();

  const monthParam = Number(sp.month);
  const month =
    Number.isInteger(monthParam) && monthParam >= 1 && monthParam <= 12
      ? monthParam
      : today.getMonth() + 1;

  const range = type === "year" ? getYearRange(year) : getMonthRange(year, month);
  const periodLabel =
    type === "year" ? formatYearLabel(range.start) : formatYearMonthLabel(range.start);

  const summary = await getPeriodSummary(userId, range);
  const buckets = buildTopCategoriesWithOther(summary.categories);

  const percents = buckets.map((bucket) =>
    summary.amountTotal > 0 ? Math.round((bucket.amountTotal / summary.amountTotal) * 100) : 0,
  );
  // 端数調整: 丸め誤差を最後の区分に寄せ、合計が必ず100%になるようにする
  if (percents.length > 0 && summary.amountTotal > 0) {
    const sumExceptLast = percents.slice(0, -1).reduce((total, value) => total + value, 0);
    percents[percents.length - 1] = 100 - sumExceptLast;
  }

  const segments: ReportSegment[] = buckets.map((bucket, index) => ({
    key: bucket.key,
    name: bucket.name,
    amountTotal: bucket.amountTotal,
    percent: percents[index],
    color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">レポート</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6 pb-24">
        <ReportTypeTabs type={type} year={year} month={month} />
        <PeriodNav type={type} year={year} month={month} label={periodLabel} />

        <SummaryCard
          label="相手の支払予定額"
          amount={summary.partnerTotal}
          caption={`（あなたの立て替え合計 ¥${summary.amountTotal.toLocaleString()}）`}
        />

        <section className="flex flex-col items-center gap-4">
          <h2 className="text-foreground self-start text-base font-semibold">カテゴリ別の割合</h2>

          {segments.length > 0 ? (
            <>
              <DonutChart segments={segments} />
              <CategoryLegend segments={segments} />
            </>
          ) : (
            <div className="border-border bg-card flex w-full flex-col items-center gap-2 rounded-2xl border p-8 text-center">
              <p className="text-muted-foreground text-sm">
                この期間の支出はまだ登録されていません。
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
