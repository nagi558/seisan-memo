import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MainNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-10 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <span className="bg-accent absolute top-0 right-2 size-3 rounded-full" />
        <span className="bg-primary/70 absolute bottom-2 left-0 size-2.5 rounded-full" />
        <div className="bg-primary flex size-20 items-center justify-center rounded-full">
          <SearchX className="text-primary-foreground size-10" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-foreground">ページが見つかりません</h1>
        <p className="text-muted-foreground text-sm">
          お探しのページは存在しないか、
          <br />
          移動または削除された可能性があります。
        </p>
      </div>

      <Button
        className="h-11 w-full max-w-xs rounded-xl text-base"
        render={<Link href="/" />}
      >
        ホームへ戻る
      </Button>
    </main>
  );
}
