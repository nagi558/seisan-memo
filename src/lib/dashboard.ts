import { prisma } from "@/lib/prisma";
import { splitExpense } from "@/lib/expense";

export type CategorySummary = {
  categoryId: string;
  name: string;
  amountTotal: number;
  count: number;
};

export type PeriodSummary = {
  start: Date;
  end: Date;
  amountTotal: number;
  partnerTotal: number;
  expenseCount: number;
  // amountTotal 降順
  categories: CategorySummary[];
};

export type CategoryBucket = {
  key: string;
  name: string;
  amountTotal: number;
};

// 1〜28日のみ有効な締め日として扱う（29〜31日は月によって存在しないため対象外）。
// 範囲外・null・undefinedは「毎月末日」を意味するnullに正規化する。
function normalizeClosingDay(closingDay?: number | null): number | null {
  if (closingDay == null) return null;
  return closingDay >= 1 && closingDay <= 28 ? closingDay : null;
}

// closingDayがnull（毎月末日）の場合は暦月（1日〜末日）。
// closingDayがD（1〜28）の場合は「前月(D+1)日〜当月D日」を月度の範囲とする。
// 例: 締め日10日の8月度 → 7月11日〜8月10日
export function getMonthRange(
  year: number,
  month: number,
  closingDay?: number | null,
): { start: Date; end: Date } {
  const day = normalizeClosingDay(closingDay);

  if (day === null) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    return { start, end };
  }

  const start = new Date(year, month - 2, day + 1);
  const end = new Date(year, month - 1, day + 1);
  return { start, end };
}

export function getCurrentMonthRange(
  base: Date = new Date(),
  closingDay?: number | null,
): { start: Date; end: Date } {
  const day = normalizeClosingDay(closingDay);

  if (day === null) {
    return getMonthRange(base.getFullYear(), base.getMonth() + 1);
  }

  // 締め日を過ぎていれば、現在の精算期間は「翌月度」に属する。
  const month = base.getMonth() + 1 + (base.getDate() > day ? 1 : 0);
  return getMonthRange(base.getFullYear(), month, day);
}

export function getYearRange(year: number): { start: Date; end: Date } {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return { start, end };
}

export function formatMonthRangeLabel(start: Date, end: Date) {
  const lastDay = new Date(end.getTime() - 1);
  const format = (date: Date) => `${date.getMonth() + 1}月${date.getDate()}日`;
  return `${format(start)}〜${format(lastDay)}`;
}

export function formatYearMonthLabel(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

export function formatYearLabel(date: Date) {
  return `${date.getFullYear()}年`;
}

// 範囲（月・年どちらでも可）に対する集計。範囲の意味は呼び出し側が決める。
export async function getPeriodSummary(
  userId: string,
  range: { start: Date; end: Date } = getCurrentMonthRange(),
): Promise<PeriodSummary> {
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

const OTHER_CATEGORY_KEY = "__other__";

// 上位N件を個別表示し、残りを「その他」に集約する（ホーム画面・レポート画面で共通）
export function buildTopCategoriesWithOther(
  categories: CategorySummary[],
  topCount = 3,
): CategoryBucket[] {
  const top = categories.slice(0, topCount);
  const rest = categories.slice(topCount);
  const otherTotal = rest.reduce((sum, category) => sum + category.amountTotal, 0);

  return [
    ...top.map((category) => ({
      key: category.categoryId,
      name: category.name,
      amountTotal: category.amountTotal,
    })),
    ...(rest.length > 0
      ? [{ key: OTHER_CATEGORY_KEY, name: "その他", amountTotal: otherTotal }]
      : []),
  ];
}
