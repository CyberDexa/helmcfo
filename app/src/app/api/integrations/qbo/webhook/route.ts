import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * QuickBooks App Store Webhook Handler
 * 
 * QBO sends webhook notifications for:
 * - Payment updates
 * - Invoice changes
 * - Customer updates
 * - Data sync requests
 * 
 * Spec: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks
 */

type QBOEventType =
  | "Payment"
  | "Invoice"
  | "Customer"
  | "Vendor"
  | "Account"
  | "Item"
  | "Estimate"
  | "Bill"
  | "JournalEntry"
  | "Purchase";

interface QBOEntity {
  id: string;
  operation: "Create" | "Update" | "Delete" | "Merge" | "Emailed" | "Void";
  lastUpdated: string;
  deletedId?: string;
  mergedToId?: string;
}

interface QBORealmPayload {
  realmId: string;
  name: QBOEventType;
  entities: QBOEntity[];
}

interface QBOWebhookPayload {
  eventNotifications: QBORealmPayload[];
}

/**
 * Verify QBO webhook signature using HMAC-SHA256
 * QBO sends the signature in the `intuit-signature` header
 */
function verifySignature(body: string, signature: string, verifierToken: string): boolean {
  const expected = crypto
    .createHmac("sha256", verifierToken)
    .update(body)
    .digest("base64");
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("intuit-signature") ?? "";
  const verifierToken = process.env.QBO_WEBHOOK_VERIFIER_TOKEN ?? "";

  // Validate signature if token is configured
  if (verifierToken && !verifySignature(rawBody, signature, verifierToken)) {
    console.warn("[qbo-webhook] Invalid signature — rejecting");
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let payload: QBOWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Process each realm's events
  for (const notification of payload.eventNotifications) {
    const { realmId, name: entityType, entities } = notification;

    for (const entity of entities) {
      console.log(`[qbo-webhook] realmId=${realmId} type=${entityType} id=${entity.id} op=${entity.operation}`);

      // Trigger data re-sync for this customer in production:
      // await queueDataSync(realmId, entityType, entity.id);

      // For high-priority entities (Payment, Invoice), trigger immediate sync
      if (entityType === "Payment" || entityType === "Invoice") {
        // In production: await triggerImmediateSync(realmId);
        console.log(`[qbo-webhook] High-priority sync queued for realm ${realmId}`);
      }
    }
  }

  // QBO requires a 200 response within 30 seconds
  return NextResponse.json({ received: true });
}

/**
 * QBO App Marketplace health check endpoint
 * Called by Intuit to verify app availability
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "HelmCFO",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
