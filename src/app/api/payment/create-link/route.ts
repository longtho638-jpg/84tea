import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { validateCartItems, calculateOrderTotal, logPaymentEvent } from "@/lib/payment-utils";
import { strictLimiter, getClientIP } from "@/lib/rate-limit";
import { paymentLinkSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    try {
      await strictLimiter.check(10, `payment:${getClientIP(req)}`);
    } catch {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = paymentLinkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { description, returnUrl, cancelUrl, items, orderCode, amount, buyerName, buyerPhone, buyerEmail, buyerAddress } = parsed.data;

    // Server-side price validation
    let validatedItems;
    let serverCalculatedTotal;

    try {
      const mappedItems = items.map((item) => ({
        ...item,
        id: item.id || item.productId || ""
      }));

      validatedItems = await validateCartItems(mappedItems);
      serverCalculatedTotal = calculateOrderTotal(validatedItems);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await logPaymentEvent('payment_failed', {
        error: 'Price validation failed',
        details: errorMessage,
        clientItems: items
      });

      return NextResponse.json(
        { error: "One or more products are invalid or unavailable" },
        { status: 400 }
      );
    }

    // Reject price tampering
    if (amount && amount !== serverCalculatedTotal) {
      await logPaymentEvent('payment_failed', {
        error: 'Price tampering detected',
        clientAmount: amount,
        serverAmount: serverCalculatedTotal
      });
      return NextResponse.json(
        { error: "Price mismatch detected. Please refresh and try again." },
        { status: 400 }
      );
    }

    // Use numeric orderCode from order creation (validated by Zod)
    const numericOrderCode = orderCode;

    const paymentLinkData = {
      orderCode: numericOrderCode,
      amount: serverCalculatedTotal,
      description,
      items: validatedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      returnUrl,
      cancelUrl,
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress,
    };

    const payOS = getPayOS();
    const paymentLink = await payOS.paymentRequests.create(paymentLinkData);

    await logPaymentEvent('payment_created', {
      orderCode: numericOrderCode,
      amount: serverCalculatedTotal,
      buyerEmail
    });

    return NextResponse.json({
      ...paymentLink,
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: numericOrderCode,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    await logPaymentEvent('payment_failed', {
      error: 'Payment link creation failed',
      details: errorMessage
    });
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra trong quá trình tạo liên kết thanh toán. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
