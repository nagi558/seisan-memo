import { NextResponse } from "next/server";

import { auth } from "@/auth";

const LOGIN_ROUTE = "/login";
// /termsと/privacyは認証状態に関わらずそのまま表示する完全な公開ページ。
// /loginだけが「認証済みなら/へリダイレクトする」特殊な公開ルートとして扱う。
const FULLY_PUBLIC_ROUTES = ["/terms", "/privacy"];
const PUBLIC_ROUTES = [LOGIN_ROUTE, ...FULLY_PUBLIC_ROUTES];
const SETUP_ROUTE = "/setup";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isFullyPublicRoute = FULLY_PUBLIC_ROUTES.includes(pathname);

  if (!req.auth && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, req.nextUrl));
  }

  if (req.auth && pathname === LOGIN_ROUTE) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // /terms・/privacyは初期設定の完了状態に関わらずそのまま表示するため、
  // オンボーディング判定の対象から除外する。
  if (req.auth && !isFullyPublicRoute) {
    // database session戦略では、adapterが返すUserレコード全体が
    // session.userにマージされるため、追加のDBクエリなしで参照できる。
    const isOnboardingComplete = Boolean(req.auth.user?.onboardingCompletedAt);

    if (!isOnboardingComplete && pathname !== SETUP_ROUTE) {
      return NextResponse.redirect(new URL(SETUP_ROUTE, req.nextUrl));
    }

    if (isOnboardingComplete && pathname === SETUP_ROUTE) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest|icon.png|apple-icon.png).*)",
  ],
};
