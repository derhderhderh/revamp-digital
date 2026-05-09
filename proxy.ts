import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/client-portal", "/admin"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const hasFirebase = Boolean(process.env.FIREBASE_PROJECT_ID);
  const hasSession = Boolean(request.cookies.get("session")?.value);

  if (process.env.NODE_ENV === "production" && hasFirebase && !hasSession) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/client-portal/:path*", "/admin/:path*"]
};
