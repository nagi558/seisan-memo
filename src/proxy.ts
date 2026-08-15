import { NextResponse } from "next/server";

import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/login"];
const SETUP_ROUTE = "/setup";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!req.auth && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (req.auth && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (req.auth) {
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
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
