import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { email, stripeId, status } = await req.json();

    if (!email || !stripeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if the invoice already exists to prevent duplicate processing
    const existing = await sql`
      SELECT id FROM invoice WHERE stripe_id = ${stripeId}
    `;

    if (existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Invoice already processed",
      });
    }

    // Retrieve the session to get the plan details
    const session = await stripe.checkout.sessions.retrieve(stripeId, {
      expand: ["line_items.data.price.product"],
    });

    if (session.status === "complete") {
      const lineItem = session.line_items?.data[0];
      const product = lineItem?.price?.product;
      const planId = typeof product === "object" ? product.id : product;

      if (planId) {
        // User requested exactly 30 days from now
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        const expirationDateIso = expirationDate.toISOString();

        // Map product ID back to plan name (mirroring webhook logic)
        let planName = "free";
        if (
          planId === "prod_U14XnrAq6orp30" ||
          planId === "prod_U14YlyQiJclPkt" ||
          planId === "prod_U14yb0BU7BGZZZ" ||
          planId === "prod_U14zQzRPEogRFi"
        ) {
          planName = "growth";
        } else if (
          planId === "prod_U14ZhlzNFVvyv5" ||
          planId === "prod_U14Zdl6c8Ew0Ii" ||
          planId === "prod_U150kv1r2j8qdv" ||
          planId === "prod_U150uNV1zhQQHD"
        ) {
          planName = "pro";
        }

        // Update the user's plan status
        await sql`
          UPDATE users 
          SET 
            plan_status = 'active', 
            current_plan = ${planName}, 
            expiration_date = ${expirationDateIso}
          WHERE email = ${email}
        `;
      }
    }

    // Finally, insert the invoice record
    await sql`
      INSERT INTO invoice (email, stripe_id, status)
      VALUES (${email}, ${stripeId}, ${status || "pending"})
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Invoice API Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
