import Link from "next/link";

import { cn } from "@/lib/utils";

export type CategoryFilterOption = {
  id: string;
  name: string;
};

export function CategoryFilterTabs({
  categories,
  selectedCategoryId,
}: {
  categories: CategoryFilterOption[];
  selectedCategoryId: string | null;
}) {
  const tabs: { key: string | null; label: string; href: string }[] = [
    { key: null, label: "すべて", href: "/expenses" },
    ...categories.map((category) => ({
      key: category.id,
      label: category.name,
      href: `/expenses?category=${category.id}`,
    })),
  ];

  return (
    <div className="border-border -mx-4 flex gap-4 overflow-x-auto border-b px-4 sm:mx-0 sm:px-0">
      {tabs.map((tab) => (
        <Link
          key={tab.key ?? "all"}
          href={tab.href}
          className={cn(
            "border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap",
            tab.key === selectedCategoryId
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
