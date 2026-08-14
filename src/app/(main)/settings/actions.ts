"use server";

import { z } from "zod";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

const CLOSING_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => String(i + 1));

const settingsSchema = z.object({
  name: z.string().trim().min(1, "呼び名を入力してください").max(50, "呼び名は50文字以内で入力してください"),
  partnerName: z.string().trim().max(50, "相手の呼び名は50文字以内で入力してください"),
  closingDay: z
    .string()
    .refine(
      (v) => v === "" || CLOSING_DAY_OPTIONS.includes(v),
      "締め日の指定が正しくありません",
    ),
});

export type SettingsFormValues = {
  name: string;
  partnerName: string;
  closingDay: string;
};

export type SettingsFormState = {
  errors?: Partial<Record<keyof SettingsFormValues | "_form", string[]>>;
  values?: SettingsFormValues;
  success?: boolean;
};

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

  const { name, partnerName, closingDay } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { name, closingDay: closingDay === "" ? null : Number(closingDay) },
      });

      if (partnerName.length > 0) {
        await tx.partner.upsert({
          where: { userId },
          create: { userId, name: partnerName },
          update: { name: partnerName },
        });
      } else {
        await tx.partner.deleteMany({ where: { userId } });
      }
    });
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
