import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

// 既存アカウントでの再ログイン時、@auth/coreはadapter.updateUserを呼ばずgetUserByAccountの
// 結果をそのまま使う（emailプロバイダのemailVerified更新を除く）。そのため設定画面で
// User.nameを編集しても、次回のGoogle再ログインでプロフィール名に上書きされることはない。
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
});
