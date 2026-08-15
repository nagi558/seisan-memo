"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  applyUserSettings,
  settingsSchema,
  type SettingsFormState,
  type SettingsFormValues,
} from "@/lib/settings";

export async function completeOnboarding(
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
    await applyUserSettings(userId, parsed.data, { onboardingCompletedAt: new Date() });
  } catch (error) {
    console.error("Failed to complete onboarding", error);
    return {
      errors: { _form: ["保存に失敗しました。時間をおいて再度お試しください。"] },
      values,
    };
  }

  redirect("/");
}
