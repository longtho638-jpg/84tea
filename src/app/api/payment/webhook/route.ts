import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { createClient } from "@supabase/supabase-js";
import { logPaymentEvent } from "@/lib/payment-utils";

// Create client lazily
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // We rely on SDK verification, but we could also check signature manually if needed
    // const rawBody = JSON.stringify(body);
    // const signature = req.headers.get("x-payos-signature");

    // Verify webhook signature
    // payOS.verifyPaymentWebhookData(body) throws error if invalid
    const payOS = getPayOS();
    const webhookData = payOS.verifyPaymentWebhookData(body);

    // Log webhook received
    await logPaymentEvent('webhook_received', {
      orderCode: webhookData.data.orderCode,
      code: webhookData.code,
      timestamp: new Date().toISOString()
    });

    if (webhookData.code === "00") {
        // Payment successful
        const supabase = getSupabaseClient();

        // IDEMPOTENCY CHECK: Verify if order is already paid
        const { data: existingOrder, error: fetchError } = await supabase
          .from("orders")
          .select("payment_status, id, status")
          .eq("id", String(webhookData.data.orderCode))
          .single();

        if (fetchError) {
          console.error("Failed to fetch order:", fetchError);
          // If order doesn't exist, we might want to create a "ghost" order or log error
          // But usually we expect order to be created via /api/orders first
          await logPaymentEvent('payment_failed', {
            orderCode: webhookData.data.orderCode,
            error: 'Order not found',
            details: fetchError
          });
          return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
          );
        }

        // If already paid, return success without updating (idempotent)
        if (existingOrder?.payment_status === "paid") {
          await logPaymentEvent('webhook_duplicate', {
            orderCode: webhookData.data.orderCode,
            message: 'Duplicate webhook ignored'
          });
          return NextResponse.json({
            success: true,
            message: "Already processed",
          });
        }

        // Update order status in database
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: existingOrder?.status === 'pending' ? "processing" : existingOrder?.status,
            updated_at: new Date().toISOString()
          })
          .eq("id", String(webhookData.data.orderCode));

        if (updateError) {
          console.error("Failed to update order status:", updateError);
          await logPaymentEvent('payment_failed', {
            orderCode: webhookData.data.orderCode,
            error: 'Database update failed',
            details: updateError
          });
          return NextResponse.json(
            { error: "Processing failed" },
            { status: 500 }
          );
        }

        // Log success
        await logPaymentEvent('payment_created', { // Or payment_success
             orderCode: webhookData.data.orderCode,
             status: 'paid'
        });
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Webhook error:", errorMessage);
    await logPaymentEvent('payment_failed', {
      error: 'Webhook processing failed',
      details: errorMessage
    });
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
