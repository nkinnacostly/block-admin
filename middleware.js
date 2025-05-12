// middleware.js

import { NextResponse } from "next/server";

export default function middleware(req) {
  // console.log(req);
  let loggedin = req.cookies.get("__session");
  const { pathname } = req.nextUrl;
  if (loggedin && pathname === "/login") {
    // return NextResponse.redirect(new URL("/dashboard", "127.0.0.1:3000"));
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!loggedin && pathname.includes("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
