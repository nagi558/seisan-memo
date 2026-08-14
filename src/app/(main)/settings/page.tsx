import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserSettings } from "@/lib/settings";

import { logout } from "./actions";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const settings = await getUserSettings(userId);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">設定</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <SettingsForm
          name={settings.name ?? ""}
          partnerName={settings.partnerName ?? ""}
          closingDay={settings.closingDay}
        />

        <form action={logout}>
          <button
            type="submit"
            className="text-destructive w-full rounded-xl py-3 text-center text-sm font-medium"
          >
            ログアウト
          </button>
        </form>
      </main>
    </div>
  );
}
