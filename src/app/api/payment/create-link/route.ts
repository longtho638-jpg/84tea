import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { validateCartItems, calculateOrderTotal, logPaymentEvent } from "@/lib/payment-utils";
import { strictLimiter, getClientIP } from "@/lib/rate-limit";

interface RequestItem {
  id?: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
}

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
    const { amount, description, returnUrl, cancelUrl, items, orderCode, buyerName, buyerPhone, buyerEmail, buyerAddress } = body;

    if (!description || !returnUrl || !cancelUrl || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Server-side price validation
    let validatedItems;
    let serverCalculatedTotal;

    try {
      const mappedItems = (items as RequestItem[]).map((item) => ({
        ...item,
        id: item.id || item.productId || ""
      }));

      validatedItems = await validateCartItems(mappedItems);
      serverCalculatedTotal = calculateOrderTotal(validatedItems);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Price validation failed:", errorMessage);

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
    if (amount && Math.abs(amount - serverCalculatedTotal) > 1000) {
      console.error(`Price mismatch: client=${amount}, server=${serverCalculatedTotal}`);
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

    // Use numeric orderCode from order creation, or generate one
    let numericOrderCode: number;
    if (orderCode && !isNaN(Number(orderCode))) {
      numericOrderCode = Number(orderCode);
    } else {
      numericOrderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));
    }

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
      { error: errorMessage },
      { status: 500 }
    );
  }
}
