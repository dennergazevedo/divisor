"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/ui/molecules/Tabs";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import { Separator } from "@/app/ui/atoms/Separator";
import { Plug, CheckCircle2, Copy, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

function IntegrationsContent() {
  const searchParams = useSearchParams();
  const initialTab =
    (searchParams.get("tab") as "javascript" | "react" | "angular" | "vue") ??
    "javascript";

  const [activeTab, setActiveTab] = useState<
    "javascript" | "react" | "angular" | "vue"
  >(initialTab);

  const { selectedTenant } = useAuth();
  const tenantId = selectedTenant?.id || "YOUR_TENANT_ID";

  const Step = ({
    number,
    title,
    children,
  }: {
    number: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="flex gap-6 relative group pb-12 last:pb-0">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-neutral-700 flex items-center justify-center text-sm font-bold text-white group-hover:border-purple-500 transition-colors z-10">
          {number}
        </div>
        <div className="w-[1px] flex-1 bg-neutral-800 group-last:hidden mt-2" />
      </div>
      <div className="flex flex-col gap-4 flex-1">
        <h3 className="font-bold text-white pt-2">{title}</h3>
        <div className="text-sm text-neutral-400">{children}</div>
      </div>
    </div>
  );

  const CodeBlock = ({
    code,
    color = "text-purple-300",
  }: {
    code: string;
    color?: string;
  }) => {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy");
        console.error(err);
      }
    };

    return (
      <div className="relative group/code">
        <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-[11px] leading-relaxed border border-neutral-800 font-mono">
          <code className={color}>{code}</code>
        </pre>
        <button
          onClick={onCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800/50 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover/code:opacity-100"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  };

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />

      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0 mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold flex flex-row items-center gap-2">
              <Plug className="w-5 h-5 text-purple-400" />
              Integration Guide
            </h1>
            <p className="text-sm text-neutral-400">
              Follow these simple steps to integrate Divisor into your stack and
              start experimenting.
            </p>
          </div>

          <Separator className="bg-neutral-800" />

          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "javascript" | "react" | "angular" | "vue")
            }
          >
            <TabsList className="mb-10 bg-zinc-900 border-neutral-800">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="angular">Angular</TabsTrigger>
              <TabsTrigger value="vue">Vue</TabsTrigger>
            </TabsList>

            <div className="bg-zinc-900/40 border border-neutral-800 rounded-2xl p-8 backdrop-blur-sm max-w-4xl">
              {/* ===================== JavaScript ===================== */}
              <TabsContent value="javascript" className="mt-0">
                <div className="space-y-0">
                  <Step number="1" title="Install the SDK">
                    <p className="mb-4">
                      Add the Divisor core SDK to your project via npm or yarn.
                    </p>
                    <CodeBlock
                      code={`npm install @divisor.dev/sdk`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="2" title="Instantiate DivisorClient">
                    <p className="mb-4">
                      Create a new instance of the client using your Tenant ID.
                    </p>
                    <CodeBlock
                      code={`import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: '${tenantId}',
  userId: 'user-unique-id' // Optional: for sticky variations
})`}
                    />
                  </Step>

                  <Step number="3" title="Fetch your variant">
                    <p className="mb-4">
                      Request which variant should be displayed for a specific
                      experiment.
                    </p>
                    <CodeBlock
                      code={`const { variant } = await client.getVariant({
  experimentName: 'hero-test',
  variantFallback: 'control'
})

if (variant === 'test-b') {
  // Show new version
} else {
  // Show control
}`}
                    />
                  </Step>

                  <Step number="4" title="Track conversions">
                    <p className="mb-4">
                      Send conversion events when users perform desired actions.
                    </p>
                    <CodeBlock
                      code={`await client.conversion({
  experimentName: 'hero-test',
  variant: variant,
  value: 1.0 // Optional: numeric value (e.g., price)
})`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="5" title="Done!">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">
                        You&apos;re all set! Check your dashboard for real-time
                        results.
                      </span>
                    </div>
                  </Step>
                </div>
              </TabsContent>

              {/* ===================== React ===================== */}
              <TabsContent value="react" className="mt-0">
                <div className="space-y-0">
                  <Step number="1" title="Install the SDK">
                    <p className="mb-4">
                      Add the Divisor SDK to your React project.
                    </p>
                    <CodeBlock
                      code={`npm install @divisor.dev/sdk`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="2" title="Instantiate DivisorClient">
                    <p className="mb-4">
                      We recommend instantiating the client outside your
                      component tree or in a Context.
                    </p>
                    <CodeBlock
                      code={`import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: '${tenantId}'
})`}
                    />
                  </Step>

                  <Step number="3" title="Use the Experiment hook">
                    <p className="mb-4">
                      Fetch the variant using a custom hook or directly in a
                      useEffect.
                    </p>
                    <CodeBlock
                      code={`import { useState, useEffect } from 'react'

function MyComponent() {
  const [variant, setVariant] = useState('control')

  useEffect(() => {
    client.getVariant({ experimentName: 'signup-test', variantFallback: 'control' })
      .then(res => setVariant(res.variant))
  }, [])

  return variant === 'B' ? <NewHero /> : <OldHero />
}`}
                    />
                  </Step>

                  <Step number="4" title="Track conversions">
                    <p className="mb-4">
                      Trigger conversions from event handlers.
                    </p>
                    <CodeBlock
                      code={`const onSignup = () => {
  client.conversion({
    experimentName: 'signup-test',
    variant: variant
  })
}`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="5" title="Done!">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">
                        Ready to scale! Your experiments are now live.
                      </span>
                    </div>
                  </Step>
                </div>
              </TabsContent>

              {/* ===================== Angular ===================== */}
              <TabsContent value="angular" className="mt-0">
                <div className="space-y-0">
                  <Step number="1" title="Install the SDK">
                    <CodeBlock
                      code={`npm install @divisor.dev/sdk`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="2" title="Create a Service">
                    <p className="mb-4">
                      Encapsulate the client in an Angular service for easy
                      injection.
                    </p>
                    <CodeBlock
                      code={`@Injectable({ providedIn: 'root' })
export class DivisorService {
  private client = new DivisorClient({
    tenantId: '${tenantId}'
  });

  async getVariant(name: string, fallback: string) {
    const res = await this.client.getVariant({ experimentName: name, variantFallback: fallback });
    return res.variant;
  }
}`}
                    />
                  </Step>

                  <Step number="3" title="Fetch variant in Component">
                    <CodeBlock
                      code={`// component.ts
variant = 'control';

async ngOnInit() {
  this.variant = await this.divisor.getVariant('top-bar', 'control');
}`}
                    />
                  </Step>

                  <Step number="4" title="Track conversions">
                    <CodeBlock
                      code={`async track() {
  await this.client.conversion({
    experimentName: 'top-bar',
    variant: this.variant
  });
}`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="5" title="Done!">
                    <p className="text-sm font-semibold text-purple-400">
                      Integration complete for Angular.
                    </p>
                  </Step>
                </div>
              </TabsContent>

              {/* ===================== Vue ===================== */}
              <TabsContent value="vue" className="mt-0">
                <div className="space-y-0">
                  <Step number="1" title="Install the SDK">
                    <CodeBlock
                      code={`npm install @divisor.dev/sdk`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="2" title="Instantiate Client">
                    <CodeBlock
                      code={`import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: '${tenantId}'
})`}
                    />
                  </Step>

                  <Step number="3" title="Fetch variant (Composition API)">
                    <CodeBlock
                      code={`<script setup>
import { ref, onMounted } from 'vue'

const variant = ref('control')
onMounted(async () => {
  const res = await client.getVariant({ experimentName: 'pricing-test', variantFallback: 'control' })
  variant.value = res.variant
})
</script>`}
                    />
                  </Step>

                  <Step number="4" title="Track conversions">
                    <CodeBlock
                      code={`async function handleSale() {
  await client.conversion({
    experimentName: 'pricing-test',
    variant: variant.value
  })
}`}
                      color="text-emerald-400"
                    />
                  </Step>

                  <Step number="5" title="Done!">
                    <p className="text-sm font-semibold text-purple-400">
                      Vue integration finished successfully.
                    </p>
                  </Step>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense>
      <IntegrationsContent />
    </Suspense>
  );
}
