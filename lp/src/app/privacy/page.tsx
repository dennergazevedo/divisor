"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-12">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </p>

        <div className="space-y-12 prose prose-invert max-w-none">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              1. Commitment to Privacy
            </h2>
            <p>
              At Divisor, we take the privacy of your data and your end users'
              data seriously. This policy describes how we collect, use, and
              protect information when using our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              2. Information Collection
            </h2>
            <div className="space-y-4">
              <p>
                <strong>Account Data:</strong> We collect basic information such
                as name, email, and organization data to provide access to the
                platform and technical support.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect metadata about how the
                platform is used for continuous improvement and billing
                purposes.
              </p>
              <p>
                <strong>Experiment Data:</strong> Divisor processes segmentation
                data sent by your SDK. This data is used strictly for executing
                A/B tests and is not shared with third parties.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              3. Cookie Policy
            </h2>
            <p>
              We use cookies and similar technologies to improve the user
              experience and ensure the platform works correctly.
            </p>
            <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-lg mt-4">
              <p className="text-sm italic">
                <strong>Technical Note:</strong> We save specific cookies to
                avoid repeated requests from the user side and ensure that the
                same user receives the same variant of an experiment
                consistently during their session.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              4. Data Security
            </h2>
            <p>
              We implement technical and organizational security measures to
              protect your data against unauthorized access, alteration, or
              destruction. This includes encryption at rest and in transit, as
              well as strict access controls.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              5. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal
              data stored on our platform at any time through account settings
              or technical support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">
              6. Contact
            </h2>
            <p>
              For questions related to privacy or data protection, contact us
              through our support channel at:{" "}
              <Link
                href="https://app.divisor.dev/support"
                className="text-purple-400 hover:underline"
              >
                app.divisor.dev/support
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
