import { redirect } from "next/navigation";

import { auth } from "@/auth";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 border-b px-4 py-3">
        <h1 className="text-foreground text-lg font-semibold">設定</h1>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
        <p className="text-muted-foreground text-sm">設定画面は準備中です。</p>
      </main>
    </div>
  );
}
