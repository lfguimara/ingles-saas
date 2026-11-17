import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!req.cookies.get("speakup_session")) {
    return NextResponse.redirect(new URL("/cadastro", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/app/:path*"] };
