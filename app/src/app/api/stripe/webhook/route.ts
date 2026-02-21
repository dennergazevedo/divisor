/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        const status = session.status === "complete" ? "paid" : session.status;
        const email = session.customer_details?.email;

        if (email) {
          await sql`
            UPDATE invoice 
            SET status = ${status}
            WHERE stripe_id = ${sessionId}
          `;
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;

        // Fetch customer to get email (to link with our user)
        const customer = (await stripe.customers.retrieve(
          customerId,
        )) as Stripe.Customer;
        const email = customer.email;

        if (email) {
          const planId = subscription.items.data[0].plan.product as string;

          // User requested exactly 30 days from now
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);
          const expirationDateIso = expirationDate.toISOString();

          // Map product ID back to plan name
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

          await sql`
            UPDATE users 
            SET 
              plan_status = 'active', 
              current_plan = ${planName}, 
              expiration_date = ${expirationDateIso}
            WHERE email = ${email}
          `;
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.paused": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const customer = (await stripe.customers.retrieve(
          customerId,
        )) as Stripe.Customer;
        const email = customer.email;

        if (email) {
          await sql`
            UPDATE users 
            SET 
              plan_status = 'inactive',
              current_plan = 'free'
            WHERE email = ${email}
          `;
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", message },
      { status: 500 },
    );
  }
}
