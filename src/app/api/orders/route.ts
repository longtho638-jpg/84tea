import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { validateCartItems, calculateOrderTotal, ValidatedItem } from "@/lib/payment-utils";
import { strictLimiter, limiter, getClientIP } from "@/lib/rate-limit";
import { orderSchema } from "@/lib/validation";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required Supabase credentials');
  }

  return createClient(supabaseUrl, supabaseKey);
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
      // Log rate limit
      return NextResponse.json(
        { error: "Bạn đã thử đặt hàng quá nhiều lần. Vui lòng thử lại sau ít phút." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu đơn hàng không hợp lệ", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { items, total, customerInfo, paymentMethod } = parsed.data;

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
    } catch {
      // Invalid cart data
      return NextResponse.json(
        { error: "Một hoặc nhiều sản phẩm không hợp lệ hoặc đã hết hàng. Vui lòng kiểm tra lại giỏ hàng." },
        { status: 400 }
      );
    }

    // Reject price tampering (> 1000 VND tolerance)
    if (Math.abs(serverTotal - total) > 1000) {
      return NextResponse.json(
        { error: "Phát hiện sai lệch về giá. Vui lòng làm mới trang và thử lại." },
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
      return NextResponse.json(
        { error: "Không thể tạo đơn hàng. Vui lòng thử lại sau." },
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
  } catch {
    return NextResponse.json(
      { error: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." },
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
        { error: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");
    const orderCode = searchParams.get("orderCode");

    if (!orderId && !orderCode) {
      return NextResponse.json(
        { error: "Cần cung cấp mã đơn hàng hoặc ID đơn hàng" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const query = supabase.from("orders").select("*");

    if (orderId) {
      query.eq("id", orderId);
    } else if (orderCode) {
      // IDOR FIX: Disable insecure lookup by short orderCode
      // Use the UUID (id) sent via email instead
      return NextResponse.json(
        { error: "Vui lòng sử dụng đường dẫn theo dõi đơn hàng trong email (hoặc cung cấp ID đơn hàng)." },
        { status: 403 }
      );
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
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
  } catch {
    return NextResponse.json(
      { error: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
