import { auth } from "@/auth"
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }
  if(req.auth && (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/login")){
    const homeUrl = new URL("/home", req.nextUrl.origin);
    return Response.redirect(homeUrl);
  }
  return NextResponse.next();
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.css).*)"],
};