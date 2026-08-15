"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function updateExpense(
  _prevState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const id = String(formData.get("id") ?? "");

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

  if (!id) {
    return { errors: { _form: ["不正なリクエストです"] }, values };
  }

  const { spentAt, categoryName, description, amount, selfSharePercent } = parsed.data;

  try {
    const category = await prisma.category.upsert({
      where: { userId_name: { userId, name: categoryName } },
      create: { userId, name: categoryName },
      update: {},
    });

    // userIdもwhereに含めることで、他ユーザーの支出を更新できないようにする。
    const result = await prisma.expense.updateMany({
      where: { id, userId },
      data: {
        categoryId: category.id,
        spentAt: new Date(spentAt),
        description: description.length > 0 ? description : null,
        amount,
        selfSharePercent,
      },
    });

    if (result.count === 0) {
      return { errors: { _form: ["対象の支出が見つかりませんでした"] }, values };
    }
  } catch (error) {
    console.error("Failed to update expense", error);
    return {
      errors: { _form: ["更新に失敗しました。時間をおいて再度お試しください。"] },
      values,
    };
  }

  redirect("/expenses");
}

export async function deleteExpense(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !id) {
    return;
  }

  // userIdもwhereに含めることで、他ユーザーの支出を削除できないようにする。
  await prisma.expense.deleteMany({ where: { id, userId } });

  // useActionStateを使わない素のform actionのため、削除後に一覧を明示的に再検証する。
  revalidatePath("/expenses");
}
