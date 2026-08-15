import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { UserSettingsForm } from "@/components/settings/user-settings-form";
import { prisma } from "@/lib/prisma";
import { getUserSettings } from "@/lib/settings";

import { completeOnboarding } from "./actions";

export default async function SetupPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  // proxy.tsで既にガードしているが、他ページと同様に画面側でも防御的に確認する。
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompletedAt: true },
  });

  if (user?.onboardingCompletedAt) {
    redirect("/");
  }

  const settings = await getUserSettings(userId);

  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-foreground text-xl font-semibold">はじめに設定しましょう</h1>
          <p className="text-muted-foreground text-sm">あとから変更できます</p>
        </div>

        <UserSettingsForm
          name={settings.name ?? ""}
          partnerName={settings.partnerName ?? ""}
          closingDay={settings.closingDay}
          action={completeOnboarding}
          submitLabel="はじめる"
          pendingLabel="保存中..."
        />
      </main>
    </div>
  );
}
