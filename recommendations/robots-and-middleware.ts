// F19, F20: protect admin/portal with auth (not robots), and generate robots.txt from one constant

// ---------- app/robots.ts ----------
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    // No /admin or /portal here: listing them advertises them. Protect them with auth instead.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

// ---------- middleware.ts ----------
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;
  // Placeholder: verify a signed session/JWT here (signature, expiry, role)
  if (!token /* || !isValid(token) */) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin/:path*", "/portal/:path*"] };

// ---------- Session cookie settings (login route) ----------
// res.cookies.set("session", token, {
//   httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60,
// });

// ---------- Further hardening for /admin ----------
// - MFA (TOTP/WebAuthn) for admin accounts
// - Rate limit and lock out the login endpoint (see inquiry-route.ts for the pattern)
// - Role-based checks on every API route, not only in middleware
// - IP allow-list or Vercel Firewall rule for /admin
// - Audit log of admin actions
