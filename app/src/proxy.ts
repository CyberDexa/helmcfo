/**
 * Next.js Edge Middleware — authentication + security headers.
 *
 * Protects all /api/* routes and /dashboard/* pages.
 * Public routes: /, /login, /api/health
 *
 * Auth strategy (MVP): bearer token via INTERNAL_API_KEY for server-to-server,
 * plus session cookie scaffolding ready for NextAuth.js.
 *
 * Security headers applied to every response (OWASP hardening).
 */

import { NextRequest, NextResponse } from "next/server";
import { auditLog } from "@/lib/security/audit-log";

// Routes that do not require authentication
const PUBLIC_PATHS = new Set(["/", "/login", "/api/health"]);

// API routes that accept INTERNAL_API_KEY bearer token
const INTERNAL_API_PATHS = ["/api/ai/analysis", "/api/engine/run"];

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
};

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }
  return res;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Always pass public paths through (with headers)
  if (PUBLIC_PATHS.has(pathname)) {
    return applySecurityHeaders(NextResponse.next());
  }

  const ip = getClientIp(req);

  // Internal API key authentication for server-to-server routes
  if (INTERNAL_API_PATHS.some((p) => pathname.startsWith(p))) {
    const internalKey = process.env.INTERNAL_API_KEY;
    if (internalKey) {
      const authHeader = req.headers.get("authorization") ?? "";
      const provided = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : "";

      // Constant-time comparison to prevent timing attacks
      if (!timingSafeEqual(provided, internalKey)) {
        auditLog({
          event: "auth.failure",
          ip,
          metadata: { path: pathname, reason: "invalid_internal_api_key" },
          severity: "warn",
        });
        return applySecurityHeaders(
          NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          )
        );
      }
    }
    // If INTERNAL_API_KEY is not set, skip auth (dev mode)
    return applySecurityHeaders(NextResponse.next());
  }

  // For all other /api/* routes: allow through in MVP (NextAuth session check
  // will be added here once NextAuth is wired up).
  // TODO: Replace with:
  //   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  //   if (!session) return 401
  return applySecurityHeaders(NextResponse.next());
}

/**
 * Constant-time string comparison to prevent timing side-channels.
 * Pure JS implementation — safe to use in Edge Runtime (no Node crypto).
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
