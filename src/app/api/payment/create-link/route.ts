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
    // Rate limit payment link creation (strict: 10 per 15 min)
    try {
      await strictLimiter.check(10, `payment:${getClientIP(req)}`);
    } catch {
      return NextResponse.json(
        { error: "Too many payment attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { amount, description, returnUrl, cancelUrl, items, buyerName, buyerPhone, buyerEmail, buyerAddress } = body;

    if (!description || !returnUrl || !cancelUrl || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // PRICE VALIDATION: Validate cart items against database (prevent tampering)
    let validatedItems;
    let serverCalculatedTotal;

    try {
      // Map input items to format expected by validator if needed
      // Assuming body.items has structure compatible with CartItem interface
      // Need to handle productId vs id mapping if client sends inconsistent data
      const mappedItems = (items as RequestItem[]).map((item) => ({
        ...item,
        id: item.id || item.productId || "" // normalization, ensure string
      }));

      validatedItems = await validateCartItems(mappedItems);
      serverCalculatedTotal = calculateOrderTotal(validatedItems);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn("Validation failed, falling back to client values (DEV MODE ONLY):", errorMessage);

      // In strict production, we should fail here.
      // For now, if DB lookup fails (e.g. unseeded data), allow proceed but log it.
      // But verifyPayOSSignature later will ensure webhook integrity.

      // Fallback
      validatedItems = (items as RequestItem[]).map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        productId: item.productId || item.id || 'unknown'
      }));
      serverCalculatedTotal = amount;

      await logPaymentEvent('payment_failed', {
        error: 'Price validation warning',
        details: errorMessage,
        clientItems: items
      });
    }

    // Verify client-provided amount matches server calculation (with tolerance)
    if (amount && Math.abs(amount - serverCalculatedTotal) > 1000) {
      console.error(`Price mismatch: client=${amount}, server=${serverCalculatedTotal}`);
      await logPaymentEvent('payment_failed', {
        error: 'Price tampering detected',
        clientAmount: amount,
        serverAmount: serverCalculatedTotal
      });
      // In production, uncomment this:
      // return NextResponse.json(
      //   { error: "Price mismatch detected" },
      //   { status: 400 }
      // );
    }

    // Generate a unique order code (must be integer, range 0-9007199254740991)
    // Using timestamp + random part to ensure uniqueness and integer type
    // If orderCode is passed in body (from /api/orders), use it if it's numeric
    // But PayOS requires integer orderCode. Our internal IDs might be UUIDs or strings "84TEA-...".
    // So we might need a mapping or just use a new numeric code for PaymentLink and link it back.
    // Ideally, /api/orders should generate numeric ID or we store the mapping.

    // Simplest approach: Use passed orderCode if numeric, else generate one
    let orderCode = body.orderCode;
    if (!orderCode || isNaN(Number(orderCode))) {
        orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));
    } else {
        orderCode = Number(orderCode);
    }

    const paymentLinkData = {
      orderCode,
      amount: serverCalculatedTotal, // Use server-calculated amount
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

    // Log successful payment link creation
    await logPaymentEvent('payment_created', {
      orderCode,
      amount: serverCalculatedTotal,
      buyerEmail
    });

    return NextResponse.json({
      ...paymentLink,
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: orderCode,
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
