/**
 * SOC 2 Type II Controls Framework
 * Maps to AICPA Trust Service Criteria (TSC)
 * 
 * Categories:
 *  CC - Common Criteria (Security)
 *  A  - Availability
 *  C  - Confidentiality
 *  PI - Processing Integrity
 *  P  - Privacy
 */

export type TSCCategory = "CC" | "A" | "C" | "PI" | "P";
export type ControlStatus = "implemented" | "in-progress" | "planned" | "not-applicable";

export interface Control {
  id: string;
  category: TSCCategory;
  criteria: string;
  title: string;
  description: string;
  implementationNotes: string;
  evidenceType: string[];
  status: ControlStatus;
  owner: string;
  lastReviewed?: string;
}

export interface EvidenceItem {
  controlId: string;
  type: "policy" | "log" | "screenshot" | "config" | "test-result" | "audit-trail";
  description: string;
  location: string;
  collectedAt: string;
}

// ── COMMON CRITERIA (CC) — SECURITY ─────────────────────────────────────────

export const controls: Control[] = [
  // CC1 — Control Environment
  {
    id: "CC1.1",
    category: "CC",
    criteria: "CC1.1",
    title: "Risk Management Program",
    description: "The entity demonstrates a commitment to integrity and ethical values.",
    implementationNotes: "Code of conduct, security training, monthly risk reviews.",
    evidenceType: ["policy", "training-records"],
    status: "implemented",
    owner: "CEO",
    lastReviewed: "2026-01-15",
  },
  {
    id: "CC2.1",
    category: "CC",
    criteria: "CC2.1",
    title: "Information Security Policy",
    description: "Formal information security policy communicated to all personnel.",
    implementationNotes: "Security policy documented in internal wiki, signed by all employees.",
    evidenceType: ["policy", "signed-acknowledgments"],
    status: "implemented",
    owner: "CTO",
    lastReviewed: "2026-01-15",
  },

  // CC3 — Risk Assessment
  {
    id: "CC3.1",
    category: "CC",
    criteria: "CC3.1",
    title: "Risk Assessment Process",
    description: "Risk assessment performed at least annually and when significant changes occur.",
    implementationNotes: "Quarterly risk register reviewed by leadership. Documented threats, likelihood, impact.",
    evidenceType: ["risk-register", "meeting-minutes"],
    status: "implemented",
    owner: "CTO",
    lastReviewed: "2026-02-01",
  },

  // CC4 — Monitoring Controls
  {
    id: "CC4.1",
    category: "CC",
    criteria: "CC4.1",
    title: "Audit Logging",
    description: "System activity is logged and monitored for anomalies.",
    implementationNotes: "All API calls logged via src/lib/security/audit-log.ts with event type, user, tenant, timestamp. Logs retained 90 days.",
    evidenceType: ["log-export", "config"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
  {
    id: "CC4.2",
    category: "CC",
    criteria: "CC4.2",
    title: "Anomaly Detection & Alerting",
    description: "Unauthorized access attempts and anomalous patterns trigger alerts.",
    implementationNotes: "Rate limiting on all API routes. Bearer auth required for sensitive endpoints. Failed auth logged with IP.",
    evidenceType: ["config", "test-result"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },

  // CC5 — Control Activities
  {
    id: "CC5.1",
    category: "CC",
    criteria: "CC5.1",
    title: "Access Control Policy",
    description: "Logical access controls restrict access to data based on least privilege.",
    implementationNotes: "Per-tenant data isolation enforced in src/lib/security/tenant.ts. No cross-tenant data access possible via API.",
    evidenceType: ["code-review", "penetration-test"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
  {
    id: "CC5.2",
    category: "CC",
    criteria: "CC5.2",
    title: "Encryption at Rest",
    description: "Sensitive data encrypted at rest using approved algorithms.",
    implementationNotes: "AES-256-GCM encryption via src/lib/security/encryption.ts. Integration tokens encrypted before storage.",
    evidenceType: ["code-review", "config"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
  {
    id: "CC5.3",
    category: "CC",
    criteria: "CC5.3",
    title: "Encryption in Transit",
    description: "All data in transit encrypted using TLS 1.2+.",
    implementationNotes: "TLS enforced at Vercel edge. HSTS header set in proxy.ts. TLS 1.0/1.1 disabled.",
    evidenceType: ["ssl-scan", "config"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },

  // CC6 — Logical & Physical Access
  {
    id: "CC6.1",
    category: "CC",
    criteria: "CC6.1",
    title: "Authentication Controls",
    description: "Strong authentication required for all system access.",
    implementationNotes: "MFA enforced via NextAuth. Session tokens rotate on each request. JWT expiry 24h.",
    evidenceType: ["config", "test-result"],
    status: "in-progress",
    owner: "Engineering",
    lastReviewed: "2026-02-20",
  },
  {
    id: "CC6.2",
    category: "CC",
    criteria: "CC6.2",
    title: "Role-Based Access Control",
    description: "User access limited to minimum necessary permissions.",
    implementationNotes: "RBAC roles: owner, admin, viewer. Enforced at API layer.",
    evidenceType: ["code-review", "access-matrix"],
    status: "in-progress",
    owner: "Engineering",
    lastReviewed: "2026-02-20",
  },

  // CC7 — System Operations
  {
    id: "CC7.1",
    category: "CC",
    criteria: "CC7.1",
    title: "Vulnerability Management",
    description: "Vulnerabilities identified and remediated on a defined schedule.",
    implementationNotes: "Dependabot enabled on GitHub. Critical CVEs patched within 48h. Monthly dependency audits.",
    evidenceType: ["dependabot-logs", "patch-records"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-01",
  },
  {
    id: "CC7.2",
    category: "CC",
    criteria: "CC7.2",
    title: "Incident Response Plan",
    description: "Documented incident response procedures tested at least annually.",
    implementationNotes: "IRP documented. Designated incident commander. Breach notification SLA: 72h (GDPR-aligned).",
    evidenceType: ["policy", "tabletop-exercise-record"],
    status: "implemented",
    owner: "CEO",
    lastReviewed: "2026-01-20",
  },

  // CC8 — Change Management
  {
    id: "CC8.1",
    category: "CC",
    criteria: "CC8.1",
    title: "Change Management Process",
    description: "Infrastructure and application changes managed through formal process.",
    implementationNotes: "All changes via pull requests with required review. CI/CD pipeline with test gates. No direct prod pushes.",
    evidenceType: ["github-audit-log", "cicd-config"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },

  // A — Availability
  {
    id: "A1.1",
    category: "A",
    criteria: "A1.1",
    title: "System Availability Targets",
    description: "Availability objectives documented and monitored.",
    implementationNotes: "SLA target: 99.9% uptime. Uptime monitoring via /api/health endpoint. Alert on 3 consecutive failures.",
    evidenceType: ["monitoring-config", "uptime-report"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
  {
    id: "A1.2",
    category: "A",
    criteria: "A1.2",
    title: "Backup and Recovery",
    description: "Data backed up regularly. Recovery procedures tested.",
    implementationNotes: "Database backups every 6h. Point-in-time recovery to 30 days. Recovery tested quarterly.",
    evidenceType: ["backup-config", "recovery-test-record"],
    status: "in-progress",
    owner: "Engineering",
    lastReviewed: "2026-02-20",
  },

  // C — Confidentiality
  {
    id: "C1.1",
    category: "C",
    criteria: "C1.1",
    title: "Customer Data Classification",
    description: "Customer financial data classified as confidential and handled accordingly.",
    implementationNotes: "Financial data treated as PII+ throughout codebase. Cross-tenant access architecturally prevented.",
    evidenceType: ["data-classification-policy", "code-review"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
  {
    id: "C1.2",
    category: "C",
    criteria: "C1.2",
    title: "AI Data Isolation",
    description: "Customer financial data not leaked between tenants in AI processing.",
    implementationNotes: "Each AI prompt includes explicit tenant context. Prompt injection mitigations applied. Per-tenant KV namespace.",
    evidenceType: ["code-review", "prompt-audit"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-20",
  },

  // P — Privacy
  {
    id: "P1.1",
    category: "P",
    criteria: "P1.1",
    title: "Privacy Notice",
    description: "Privacy policy communicated to users before data collection.",
    implementationNotes: "Privacy policy linked at account creation. GDPR-aligned data processing agreement available.",
    evidenceType: ["policy", "consent-records"],
    status: "implemented",
    owner: "Legal",
    lastReviewed: "2026-01-15",
  },
  {
    id: "P4.1",
    category: "P",
    criteria: "P4.1",
    title: "Data Retention and Deletion",
    description: "Data retained only as long as necessary. Deletion on request.",
    implementationNotes: "Customer data deleted within 30 days of account closure. Export available at any time.",
    evidenceType: ["policy", "deletion-procedure"],
    status: "implemented",
    owner: "Engineering",
    lastReviewed: "2026-02-15",
  },
];

// ── EVIDENCE COLLECTION ──────────────────────────────────────────────────────

/**
 * Collect a snapshot of current system evidence for a control.
 * In production, these would pull from real monitoring systems.
 */
export function collectEvidence(controlId: string): EvidenceItem {
  return {
    controlId,
    type: "audit-trail",
    description: `Automated evidence snapshot for control ${controlId}`,
    location: `/api/security/evidence?controlId=${controlId}`,
    collectedAt: new Date().toISOString(),
  };
}

/**
 * Get a summary of control coverage across TSC categories.
 */
export function getControlsSummary() {
  const byStatus = controls.reduce<Record<ControlStatus, number>>(
    (acc, c) => { acc[c.status] = (acc[c.status] || 0) + 1; return acc; },
    { implemented: 0, "in-progress": 0, planned: 0, "not-applicable": 0 }
  );

  const byCategory = controls.reduce<Record<TSCCategory, number>>(
    (acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; },
    { CC: 0, A: 0, C: 0, PI: 0, P: 0 }
  );

  const completionPct = Math.round(
    ((byStatus.implemented + byStatus["not-applicable"]) / controls.length) * 100
  );

  return { byStatus, byCategory, completionPct, total: controls.length };
}
