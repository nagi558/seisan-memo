import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getUserSettings, resolvePartnerLabel } from "@/lib/settings";

import { createExpense } from "../actions";
import { ExpenseForm } from "./expense-form";

export default async function NewExpensePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getUserSettings(userId);
  const partnerLabel = resolvePartnerLabel(settings.partnerName);

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { name: true },
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="支出一覧に戻る"
          render={<Link href="/expenses" />}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-foreground text-lg font-semibold">支出を追加</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-4 py-6 sm:max-w-lg">
        <ExpenseForm
          categoryNames={categories.map((category) => category.name)}
          partnerLabel={partnerLabel}
          action={createExpense}
          confirmStep
        />
      </main>
    </div>
  );
}
