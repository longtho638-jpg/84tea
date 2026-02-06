import { NextResponse } from "next/server";
import { getPayOS } from "@/lib/payos";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, description, returnUrl, cancelUrl, items, buyerName, buyerPhone, buyerEmail, buyerAddress } = body;

    if (!amount || !description || !returnUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique order code (must be integer, range 0-9007199254740991)
    // Using timestamp + random part to ensure uniqueness and integer type
    const orderCode = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000));

    const paymentLinkData = {
      orderCode,
      amount,
      description,
      items: items || [],
      returnUrl,
      cancelUrl,
      buyerName,
      buyerPhone,
      buyerEmail,
      buyerAddress,
    };

    const payOS = getPayOS();
    const paymentLink = await payOS.createPaymentLink(paymentLinkData);

    return NextResponse.json({
      checkoutUrl: paymentLink.checkoutUrl,
      orderCode: orderCode,
      ...paymentLink,
    });
  } catch (error: any) {
    console.error("Error creating payment link:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
