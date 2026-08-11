import Link from "next/link";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <main className="bg-background flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-foreground text-2xl font-semibold">精算メモ</h1>
      <p className="text-muted-foreground">
        ようこそ、{session?.user?.name ?? session?.user?.email}さん
      </p>
      <Button render={<Link href="/expenses" />}>支出一覧を見る</Button>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <Button type="submit" variant="outline">
          ログアウト
        </Button>
      </form>
    </main>
  );
}
