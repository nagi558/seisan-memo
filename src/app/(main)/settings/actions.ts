"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  applyUserSettings,
  settingsSchema,
  type SettingsFormState,
  type SettingsFormValues,
} from "@/lib/settings";

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const values: SettingsFormValues = {
    name: String(formData.get("name") ?? ""),
    partnerName: String(formData.get("partnerName") ?? ""),
    closingDay: String(formData.get("closingDay") ?? ""),
  };

  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { errors: { _form: ["ログインが必要です"] }, values };
  }

  try {
    await applyUserSettings(userId, parsed.data);
  } catch (error) {
    console.error("Failed to update settings", error);
    return {
      errors: { _form: ["保存に失敗しました。時間をおいて再度お試しください。"] },
      values,
    };
  }

  return { values, success: true };
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export type DeleteAccountState = {
  error?: string;
};

export async function deleteAccount(): Promise<DeleteAccountState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { error: "ログインが必要です" };
  }

  try {
    // Account/Session/PartnerはonDelete: CascadeでUser削除時に自動削除されるが、
    // Expense.categoryIdはCategoryへonDelete: Restrictのため、
    // Categoryより先にExpenseを削除しておかないと外部キー制約違反になり得る。
    await prisma.$transaction(async (tx) => {
      await tx.expense.deleteMany({ where: { userId } });
      await tx.category.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });
  } catch (error) {
    console.error("Failed to delete account", error);
    return { error: "削除に失敗しました。時間をおいて再度お試しください。" };
  }

  await signOut({ redirectTo: "/login" });
  return {};
}
