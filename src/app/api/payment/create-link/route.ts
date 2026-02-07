import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";
import { validateCartItems, calculateOrderTotal, logPaymentEvent } from "@/lib/payment-utils";

export async function POST(req: Request) {
  try {
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
      validatedItems = await validateCartItems(items);
      serverCalculatedTotal = calculateOrderTotal(validatedItems);
    } catch (error: any) {
      console.error("Price validation failed:", error);
      await logPaymentEvent('payment_failed', {
        error: 'Price validation failed',
        details: error.message,
        clientItems: items
      });
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    // Verify client-provided amount matches server calculation
    if (amount && Math.abs(amount - serverCalculatedTotal) > 1) {
      console.error(`Price mismatch: client=${amount}, server=${serverCalculatedTotal}`);
      await logPaymentEvent('payment_failed', {
        error: 'Price tampering detected',
        clientAmount: amount,
        serverAmount: serverCalculatedTotal
      });
      return NextResponse.json(
        { error: "Price mismatch detected" },
        { status: 400 }
      );
    }

    // Generate a unique order code (must be integer, range 0-9007199254740991)
    // Using timestamp + random part to ensure uniqueness and integer type
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));

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
    const paymentLink = await payOS.createPaymentLink(paymentLinkData);

    // Log successful payment link creation
    await logPaymentEvent('payment_created', {
      orderCode,
      amount: serverCalculatedTotal,
      buyerEmail
    });

    return NextResponse.json({
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: orderCode,
      ...paymentLink,
    });
  } catch (error: any) {
    console.error("Error creating payment link:", error);
    await logPaymentEvent('payment_failed', {
      error: 'Payment link creation failed',
      details: error.message
    });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
