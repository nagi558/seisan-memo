import { BackButton } from "@/components/legal/back-button";

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-border bg-background sticky top-0 z-10 flex items-center gap-2 border-b px-4 py-3">
        <BackButton />
        <h1 className="text-foreground text-lg font-semibold">利用規約</h1>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-6">
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
              本サービスは、金銭の送金・決済・第三者への支払い等の金融機能を提供するものではありません。実際の精算・支払いはユーザー間で本サービス外にて行ってください。現時点で、本サービスに有料の機能や課金は存在しません。
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
            <h2 className="text-foreground text-base font-semibold">第5条（アカウントの削除・退会）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              ユーザーは、設定画面からいつでも自身の判断で本サービスのアカウントを削除できます。アカウントを削除すると、支出・カテゴリ等の関連データを含め、本サービス内のユーザーデータは削除され、元に戻すことはできません。
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              アカウントの削除は、本サービス内のデータおよびGoogleとの連携情報の削除であり、Googleアカウント自体を削除するものではありません。詳細はプライバシーポリシーをご確認ください。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第6条（知的財産権）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスが提供するプログラム・デザイン等に関する著作権その他の知的財産権は、運営者または正当な権利を有する者に帰属します。ユーザーが本サービスに登録した支出データ等の内容に関する権利はユーザーに帰属します。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第7条（免責事項）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスは、運営者が個人で無料により提供するサービスです。運営者は、本サービスについて、特定の目的への適合性、完全性、正確性、有用性、および中断や不具合のない継続的な提供を保証するものではありません。
            </p>
            <ul className="text-foreground list-disc pl-5 text-sm leading-relaxed">
              <li>本サービスの内容、機能、仕様は、予告なく変更、追加、停止または終了する場合があります。</li>
              <li>
                本サービスに保存されたデータについて、完全に保存されること、消失しないこと、および消失した場合に復元できることを保証するものではありません。
              </li>
              <li>ユーザーが本サービスに入力・登録する情報の内容および管理については、ユーザー自身が責任を負うものとします。</li>
              <li>
                Google等、本サービスが利用する外部サービスの仕様変更、障害、提供の中断または終了等により生じた事項について、運営者は責任を負いません。
              </li>
              <li>
                ユーザーと他のユーザーまたは第三者との間で生じたトラブルについては、当事者間で解決するものとし、運営者はその解決に関与しません。
              </li>
            </ul>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスの利用または利用できなかったことにより生じた損害について、運営者は、法令上許される範囲で、責任を負わないものとします。前段にかかわらず運営者が損害賠償責任を負う場合であっても、法令上許される範囲で、その賠償の範囲は通常生じうる直接の損害に限るものとし、逸失利益、事業機会の損失、その他の間接損害または特別損害については、責任を負わないものとします。
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              前二項の規定は、法令上、運営者の責任を免除し、または制限することが認められない場合には、その認められない範囲においては適用しないものとします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第8条（サービス内容の変更・停止）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              運営者は、ユーザーへの事前の通知なく、本サービスの内容を変更し、または提供を停止・終了することができるものとします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第9条（規約の変更）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              運営者は、必要と判断した場合には、ユーザーへの通知なく本規約を変更できるものとします。変更後の規約は、本サービス上に表示した時点から効力を生じるものとします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第10条（準拠法・裁判管轄）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、日本の裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <div className="bg-border h-px" />

          <section className="flex flex-col gap-2">
            <h2 className="text-foreground text-base font-semibold">第11条（運営者）</h2>
            <p className="text-foreground text-sm leading-relaxed">
              本サービスの運営者は nagi です。本規約およびプライバシーポリシーに関するお問い合わせは、プライバシーポリシーに記載の方法によりご連絡ください。
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
