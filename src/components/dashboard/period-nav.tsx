import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { ReportType } from "@/components/dashboard/report-type-tabs";

// 年別は暦年、月別は締め日を考慮した「現在の月度」（currentYear/currentMonth、
// 呼び出し側でgetCurrentPeriodMonthにより算出）を基準に未来判定を行う。
function isFuturePeriod(
  type: ReportType,
  year: number,
  month: number,
  todayYear: number,
  currentYear: number,
  currentMonth: number,
) {
  if (type === "year") {
    return year > todayYear;
  }
  return year > currentYear || (year === currentYear && month > currentMonth);
}

export function PeriodNav({
  type,
  year,
  month,
  label,
  currentYear,
  currentMonth,
}: {
  type: ReportType;
  year: number;
  month: number;
  label: string;
  // 締め日を考慮した「現在の月度」。lib/dashboard.tsのgetCurrentPeriodMonthで算出したものを渡す。
  currentYear: number;
  currentMonth: number;
}) {
  const today = new Date();

  const prev =
    type === "year"
      ? { year: year - 1, month }
      : month === 1
        ? { year: year - 1, month: 12 }
        : { year, month: month - 1 };

  const next =
    type === "year"
      ? { year: year + 1, month }
      : month === 12
        ? { year: year + 1, month: 1 }
        : { year, month: month + 1 };

  const nextDisabled = isFuturePeriod(
    type,
    next.year,
    next.month,
    today.getFullYear(),
    currentYear,
    currentMonth,
  );

  const hrefFor = (target: { year: number; month: number }) =>
    type === "year"
      ? `/reports?type=year&year=${target.year}`
      : `/reports?type=month&year=${target.year}&month=${target.month}`;

  return (
    <div className="flex items-center justify-center gap-4">
      <Link
        href={hrefFor(prev)}
        aria-label="前の期間"
        className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full"
      >
        <ChevronLeft className="size-5" />
      </Link>
      <span className="text-foreground w-28 text-center text-base font-semibold">{label}</span>
      {nextDisabled ? (
        <span
          aria-hidden="true"
          className="text-muted-foreground/40 flex size-8 items-center justify-center"
        >
          <ChevronRight className="size-5" />
        </span>
      ) : (
        <Link
          href={hrefFor(next)}
          aria-label="次の期間"
          className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-full"
        >
          <ChevronRight className="size-5" />
        </Link>
      )}
    </div>
  );
}
