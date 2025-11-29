import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    console.log("Received items:", JSON.stringify(items, null, 2));

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Map cart items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          // Only include images if they exist and are valid URLs
          ...(item.imageUrl && item.imageUrl.startsWith('http') ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in paise for INR
      },
      quantity: item.quantity,
    }));

    console.log("Creating Stripe session with line items:", JSON.stringify(lineItems, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/shop/odersuccessful?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/shop/cart`,
    });

    console.log("Stripe session created successfully:", session.id);

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    console.error("Error details:", {
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
    });
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
