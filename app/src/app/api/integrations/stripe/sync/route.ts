import { NextResponse } from "next/server";
import { getSubscriptionMetrics, getInvoices, getMrrTimeSeries } from "@/lib/integrations/stripe";

export async function GET() {
  try {
    const [metrics, invoices, mrrSeries] = await Promise.all([
      getSubscriptionMetrics(),
      getInvoices(50),
      getMrrTimeSeries(6),
    ]);
    return NextResponse.json({ metrics, invoices, mrrSeries });
  } catch (err) {
    console.error("[stripe/sync]", err);
    return NextResponse.json({ error: "Stripe sync failed" }, { status: 500 });
  }
}
