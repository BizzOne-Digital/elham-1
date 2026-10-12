import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { getRequestHostname, isPreviewOrLocalHost } from "@/lib/seo/crawler";
import { CANONICAL_SITE_HOST } from "@/lib/seo/site-url";

const PREVIEW_ROBOTS = "noindex, nofollow, noarchive";

function withPreviewNoIndex(response: NextResponse, hostname: string): NextResponse {
  if (isPreviewOrLocalHost(hostname)) {
    response.headers.set("X-Robots-Tag", PREVIEW_ROBOTS);
  }
  return response;
}

const adminAuth = withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname === "/admin/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname === "/admin/login") {
          return true;
        }
        return !!token;
      },
    },
  },
);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const hostname = getRequestHostname(req.headers.get("host"));

  if (hostname === "netbrandit.com") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_SITE_HOST;
    return NextResponse.redirect(url, 308);
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const response = adminAuth(req as NextRequestWithAuth, event);
    if (response instanceof NextResponse) {
      return withPreviewNoIndex(response, hostname);
    }
    return response;
  }

  return withPreviewNoIndex(NextResponse.next(), hostname);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml)$).*)",
  ],
};
