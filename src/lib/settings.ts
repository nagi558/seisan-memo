import { z } from "zod";

import { prisma } from "@/lib/prisma";

export type UserSettings = {
  name: string | null;
  closingDay: number | null;
  partnerName: string | null;
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, closingDay: true, partner: { select: { name: true } } },
  });

  return {
    name: user?.name ?? null,
    closingDay: user?.closingDay ?? null,
    partnerName: user?.partner?.name ?? null,
  };
}

// 相手の呼び名が未設定の場合は既存どおり「相手」と表示する。
export function resolvePartnerLabel(partnerName: string | null | undefined) {
  return partnerName && partnerName.trim().length > 0 ? partnerName : "相手";
}

// /settings・/setup（初期設定）で共通利用するバリデーション・保存ロジック。
const CLOSING_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => String(i + 1));

export const settingsSchema = z.object({
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

// User.name/closingDayの更新とPartnerのupsert/削除を1トランザクションで行う。
// extraUserDataは/setupがonboardingCompletedAtを同一トランザクションで
// 一緒に更新するために使う（保存の原子性を保つため）。
export async function applyUserSettings(
  userId: string,
  values: z.infer<typeof settingsSchema>,
  extraUserData?: { onboardingCompletedAt?: Date },
) {
  const { name, partnerName, closingDay } = values;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        name,
        closingDay: closingDay === "" ? null : Number(closingDay),
        ...extraUserData,
      },
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
}
