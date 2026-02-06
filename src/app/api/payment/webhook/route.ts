import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { createClient } from "@supabase/supabase-js";

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

    if (webhookData.code === "00") {
        // Payment successful
        console.log(`Payment successful for order ${webhookData.data.orderCode}`);

        // Update order status in database
        const supabase = getSupabaseClient();
        const { error } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing" // Automatically move to processing if paid
          })
          .eq("id", String(webhookData.data.orderCode));

        if (error) {
          console.error("Failed to update order status:", error);
        } else {
          console.log("Order status updated to paid");
        }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook received",
    });
  } catch (error: any) {
    console.error("Error verifying webhook:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }
}
