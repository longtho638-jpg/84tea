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

    // Verify webhook signature
    // payOS.verifyPaymentWebhookData(body) throws error if invalid
    const payOS = getPayOS();
    const webhookData = payOS.verifyPaymentWebhookData(body);

    console.log("Webhook received:", webhookData);

    // Log webhook received
    await logPaymentEvent('webhook_received', {
      orderCode: webhookData.data.orderCode,
      code: webhookData.code,
      timestamp: new Date().toISOString()
    });

    if (webhookData.code === "00") {
        // Payment successful
        console.log(`Payment successful for order ${webhookData.data.orderCode}`);

        const supabase = getSupabaseClient();

        // IDEMPOTENCY CHECK: Verify if order is already paid
        const { data: existingOrder, error: fetchError } = await supabase
          .from("orders")
          .select("payment_status, id")
          .eq("id", String(webhookData.data.orderCode))
          .single();

        if (fetchError) {
          console.error("Failed to fetch order:", fetchError);
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
          console.log(`Order ${webhookData.data.orderCode} already processed (idempotent)`);
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
            status: "processing", // Automatically move to processing if paid
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
        } else {
          console.log("Order status updated to paid");
        }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logPaymentEvent('payment_failed', {
      error: 'Signature verification failed',
      details: errorMessage
    });
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }
}
