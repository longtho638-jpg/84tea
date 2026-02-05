import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY || "";

// Create untyped client for flexibility
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PayOSWebhookData {
  orderCode: number;
  amount: number;
  description: string;
  accountNumber: string;
  reference: string;
  transactionDateTime: string;
  currency: string;
  paymentLinkId: string;
  code: string;
  desc: string;
  counterAccountBankId: string | null;
  counterAccountBankName: string | null;
  counterAccountName: string | null;
  counterAccountNumber: string | null;
  virtualAccountName: string | null;
  virtualAccountNumber: string | null;
}

interface PayOSWebhookPayload {
  code: string;
  desc: string;
  success: boolean;
  data: PayOSWebhookData;
  signature: string;
}

function verifySignature(data: PayOSWebhookData, signature: string): boolean {
  // Sort data keys and create signature string
  const sortedData = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key as keyof PayOSWebhookData]}`)
    .join("&");
  
  const computedSignature = crypto
    .createHmac("sha256", PAYOS_CHECKSUM_KEY)
    .update(sortedData)
    .digest("hex");
    
  return computedSignature === signature;
}

export async function POST(request: NextRequest) {
  try {
    const body: PayOSWebhookPayload = await request.json();
    const { code, data, signature } = body;

    console.log("PayOS Webhook received:", { code, orderCode: data?.orderCode });

    // Verify webhook signature (skip in demo mode)
    if (PAYOS_CHECKSUM_KEY && signature) {
      const isValid = verifySignature(data, signature);
      if (!isValid) {
        console.error("Invalid webhook signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    // Check payment status
    if (code === "00") {
      // Payment successful
      const orderCode = String(data.orderCode);
      
      // Update order in database
      const { error } = await supabase
        .from("orders")
        .update({
          status: "processing",
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderCode);

      if (error) {
        console.error("Failed to update order:", error);
        // Don't fail the webhook - PayOS will retry
      }

      console.log(`Order ${orderCode} paid successfully`);
      
      return NextResponse.json({
        success: true,
        message: "Payment confirmed"
      });
    } else {
      // Payment failed or cancelled
      const orderCode = String(data.orderCode);
      
      await supabase
        .from("orders")
        .update({
          status: "cancelled",
          payment_status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderCode);

      console.log(`Order ${orderCode} payment failed: ${code}`);
      
      return NextResponse.json({
        success: true,
        message: "Payment status updated"
      });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "PayOS webhook endpoint ready"
  });
}
