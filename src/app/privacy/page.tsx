import { BackButton } from "@/components/legal/back-button";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <BackButton />
        <h1 className="text-foreground text-lg font-semibold">プライバシーポリシー</h1>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-6">
        <div className="border-border bg-muted/40 rounded-2xl border p-4 text-sm">
          <p className="text-muted-foreground">
            本ポリシーは現時点でのドラフトです。正式公開前に内容の確認・必要に応じて専門家への確認を行ってください。
          </p>
        </div>

        <div className="border-border bg-card flex flex-col gap-6 rounded-2xl border p-5 shadow-sm">
          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">1. 取得する情報</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスでは、以下の情報を取得します。
            </p>
            <ul className="text-foreground list-disc pl-5 text-sm leading-relaxed">
              <li>Googleアカウントの情報（メールアドレス、氏名、プロフィール画像）</li>
              <li>本サービス内で登録したニックネーム（あなたの呼び名・相手の呼び名）</li>
              <li>支出に関する情報（日付、金額、カテゴリ、内容、負担割合）</li>
              <li>締め日等の設定情報</li>
            </ul>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">2. 利用目的</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、以下の目的で利用します。
            </p>
            <ul className="text-foreground list-disc pl-5 text-sm leading-relaxed">
              <li>本サービスの提供・運営（ログイン認証、支出の記録・集計表示）</li>
              <li>ユーザーサポートのための連絡</li>
              <li>サービスの改善・不具合対応</li>
            </ul>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">3. Google OAuthについて</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスのログインには、Googleが提供するOAuth認証を利用しています。ログイン時にGoogleアカウントのメールアドレス・氏名・プロフィール画像へのアクセス許可を取得しますが、Googleアカウントのパスワードを本サービスが取得・保存することはありません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">
              4. 支出・相手（Partner）等の登録データ
            </h2>
            <p className="text-foreground text-sm leading-relaxed">
              ユーザーが登録した支出データ、相手（Partner）のニックネーム、カテゴリ、締め日等の設定は、本サービスの計算・表示機能を提供する目的でのみ利用し、本サービスの利用者本人以外がその内容を閲覧できる状態で公開することはありません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">5. 第三者提供</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">6. データの管理</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、適切な安全管理措置のもとデータベースで管理します。ユーザーがアカウントの削除を希望する場合は、下記のお問い合わせ先までご連絡ください。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">7. お問い合わせ先</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本ポリシーに関するお問い合わせ先は現在準備中です。正式公開までに運営者情報・連絡先を追記します。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">8. 改定</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本ポリシーの内容は、必要に応じて予告なく変更されることがあります。変更後の内容は、本サービス上に表示した時点から効力を生じるものとします。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
