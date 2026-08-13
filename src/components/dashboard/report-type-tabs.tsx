import Link from "next/link";

import { cn } from "@/lib/utils";

export type ReportType = "month" | "year";

export function ReportTypeTabs({
  type,
  year,
  month,
}: {
  type: ReportType;
  year: number;
  month: number;
}) {
  const tabs: { key: ReportType; label: string; href: string }[] = [
    { key: "month", label: "月別", href: `/reports?type=month&year=${year}&month=${month}` },
    { key: "year", label: "年別", href: `/reports?type=year&year=${year}` },
  ];

  return (
    <div className="border-border flex gap-4 border-b">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={cn(
            "border-b-2 px-1 pb-2 text-sm font-medium",
            tab.key === type
              ? "border-primary text-primary"
              : "text-muted-foreground border-transparent",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
