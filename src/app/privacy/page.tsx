import { Mail } from "lucide-react";

import { BackButton } from "@/components/legal/back-button";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <BackButton />
        <h1 className="text-foreground text-lg font-semibold">プライバシーポリシー</h1>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-6">
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
              本サービスのログインには、Googleが提供するOAuth認証を利用しています。ログイン時にGoogleアカウントのメールアドレス・氏名・プロフィール画像へのアクセス許可を取得します。認証およびアカウント連携の維持のため、Googleから発行される認証情報（アクセストークン等）を本サービス側で保存しますが、Googleアカウントのパスワードを本サービスが取得・保存することはありません。
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
            <h2 className="text-foreground text-base font-semibold">5. Cookie・セッションの利用</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスは、ログイン状態を維持するためCookieおよびセッション情報を利用します。セッションはサーバー側のデータベースで管理し、Cookieにはセッションを識別するための情報のみを保存します。広告配信を目的としたCookieは使用していません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">6. 保存期間</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、ユーザーのアカウントが存続する間、本サービスの提供に必要な範囲で保存します。ユーザーが設定画面からアカウントを削除した場合、本サービス内のユーザーデータは削除されます（詳細は「8. データの管理」をご確認ください）。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">7. 第三者提供</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、法令に基づく場合を除き、ユーザーの同意なく第三者に提供することはありません。本サービスでは、広告配信や利用状況の分析を目的とした外部サービス（アクセス解析ツール等）は導入していません。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">8. データの管理</h2>
            <p className="text-foreground text-sm leading-relaxed">
              取得した情報は、適切な安全管理措置のもとデータベースで管理します。ユーザーは設定画面からいつでも自身でアカウントを削除でき、削除すると支出・カテゴリ・相手の呼び名などの関連データも含めて本サービス内のユーザーデータが削除されます。この削除操作は元に戻すことができません。
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスのアカウントを削除しても、Googleアカウント自体は削除されず、Google側の本サービスに対する連携許可も本サービスから自動的に取り消すものではありません。Google側の連携許可については、Googleアカウントの設定画面からユーザー自身でご確認・管理いただけます。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">9. 運営者・お問い合わせ先</h2>
            <p className="text-foreground text-sm leading-relaxed">本サービスの運営者は nagi です。</p>
            <p className="text-foreground text-sm leading-relaxed">
              本ポリシーおよび本サービスに関するお問い合わせは、以下のボタンからお願いします。
            </p>
            <Button
              variant="outline"
              className="w-fit"
              render={<a href="mailto:glacier.ice.movie@gmail.com" />}
            >
              <Mail />
              お問い合わせ
            </Button>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">10. 改定</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本ポリシーの内容は、必要に応じて予告なく変更されることがあります。変更後の内容は、本サービス上に表示した時点から効力を生じるものとします。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
