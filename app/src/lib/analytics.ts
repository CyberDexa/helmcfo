/**
 * Analytics & event tracking
 * 
 * Thin wrapper that sends events to our internal tracking endpoint.
 * Can be swapped for PostHog, Mixpanel, or Segment in production.
 */

export type EventName =
  // Marketing / acquisition
  | "page_view"
  | "waitlist_view"
  | "waitlist_submit"
  | "waitlist_success"
  | "pricing_view"
  | "blog_view"
  | "cta_click"
  // Onboarding / activation
  | "onboarding_start"
  | "onboarding_step_complete"
  | "onboarding_complete"
  | "connect_plaid_start"
  | "connect_plaid_success"
  | "connect_qbo_start"
  | "connect_qbo_success"
  | "connect_stripe_start"
  | "connect_stripe_success"
  | "connect_finch_start"
  | "connect_finch_success"
  // Core product engagement
  | "dashboard_view"
  | "scenario_run"
  | "board_report_generate"
  | "advisor_chat_message"
  | "cash_flow_view"
  | "headcount_model_view"
  // Retention signals
  | "report_export"
  | "insight_action_taken"
  | "alert_viewed"
  // Revenue
  | "upgrade_view"
  | "upgrade_click"
  | "trial_start"
  | "subscription_active";

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

interface TrackEvent {
  event: EventName;
  properties?: EventProperties;
  userId?: string;
  anonymousId?: string;
  timestamp?: string;
}

let _userId: string | null = null;
let _anonymousId: string | null = null;

/**
 * Identify the current user.
 * Call after login / during onboarding.
 */
export function identify(userId: string, traits?: EventProperties) {
  _userId = userId;
  if (typeof window !== "undefined") {
    // Store anonymous ID from localStorage (pre-auth cross-session)
    _anonymousId = localStorage.getItem("_helm_anon_id") ?? generateAnonymousId();
  }
  void sendEvent({ event: "page_view", properties: { identified: true, ...traits } });
}

/**
 * Track a named event with optional properties.
 */
export async function track(event: EventName, properties?: EventProperties): Promise<void> {
  const payload: TrackEvent = {
    event,
    properties,
    userId: _userId ?? undefined,
    anonymousId: getAnonymousId(),
    timestamp: new Date().toISOString(),
  };

  void sendEvent(payload);
}

/**
 * Convenience: track a page view.
 * Automatically extracts the path from window.location.
 */
export function page(name?: string) {
  if (typeof window === "undefined") return;
  void track("page_view", {
    path: window.location.pathname,
    name: name ?? document.title,
    referrer: document.referrer || null,
  });
}

// ── INTERNALS ─────────────────────────────────────────────────────────────────

async function sendEvent(payload: TrackEvent): Promise<void> {
  if (typeof window === "undefined") return; // Skip during SSR

  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Non-blocking — fire and forget
      keepalive: true,
    });
  } catch {
    // Analytics should never break the user experience
  }
}

function getAnonymousId(): string {
  if (typeof window === "undefined") return "server";
  if (_anonymousId) return _anonymousId;
  const stored = localStorage.getItem("_helm_anon_id");
  if (stored) { _anonymousId = stored; return stored; }
  _anonymousId = generateAnonymousId();
  localStorage.setItem("_helm_anon_id", _anonymousId);
  return _anonymousId;
}

function generateAnonymousId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
