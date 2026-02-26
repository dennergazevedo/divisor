"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/ui/molecules/Tabs";
import { SidebarTrigger } from "@/app/ui/organisms/Sidebar";
import { Separator } from "@/app/ui/atoms/Separator";
import { Plug } from "lucide-react";

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<
    "javascript" | "react" | "angular" | "vue"
  >("javascript");

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />

      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-bold flex flex-row items-center gap-2">
              <Plug className="w-5 h-5 text-purple-400" />
              Integrations
            </h1>
            <p className="text-sm text-neutral-400">
              Learn how to integrate Divisor and start tracking results in
              minutes.
            </p>
          </div>

          <Separator />

          <Tabs
            value={activeTab}
            onValueChange={(v) =>
              setActiveTab(v as "javascript" | "react" | "angular" | "vue")
            }
          >
            <TabsList className="mb-8">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
              <TabsTrigger value="angular">Angular</TabsTrigger>
              <TabsTrigger value="vue">Vue</TabsTrigger>
            </TabsList>

            {/* ===================== JavaScript ===================== */}
            <TabsContent value="javascript">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">
                    1. Initialization & Get Variant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Initialize the client and determination which variant to
                    show.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-purple-300 border border-neutral-800">
                    <code>{`import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: 'your-tenant-id',
  userId: 'user-123' // Optional
})

async function checkExperiment() {
  const result = await client.getVariant({
    experimentName: "checkout-flow",
    variantFallback: "default"
  })
  
  console.log(result.variant) // "A", "B", or "default"
}`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">2. Track Conversion</h3>
                  <p className="text-sm text-muted-foreground">
                    Record conversion events like purchases or signups.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-emerald-300 border border-neutral-800">
                    <code>{`// After a successful action:
await client.conversion({
  experimentName: "checkout-flow",
  variant: "B",
  value: 150.00,
  itensCount: 2
})`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* ===================== React ===================== */}
            <TabsContent value="react">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">1. Get Variant Hook</h3>
                  <p className="text-sm text-muted-foreground">
                    Determination the variant using React state and effects.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-purple-300 border border-neutral-800">
                    <code>{`import { useState, useEffect } from 'react'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: 'your-tenant-id',
  userId: 'user-123'
})

export function useExperiment(name, fallback) {
  const [variant, setVariant] = useState(fallback)

  useEffect(() => {
    client.getVariant({ experimentName: name, variantFallback: fallback })
      .then(res => setVariant(res.variant ?? fallback))
  }, [name, fallback])

  return variant
}`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">
                    2. Trigger Conversion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Call the conversion method from your event handlers.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-emerald-300 border border-neutral-800">
                    <code>{`function CheckoutButton({ variant }) {
  const handlePurchase = () => {
    client.conversion({
      experimentName: "checkout-flow",
      variant: variant,
      value: 199.99,
      itensCount: 1
    })
  }

  return <button onClick={handlePurchase}>Buy Now</button>
}`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* ===================== Angular ===================== */}
            <TabsContent value="angular">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">1. Service Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Inject the Divisor service across your application.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-purple-300 border border-neutral-800">
                    <code>{`@Injectable({ providedIn: 'root' })
export class DivisorService {
  private client = new DivisorClient({
    tenantId: 'your-tenant-id',
    userId: 'user-123'
  });

  async getVariant(name: string, fallback: string) {
    const res = await this.client.getVariant({
      experimentName: name, variantFallback: fallback
    });
    return res.variant;
  }
}`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">2. Event Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Add tracking logic to your service or components.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-emerald-300 border border-neutral-800">
                    <code>{`// In your DivisorService:
async track(experiment: string, variant: string) {
  await this.client.conversion({
    experimentName: experiment,
    variant: variant,
    value: 50,
    itensCount: 1
  });
}`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* ===================== Vue ===================== */}
            <TabsContent value="vue">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">1. Composition API</h3>
                  <p className="text-sm text-muted-foreground">
                    Use lifecycle hooks to fetch variants.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-purple-300 border border-neutral-800">
                    <code>{`<script setup>
import { ref, onMounted } from 'vue'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: 'your-tenant-id',
  userId: 'user-123'
})

const variant = ref('default')
onMounted(async () => {
  const res = await client.getVariant({
    experimentName: 'hero-test',
    variantFallback: 'default'
  })
  variant.value = res.variant
})
</script>`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                  <h3 className="font-bold text-white">
                    2. Conversion Example
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Track events directly from Vue templates.
                  </p>
                  <pre className="bg-black/50 rounded-md p-4 overflow-x-auto text-xs text-emerald-300 border border-neutral-800">
                    <code>{`async function onPurchase() {
  await client.conversion({
    experimentName: 'hero-test',
    variant: variant.value,
    value: 100,
    itensCount: 1
  })
}`}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
