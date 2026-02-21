import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import SimpleNavbar from "@/app/ui/sections/Header/simple";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Package,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ReturnPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;

  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const apiUrl = `${protocol}://${host}/api/stripe/invoice`;

  if (!sessionId) {
    redirect("/");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "subscription"],
    });

    const status = session.status;
    const customerEmail = session.customer_details?.email;
    const isSuccess = status === "complete";

    if (customerEmail) {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          status,
          email: customerEmail,
          stripeId: sessionId,
        }),
      }).catch((err) => console.error("Failed to call invoice API:", err));
    }

    const lineItem = session.line_items?.data[0];
    const productName = lineItem?.description || "Subscription";
    const amount = lineItem?.amount_total
      ? (lineItem.amount_total / 100).toFixed(2)
      : "0.00";
    const currency = lineItem?.currency?.toUpperCase() || "USD";

    return (
      <div className="flex flex-col min-h-screen bg-background w-full">
        <SimpleNavbar />

        <main className="flex-1 relative flex items-center justify-center py-12 px-6 mt-16">
          <div className="absolute inset-0 hero-glow pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          <div className="relative w-full max-w-2xl">
            <div className="p-8 md:p-12 rounded-3xl border border-white/10 bg-card/50 backdrop-blur-2xl shadow-2xl space-y-8 text-center">
              {isSuccess ? (
                <>
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-purple-600/20 flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="h-10 w-10 text-purple-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                      Order{" "}
                      <span className="text-gradient-purple">Placed!</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Thank you for your purchase. Your subscription is now
                      active.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-purple-400 uppercase tracking-wider">
                        <Package className="h-3.5 w-3.5" />
                        Plan
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {productName}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-purple-400 uppercase tracking-wider">
                        <CreditCard className="h-3.5 w-3.5" />
                        Amount
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {amount} {currency}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 md:col-span-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-purple-400 uppercase tracking-wider">
                        <Calendar className="h-3.5 w-3.5" />
                        Account
                      </div>
                      <p className="text-base text-white">{customerEmail}</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-purple-600 text-white font-bold text-lg transition-all hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-red-600/20 flex items-center justify-center">
                      <XCircle className="h-10 w-10 text-red-500" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">
                      Payment <span className="text-red-500">Failed</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                      Something went wrong with your payment. Please try again.
                    </p>
                  </div>

                  <div className="pt-8 space-y-4">
                    <Link
                      href="/payment"
                      className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-white text-black font-bold text-lg transition-all hover:bg-zinc-200"
                    >
                      Try Again
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-transparent border border-white/20 text-white font-bold text-lg transition-all hover:bg-white/5"
                    >
                      Back to Home
                    </Link>
                  </div>
                </>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              A confirmation email has been sent to your inbox.
            </p>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Stripe Session Error:", error);
    redirect("/");
  }
}
