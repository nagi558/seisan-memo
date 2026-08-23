import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { CategoryListItem } from "./category-list-item";

export default async function CategoriesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      _count: { select: { expenses: true } },
    },
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <Button variant="ghost" size="icon" aria-label="ホームに戻る" render={<Link href="/" />}>
          <ArrowLeft />
        </Button>
        <h1 className="text-foreground text-lg font-semibold">カテゴリ管理</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6">
        {categories.length === 0 ? (
          <div className="border-border bg-card flex flex-col items-center gap-2 rounded-2xl border p-8 text-center">
            <p className="text-muted-foreground text-sm">まだカテゴリが登録されていません。</p>
          </div>
        ) : (
          <ul className="border-border bg-card divide-border divide-y rounded-2xl border shadow-sm">
            {categories.map((category) => (
              <CategoryListItem
                key={category.id}
                id={category.id}
                name={category.name}
                expenseCount={category._count.expenses}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
