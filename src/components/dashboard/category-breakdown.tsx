import Link from "next/link";

import { CategoryIcon } from "@/components/dashboard/category-icon";
import type { CategoryBucket } from "@/lib/dashboard";

export function CategoryBreakdown({ rows }: { rows: CategoryBucket[] }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">カテゴリ別の内訳</h2>
        <Link href="/categories" className="text-primary text-sm font-medium hover:underline">
          すべてみる
        </Link>
      </div>
      <ul className="border-border bg-card divide-border divide-y rounded-2xl border shadow-sm">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
                <CategoryIcon name={row.name} className="size-4" />
              </span>
              <span className="text-foreground text-sm font-medium">{row.name}</span>
            </div>
            <span className="text-foreground text-sm font-semibold">
              ¥{row.amountTotal.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
