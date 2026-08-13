import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import type { ReportType } from "@/components/dashboard/report-type-tabs";

function isFuturePeriod(type: ReportType, year: number, month: number, today: Date) {
  if (type === "year") {
    return year > today.getFullYear();
  }
  return (
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth() + 1)
  );
}

export function PeriodNav({
  type,
  year,
  month,
  label,
}: {
  type: ReportType;
  year: number;
  month: number;
  label: string;
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

  const nextDisabled = isFuturePeriod(type, next.year, next.month, today);

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
