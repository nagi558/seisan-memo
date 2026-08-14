"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const numberFromForm = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label}を入力してください`)
    .regex(/^\d+$/, `${label}は0以上の整数で入力してください`)
    .transform(Number);

const expenseSchema = z.object({
  spentAt: z
    .string()
    .trim()
    .min(1, "日付を入力してください")
    .refine((v) => !Number.isNaN(Date.parse(v)), "日付の形式が正しくありません"),
  categoryName: z
    .string()
    .trim()
    .min(1, "カテゴリを入力してください")
    .max(50, "カテゴリは50文字以内で入力してください"),
  description: z.string().trim().max(200, "詳細は200文字以内で入力してください"),
  amount: numberFromForm("金額").pipe(z.number().positive("金額は1円以上で入力してください")),
  selfSharePercent: numberFromForm("負担割合").pipe(
    z
      .number()
      .min(0, "負担割合は0〜100で入力してください")
      .max(100, "負担割合は0〜100で入力してください"),
  ),
});

export type ExpenseFormValues = {
  spentAt: string;
  categoryName: string;
  description: string;
  amount: string;
  selfSharePercent: string;
};

export type ExpenseFormState = {
  errors?: Partial<Record<keyof ExpenseFormValues | "_form", string[]>>;
  values?: ExpenseFormValues;
};

export async function createExpense(
  _prevState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const values: ExpenseFormValues = {
    spentAt: String(formData.get("spentAt") ?? ""),
    categoryName: String(formData.get("categoryName") ?? ""),
    description: String(formData.get("description") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    selfSharePercent: String(formData.get("selfSharePercent") ?? ""),
  };

  const parsed = expenseSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { errors: { _form: ["ログインが必要です"] }, values };
  }

  const { spentAt, categoryName, description, amount, selfSharePercent } = parsed.data;

  let expenseId: string;

  try {
    const category = await prisma.category.upsert({
      where: { userId_name: { userId, name: categoryName } },
      create: { userId, name: categoryName },
      update: {},
    });

    const expense = await prisma.expense.create({
      data: {
        userId,
        categoryId: category.id,
        spentAt: new Date(spentAt),
        description: description.length > 0 ? description : null,
        amount,
        selfSharePercent,
      },
    });

    expenseId = expense.id;
  } catch (error) {
    console.error("Failed to create expense", error);
    return {
      errors: { _form: ["登録に失敗しました。時間をおいて再度お試しください。"] },
      values,
    };
  }

  redirect(`/expenses/${expenseId}/complete`);
}
