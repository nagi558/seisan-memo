"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

// expenses/actions.tsのcategoryNameバリデーションと同一基準（trim・1文字以上・50文字以内）。
const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "カテゴリを入力してください")
  .max(50, "カテゴリは50文字以内で入力してください");

export type UpdateCategoryState = {
  errors?: Partial<Record<"name" | "_form", string[]>>;
  values?: { name: string };
};

export async function updateCategory(
  _prevState: UpdateCategoryState,
  formData: FormData,
): Promise<UpdateCategoryState> {
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");

  const parsed = categoryNameSchema.safeParse(name);
  if (!parsed.success) {
    return { errors: { name: parsed.error.flatten().formErrors }, values: { name } };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !id) {
    return { errors: { _form: ["ログインが必要です"] }, values: { name } };
  }

  try {
    // idとuserIdの両方をwhereに含めることで、他ユーザーのカテゴリを更新できないようにする。
    const result = await prisma.category.updateMany({
      where: { id, userId },
      data: { name: parsed.data },
    });

    if (result.count === 0) {
      return {
        errors: { _form: ["対象のカテゴリが見つかりませんでした"] },
        values: { name },
      };
    }
  } catch (error) {
    // @@unique([userId, name])により、同一ユーザー内で同名カテゴリへの変更は一意制約違反になる。
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        errors: { name: ["同じ名前のカテゴリが既に存在します"] },
        values: { name },
      };
    }
    console.error("Failed to update category", error);
    return {
      errors: { _form: ["更新に失敗しました。時間をおいて再度お試しください。"] },
      values: { name },
    };
  }

  revalidatePath("/categories");
  revalidatePath("/expenses");

  return { values: { name: parsed.data } };
}

export type DeleteCategoryState = {
  error?: string;
};

export async function deleteCategory(
  _prevState: DeleteCategoryState,
  formData: FormData,
): Promise<DeleteCategoryState> {
  const id = String(formData.get("id") ?? "");

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !id) {
    return { error: "ログインが必要です" };
  }

  // 削除確認UI表示後、別タブ等でExpenseが追加される競合を減らすため、
  // 実際の削除実行の直前に改めてExpense件数を確認する。
  const expenseCount = await prisma.expense.count({ where: { categoryId: id, userId } });
  if (expenseCount > 0) {
    return { error: "支出が紐づいているため削除できません" };
  }

  try {
    // idとuserIdの両方をwhereに含めることで、他ユーザーのカテゴリを削除できないようにする。
    const result = await prisma.category.deleteMany({ where: { id, userId } });

    if (result.count === 0) {
      return { error: "対象のカテゴリが見つかりませんでした" };
    }
  } catch (error) {
    // 上のcount確認と実際の削除の間に別タブ等でExpenseが追加された場合、
    // Expense.categoryIdのonDelete: Restrictにより外部キー制約エラーになる。
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return { error: "支出が紐づいているため削除できません" };
    }
    console.error("Failed to delete category", error);
    return { error: "削除に失敗しました。時間をおいて再度お試しください。" };
  }

  revalidatePath("/categories");
  revalidatePath("/expenses");

  return {};
}
