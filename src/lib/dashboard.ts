import { prisma } from "@/lib/prisma";
import { splitExpense } from "@/lib/expense";

export type CategorySummary = {
  categoryId: string;
  name: string;
  amountTotal: number;
  count: number;
};

export type MonthlySummary = {
  start: Date;
  end: Date;
  amountTotal: number;
  partnerTotal: number;
  expenseCount: number;
  // amountTotal 降順
  categories: CategorySummary[];
};

export function getCurrentMonthRange(base: Date = new Date()): { start: Date; end: Date } {
  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 1);
  return { start, end };
}

export function formatMonthRangeLabel(start: Date, end: Date) {
  const lastDay = new Date(end.getTime() - 1);
  const format = (date: Date) => `${date.getMonth() + 1}月${date.getDate()}日`;
  return `${format(start)}〜${format(lastDay)}`;
}

export async function getMonthlySummary(
  userId: string,
  range: { start: Date; end: Date } = getCurrentMonthRange(),
): Promise<MonthlySummary> {
  const expenses = await prisma.expense.findMany({
    where: { userId, spentAt: { gte: range.start, lt: range.end } },
    select: {
      amount: true,
      selfSharePercent: true,
      categoryId: true,
      category: { select: { name: true } },
    },
  });

  let amountTotal = 0;
  let partnerTotal = 0;
  const categoryMap = new Map<string, CategorySummary>();

  for (const expense of expenses) {
    amountTotal += expense.amount;
    partnerTotal += splitExpense(expense.amount, expense.selfSharePercent).partnerShare;

    const existing = categoryMap.get(expense.categoryId);
    if (existing) {
      existing.amountTotal += expense.amount;
      existing.count += 1;
    } else {
      categoryMap.set(expense.categoryId, {
        categoryId: expense.categoryId,
        name: expense.category.name,
        amountTotal: expense.amount,
        count: 1,
      });
    }
  }

  const categories = Array.from(categoryMap.values()).sort(
    (a, b) => b.amountTotal - a.amountTotal,
  );

  return {
    start: range.start,
    end: range.end,
    amountTotal,
    partnerTotal,
    expenseCount: expenses.length,
    categories,
  };
}
