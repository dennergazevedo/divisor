"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-neutral-100 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-purple-400 transition-colors mb-12"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              1. Service Description
            </h2>
            <p>
              Divisor is an A/B testing and feature flag platform built for
              performance and scale. We provide tools for traffic segmentation,
              variant analysis, and real-time experiment management.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              2. Plans and Availability
            </h2>
            <p>We currently offer three levels of service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Free:</strong> Ideal for small projects and initial
                experimentation.
              </li>
              <li>
                <strong>Growth:</strong> Focused on growing teams with higher
                traffic volume.
              </li>
              <li>
                <strong>Pro:</strong> Complete solution for large operations
                with priority support and advanced features.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              3. Subscriptions and Refunds
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Monthly Subscription:</strong> We do not offer refunds
                for monthly subscriptions, as we provide a free trial option to
                evaluate the platform before purchasing.
              </p>
              <p>
                <strong>Annual Subscription:</strong> Refunds for annual plans
                can be requested within the first 30 days of the initial
                subscription or renewal. After this period, no proportional
                refund will be issued.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              4. Cancellation and Renewal
            </h2>
            <p>
              All subscriptions are automatically renewed at the end of the
              contracted period (monthly or annual) unless a cancellation is
              requested through the control panel before the renewal date.
              Cancellation stops future renewal, but access remains active until
              the end of the already paid period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              5. Support and SLA
            </h2>
            <p>
              We commit to a support response time of up to 24 hours for all our
              paid users (Growth and Pro). Support is primarily provided through
              the digital channels indicated on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              6. Limitation of Liability
            </h2>
            <p>
              Divisor is provided "as is". We are not responsible for loss of
              revenue, data, or business interruptions caused by the use or
              inability to use the platform, within the limits permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              7. Intellectual Property
            </h2>
            <p>
              All content, logos, design, and source code of the Divisor
              platform (except parts explicitly marked as Open Source under the
              MIT license) are the exclusive property of Divisor.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              8. Technical Clauses
            </h2>
            <p>
              The user is responsible for the correct implementation of the
              Divisor SDK in their applications. We guarantee the integrity of
              the service in our infrastructure but are not responsible for
              incorrect implementations that may affect the performance of the
              user's final application.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time.
              Significant changes will be notified to users via email or through
              notices on the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
