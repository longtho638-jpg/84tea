import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create untyped client for flexibility (tables may not exist yet)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  weight?: string;
  image?: string;
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

    // Create order in database
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
        items: items.map(item => ({
          product_id: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight || null,
          image: item.image || null,
        })),
        total,
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
            total,
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
