import { NextRequest, NextResponse } from "next/server";
import { stripe, getProductId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { plan, billingCycle } = await req.json();

    const productId = getProductId(plan, billingCycle);

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid plan or billing cycle" },
        { status: 400 },
      );
    }

    // In a real application, you would use a price ID instead of a product ID
    // but the request provided product IDs. Stripe Checkout often expects Price IDs
    // or requires fetching the default price from the product.
    // For now, we'll try to retrieve the product to get its default price.

    const product = await stripe.products.retrieve(productId);
    const priceId = product.default_price as string;

    if (!priceId) {
      return NextResponse.json(
        { error: "Product has no default price configured" },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      return_url: `${req.nextUrl.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
