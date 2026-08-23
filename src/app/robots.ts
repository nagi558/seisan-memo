import type { MetadataRoute } from "next";

// 本サービスはGoogleログイン必須のため、/terms・/privacyの完全公開ページのみ
// クロールを許可し、それ以外（アプリ内部画面・認証関連画面）は一律で禁止する。
// 個別ルートを列挙する方式だと将来ルート追加時の許可漏れ・禁止漏れが起きるため、
// 「原則禁止、公開ページのみ許可」という向きで実装する。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/terms", "/privacy"],
      disallow: "/",
    },
  };
}
