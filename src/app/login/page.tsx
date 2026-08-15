import { HandCoins } from "lucide-react";
import Link from "next/link";

import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-10 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <span className="bg-accent absolute top-0 right-2 size-3 rounded-full" />
        <span className="bg-primary/70 absolute bottom-2 left-0 size-2.5 rounded-full" />
        <div className="bg-primary flex size-20 items-center justify-center rounded-full">
          <HandCoins className="text-primary-foreground size-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">精算メモ</h1>
        <p className="text-muted-foreground text-sm">
          立て替えた支出を、かんたん精算。
          <br />
          立て替えたお金を記録して、あとでスムーズに精算しよう。
        </p>
      </div>

      <ul className="text-muted-foreground flex flex-col gap-1.5 text-sm">
        <li>支出と負担割合を記録して、相手への請求額を自動計算</li>
        <li>カテゴリ別・月別/年別のレポートで支出を見える化</li>
        <li>締め日に合わせて毎月の精算タイミングを管理</li>
      </ul>

      <div className="flex w-full max-w-xs flex-col gap-4">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <Button type="submit" className="h-11 w-full rounded-xl text-base">
            Googleでログイン
          </Button>
        </form>

        <p className="text-muted-foreground text-xs leading-relaxed">
          ログインすることで、
          <Link href="/terms" className="text-primary underline underline-offset-2">
            利用規約
          </Link>
          と
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            プライバシーポリシー
          </Link>
          に同意したものとみなします。
        </p>
      </div>
    </main>
  );
}
