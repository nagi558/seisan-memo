import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { AdapterSession } from "next-auth/adapters";
import Google from "next-auth/providers/google";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const baseAdapter = PrismaAdapter(prisma);

// アカウント削除（Expense→Category→Userの順でtransaction削除）ではUser削除時の
// onDelete: CascadeでSessionが既に消えており、その後のsignOut()内部で呼ばれる
// deleteSessionが対象なしのP2025を投げてSignOutErrorとしてログに残ってしまう。
// deleteSessionの戻り値の型は元々AdapterSession | null | undefinedを許容しており
// 「対象が無ければnull」はAdapterの契約として正当な応答のため、P2025のときだけ
// nullを返して吸収する。P2025以外のDBエラーはそのままthrowし、握り潰さない。
const adapter = {
  ...baseAdapter,
  deleteSession: async (sessionToken: string): Promise<AdapterSession | null> => {
    try {
      // PrismaAdapter標準実装（p.session.delete）と同じ検索条件・削除対象のまま、
      // P2025（対象なし）だけを吸収する。
      return await prisma.session.delete({ where: { sessionToken } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        return null;
      }
      throw error;
    }
  },
};

// 既存アカウントでの再ログイン時、@auth/coreはadapter.updateUserを呼ばずgetUserByAccountの
// 結果をそのまま使う（emailプロバイダのemailVerified更新を除く）。そのため設定画面で
// User.nameを編集しても、次回のGoogle再ログインでプロフィール名に上書きされることはない。
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
});
