import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateCartItems, calculateOrderTotal, ValidatedItem } from "@/lib/payment-utils";
import { strictLimiter, limiter, getClientIP } from "@/lib/rate-limit";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  weight?: string;
  image?: string;
  id?: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  note?: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  paymentMethod?: string;
}

interface OrderRow {
  id: string;
  order_code: number;
  status: string;
  total: number;
  items: unknown;
  payment_status: string;
  created_at: string;
}

/**
 * Generate numeric order code for PayOS compatibility
 * Range: safe integer (max 9007199254740991)
 */
function generateNumericOrderCode(): number {
  const timestamp = Date.now() % 1_000_000_000;
  const random = Math.floor(Math.random() * 1000);
  return timestamp * 1000 + random;
}

export async function POST(request: NextRequest) {
  try {
    try {
      await strictLimiter.check(10, `order:${getClientIP(request)}`);
    } catch {
      return NextResponse.json(
        { error: "Too many order attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body: CreateOrderRequest = await request.json();
    const { items, total, customerInfo, paymentMethod } = body;

    if (!items || items.length === 0 || !total || !customerInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side price validation (reject on failure in production)
    const mappedItems = items.map(item => ({
      id: item.productId || item.id || "unknown",
      quantity: item.quantity,
      price: item.price
    }));

    let validatedItems: ValidatedItem[];
    let serverTotal: number;

    try {
      validatedItems = await validateCartItems(mappedItems);
      serverTotal = calculateOrderTotal(validatedItems);
    } catch (e) {
      console.error("Cart validation failed:", e);
      return NextResponse.json(
        { error: "One or more products are invalid or unavailable" },
        { status: 400 }
      );
    }

    // Reject price tampering (> 1000 VND tolerance)
    if (Math.abs(serverTotal - total) > 1000) {
      console.error(`Price mismatch: client=${total}, server=${serverTotal}`);
      return NextResponse.json(
        { error: "Price mismatch detected. Please refresh and try again." },
        { status: 400 }
      );
    }

    const orderCode = generateNumericOrderCode();

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        guest_info: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email || null,
          address: customerInfo.address,
          city: customerInfo.city,
          note: customerInfo.note || null,
        },
        items: validatedItems.map((item: ValidatedItem) => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: items.find(i => (i.productId || i.id) === item.id)?.weight || null,
          image: items.find(i => (i.productId || i.id) === item.id)?.image || null,
        })),
        total: serverTotal,
        status: "pending",
        payment_status: "pending",
        payment_method: paymentMethod || "payos",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const order = data as OrderRow;
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderCode: order.order_code,
        status: order.status,
        total: order.total,
        createdAt: order.created_at,
      }
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    try {
      await limiter.check(60, `order-get:${getClientIP(request)}`);
    } catch {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    const orderCode = searchParams.get("orderCode");

    if (!orderId && !orderCode) {
      return NextResponse.json(
        { error: "Order ID or order code is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const query = supabase.from("orders").select("*");

    if (orderId) {
      query.eq("id", orderId);
    } else if (orderCode) {
      query.eq("order_code", Number(orderCode));
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = data as OrderRow;
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderCode: order.order_code,
        status: order.status,
        total: order.total,
        items: order.items,
        paymentStatus: order.payment_status,
        createdAt: order.created_at,
      }
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
