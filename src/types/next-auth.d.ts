import type { DefaultSession } from "next-auth";

// database session戦略では、adapterが返すUserレコード全体がsession.userに
// マージされる（next-authのラッパー実装による）。onboardingCompletedAtは
// proxy.tsでの初期設定判定に使うため、型定義に追加しておく。
declare module "next-auth" {
  interface User {
    onboardingCompletedAt?: Date | null;
  }

  interface Session {
    user?: DefaultSession["user"] & {
      onboardingCompletedAt?: Date | null;
    };
  }
}
