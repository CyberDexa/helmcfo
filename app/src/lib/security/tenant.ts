/**
 * Tenant isolation utilities.
 * Every database query / data access MUST be scoped to a companyId.
 * These helpers make it easy to enforce that invariant at the edge
 * and throw early if an operation would cross tenant boundaries.
 */

export interface TenantContext {
  companyId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
}

/**
 * Assert that a resource belongs to the authenticated tenant.
 * Throws if the IDs do not match — prevents IDOR / broken access control.
 *
 * Usage:
 *   assertTenantOwnership(ctx.companyId, record.companyId)
 */
export function assertTenantOwnership(
  authenticatedCompanyId: string,
  resourceCompanyId: string
): void {
  if (authenticatedCompanyId !== resourceCompanyId) {
    throw new TenantViolationError(
      `Tenant isolation violation: authenticated as '${authenticatedCompanyId}' but attempted to access resource of '${resourceCompanyId}'`
    );
  }
}

/**
 * Scope an object of query filters to the current tenant.
 * Always call this before running a DB query.
 *
 * Usage:
 *   const where = scopeToTenant({ status: "active" }, ctx.companyId)
 *   // → { status: "active", companyId: "acme" }
 */
export function scopeToTenant<T extends Record<string, unknown>>(
  filters: T,
  companyId: string
): T & { companyId: string } {
  return { ...filters, companyId };
}

/**
 * Strip any companyId a client might inject in a request body.
 * Always sanitize before passing user input to DB writes.
 */
export function sanitizeTenantInput<T extends Record<string, unknown>>(
  input: T
): Omit<T, "companyId" | "userId"> {
  const { companyId: _c, userId: _u, ...safe } = input as T & {
    companyId?: unknown;
    userId?: unknown;
  };
  return safe as Omit<T, "companyId" | "userId">;
}

export class TenantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantViolationError";
  }
}
