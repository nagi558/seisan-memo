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
