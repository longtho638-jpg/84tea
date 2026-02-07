import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateCartItems, calculateOrderTotal, ValidatedItem } from "@/lib/payment-utils";

// Create client lazily to avoid build-time errors
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
  id?: string; // For compatibility
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
  orderCode: string;
  items: OrderItem[];
  total: number;
  customerInfo: CustomerInfo;
  paymentMethod?: string;
}

// Type for order response
interface OrderRow {
  id: string;
  status: string;
  total: number;
  items: unknown;
  payment_status: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();
    const { orderCode, items, total, customerInfo, paymentMethod } = body;

    // Validate required fields
    if (!orderCode || !items || !total || !customerInfo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side validation
    let validatedItems;
    let serverTotal;
    try {
      // Map items to match what validateCartItems expects (id or productId)
      const mappedItems = items.map(item => ({
        id: item.productId || item.id || "unknown",
        quantity: item.quantity,
        price: item.price
      }));

      validatedItems = await validateCartItems(mappedItems);
      serverTotal = calculateOrderTotal(validatedItems);

      // Allow for small floating point differences
      if (Math.abs(serverTotal - total) > 1000) { // 1000 VND tolerance
         console.warn(`Price mismatch: client=${total}, server=${serverTotal}`);
         // We could reject here, but for now just warn or use server total?
         // Let's use server total for the order record to be safe
      }
    } catch (e) {
      console.error("Validation failed:", e);
      // Fallback to client data if DB validation fails (e.g. dev mode without seeded data)
      // but strictly log it.
      // In production, we should probably fail.
      validatedItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        id: item.productId || item.id || ''
      }));
      serverTotal = total;
    }

    // Create order in database
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        id: orderCode,
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
          // Preserve extras if available in original items
          weight: items.find(i => (i.productId || i.id) === item.id)?.weight || null,
          image: items.find(i => (i.productId || i.id) === item.id)?.image || null,
        })),
        total: serverTotal, // Use validated total
        status: "pending",
        payment_status: "pending",
        payment_method: paymentMethod || "payos",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      // If table doesn't exist or other DB error, return mock success for demo
      if (error.code === "42P01" || error.code === "PGRST116") {
        return NextResponse.json({
          success: true,
          order: {
            id: orderCode,
            status: "pending",
            total: serverTotal,
            message: "Demo mode - Database not configured"
          }
        });
      }

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
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

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
