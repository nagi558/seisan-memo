import { BackButton } from "@/components/legal/back-button";

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <BackButton />
        <h1 className="text-foreground text-lg font-semibold">利用規約</h1>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-6">
        <div className="border-border bg-muted/40 rounded-2xl border p-4 text-sm">
          <p className="text-muted-foreground">
            本規約は現時点でのドラフトです。正式公開前に内容の確認・必要に応じて専門家への確認を行ってください。
          </p>
        </div>

        <div className="border-border bg-card flex flex-col gap-6 rounded-2xl border p-5 shadow-sm">
          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第1条（適用）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本規約は、本サービス「精算メモ」（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーは、本規約に同意の上、本サービスを利用するものとします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第2条（サービスの内容）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスは、ユーザーが立て替えた支出（日付・カテゴリ・内容・金額・負担割合）を記録し、あらかじめ設定された負担割合に基づいて相手への請求額の目安を計算・表示するサービスです。
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスは、金銭の送金・決済・第三者への支払い等の金融機能を提供するものではありません。実際の精算・支払いはユーザー間で本サービス外にて行ってください。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第3条（利用登録・アカウント）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスの利用には、Googleアカウントによるログインが必要です。ユーザーは、自己の責任においてアカウントを管理するものとし、第三者による不正利用について、運営者は故意または重過失がある場合を除き責任を負いません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第4条（禁止事項）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
            </p>
            <ul className="text-foreground list-disc pl-5 text-sm leading-relaxed">
              <li>本サービスの運営を妨害する行為</li>
              <li>虚偽の情報を登録する行為</li>
              <li>他のユーザーのアカウントを不正に使用する行為</li>
              <li>法令または公序良俗に反する行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ul>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第5条（免責事項）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスが提供する計算結果・表示内容の正確性について、運営者はいかなる保証も行いません。本サービスの利用により生じた損害について、運営者は故意または重過失がある場合を除き責任を負いません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第6条（サービス内容の変更・停止）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              運営者は、ユーザーへの事前の通知なく、本サービスの内容を変更し、または提供を停止・終了することができるものとします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第7条（規約の変更）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              運営者は、必要と判断した場合には、ユーザーへの通知なく本規約を変更できるものとします。変更後の規約は、本サービス上に表示した時点から効力を生じるものとします。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
