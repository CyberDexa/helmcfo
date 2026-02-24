/**
 * Structured audit log for financial data access events.
 * Writes to stdout as newline-delimited JSON (NDJSON) for ingestion by
 * any log aggregator (Datadog, Logtail, AWS CloudWatch, etc.).
 *
 * Usage:
 *   auditLog({ event: "snapshot.read", companyId, userId, ip })
 *   auditLog({ event: "token.write", companyId, userId, integration: "plaid" })
 */

export type AuditEvent =
  // Data access
  | "snapshot.read"
  | "engine.run"
  // AI
  | "ai.chat"
  | "ai.analysis"
  // Integration tokens
  | "token.write"
  | "token.read"
  | "token.delete"
  // Auth
  | "auth.success"
  | "auth.failure"
  | "auth.logout"
  // Admin
  | "settings.update"
  | "company.create"
  | "company.delete";

export interface AuditLogEntry {
  event: AuditEvent;
  companyId?: string;
  userId?: string;
  ip?: string;
  integration?: string;
  metadata?: Record<string, unknown>;
  /** Automatically set — do not pass in. */
  timestamp?: string;
  severity?: "info" | "warn" | "error";
}

/**
 * Write a structured audit log entry to stdout.
 * In production, pipe stdout to your log aggregator.
 */
export function auditLog(entry: AuditLogEntry): void {
  const record = {
    ...entry,
    timestamp: new Date().toISOString(),
    severity: entry.severity ?? "info",
    service: "helmcfo",
  };

  // console.log is available in both Node.js and Edge Runtime;
  // in production pipe your log aggregator to capture these NDJSON lines.
  console.log(JSON.stringify(record));
}

/**
 * Build a partial audit entry from a Next.js Request object.
 * Extracts IP from standard headers (Vercel / Cloudflare / Express).
 */
export function auditFromRequest(
  req: Request
): Pick<AuditLogEntry, "ip"> {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  return { ip };
}
