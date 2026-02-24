/**
 * Stripe integration service
 * Handles: MRR/ARR calculation, subscription data, invoice status, NRR
 */
import Stripe from "stripe";

function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
  });
}

export interface SubscriptionMetrics {
  mrr: number;          // Monthly recurring revenue
  arr: number;          // ARR = MRR × 12
  customerCount: number;
  activeSubscriptions: number;
  trialCount: number;
}

export async function getSubscriptionMetrics(): Promise<SubscriptionMetrics> {
  const stripe = getStripeClient();

  // Fetch all active subscriptions
  const subscriptions = await stripe.subscriptions.list({
    status: "active",
    limit: 100,
    expand: ["data.items.data.price"],
  });

  let mrr = 0;
  const customerIds = new Set<string>();

  for (const sub of subscriptions.data) {
    for (const item of sub.items.data) {
      const price = item.price;
      if (!price.unit_amount) continue;

      // Normalise to monthly
      let monthlyCents = price.unit_amount * (item.quantity ?? 1);
      if (price.recurring?.interval === "year") monthlyCents /= 12;
      if (price.recurring?.interval === "week") monthlyCents *= 4.33;
      mrr += monthlyCents;
    }
    if (typeof sub.customer === "string") customerIds.add(sub.customer);
  }

  const trials = await stripe.subscriptions.list({ status: "trialing", limit: 100 });

  return {
    mrr: Math.round(mrr / 100),      // cents → dollars
    arr: Math.round((mrr * 12) / 100),
    customerCount: customerIds.size,
    activeSubscriptions: subscriptions.data.length,
    trialCount: trials.data.length,
  };
}

export interface InvoiceRecord {
  id: string;
  customer: string;
  customerEmail: string | null;
  amount: number;
  status: "paid" | "open" | "overdue" | "void";
  dueDate: string | null;
  daysOverdue: number;
  periodStart: string;
  periodEnd: string;
}

export async function getInvoices(limit = 50): Promise<InvoiceRecord[]> {
  const stripe = getStripeClient();
  const invoices = await stripe.invoices.list({
    limit,
    expand: ["data.customer"],
  });

  const now = Date.now();

  return invoices.data.map((inv) => {
    const customer = typeof inv.customer === "object" && inv.customer !== null
      ? (inv.customer as Stripe.Customer)
      : null;

    const dueDate = inv.due_date ? new Date(inv.due_date * 1000) : null;
    const daysOverdue = dueDate && inv.status === "open" && dueDate.getTime() < now
      ? Math.floor((now - dueDate.getTime()) / 86_400_000)
      : 0;

    const status: InvoiceRecord["status"] =
      inv.status === "void" ? "void"
      : inv.status === "paid" ? "paid"
      : daysOverdue > 0 ? "overdue"
      : "open";

    return {
      id: inv.id,
      customer: customer?.name ?? (typeof inv.customer === "string" ? inv.customer : "Unknown"),
      customerEmail: customer?.email ?? null,
      amount: (inv.amount_due ?? 0) / 100,
      status,
      dueDate: dueDate?.toISOString().slice(0, 10) ?? null,
      daysOverdue,
      periodStart: new Date(inv.period_start * 1000).toISOString().slice(0, 10),
      periodEnd: new Date(inv.period_end * 1000).toISOString().slice(0, 10),
    };
  });
}

export interface RevenueTimeSeries {
  month: string;   // "Jan '26"
  mrr: number;
  newMrr: number;
  churnedMrr: number;
  expansionMrr: number;
}

/** Fetch MRR over last N months using Stripe balance transactions */
export async function getMrrTimeSeries(months = 6): Promise<RevenueTimeSeries[]> {
  const stripe = getStripeClient();
  const result: RevenueTimeSeries[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).replace(" ", " '");

    // Fetch charges for that month window
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const charges = await stripe.charges.list({
      created: { gte: Math.floor(start.getTime() / 1000), lte: Math.floor(end.getTime() / 1000) },
      limit: 100,
    });

    const revenue = charges.data
      .filter((c) => c.status === "succeeded" && !c.refunded)
      .reduce((sum, c) => sum + (c.amount_captured ?? 0) / 100, 0);

    result.push({
      month: label,
      mrr: Math.round(revenue),
      newMrr: 0,        // Would require event-based tracking; placeholder
      churnedMrr: 0,
      expansionMrr: 0,
    });
  }

  return result;
}
