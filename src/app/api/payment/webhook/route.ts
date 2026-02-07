import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { createClient } from "@supabase/supabase-js";
import { logPaymentEvent } from "@/lib/payment-utils";
import type { Webhook } from "@payos/node";

// Create client lazily
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

export async function POST(req: Request) {
  try {
    const body: Webhook = await req.json();

    // Verify webhook signature using v2 SDK
    const payOS = getPayOS();
    const verifiedData = await payOS.webhooks.verify(body);

    // Log webhook received
    await logPaymentEvent('webhook_received', {
      orderCode: verifiedData.orderCode,
      code: body.code,
      timestamp: new Date().toISOString()
    });

    if (body.code === "00") {
        // Payment successful
        const supabase = getSupabaseClient();

        // IDEMPOTENCY CHECK: Verify if order is already paid
        const { data: existingOrder, error: fetchError } = await supabase
          .from("orders")
          .select("payment_status, id, status")
          .eq("id", String(verifiedData.orderCode))
          .single();

        if (fetchError) {
          console.error("Failed to fetch order:", fetchError);
          await logPaymentEvent('payment_failed', {
            orderCode: verifiedData.orderCode,
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
            orderCode: verifiedData.orderCode,
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
          .eq("id", String(verifiedData.orderCode));

        if (updateError) {
          console.error("Failed to update order status:", updateError);
          await logPaymentEvent('payment_failed', {
            orderCode: verifiedData.orderCode,
            error: 'Database update failed',
            details: updateError
          });
          return NextResponse.json(
            { error: "Processing failed" },
            { status: 500 }
          );
        }

        // Log success
        await logPaymentEvent('payment_created', {
             orderCode: verifiedData.orderCode,
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
