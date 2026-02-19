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

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<"javascript" | "react">(
    "javascript",
  );

  return (
    <main className="relative flex flex-col h-full w-full">
      <SidebarTrigger className="fixed top-2 left-4 md:relative md:top-0 md:left-0 p-5 md:p-8 md:pt-12" />

      <section className="flex flex-col gap-4 p-8 py-4 mt-20 md:mt-0">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-lg font-bold">Integrations</h1>
            <p className="text-sm text-neutral-400">
              Examples on how to integrate Divisor into your application
            </p>
          </div>

          <Separator />

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "javascript" | "react")}
          >
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="react">React</TabsTrigger>
            </TabsList>

            {/* ===================== JavaScript ===================== */}
            <TabsContent value="javascript">
              <div className="rounded-lg border border-neutral-800 p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use the Divisor SDK in any JavaScript environment (Node.js,
                  Edge, Workers, etc).
                </p>

                <pre className="bg-neutral-900 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`import { Divisor } from "@divisor.dev/sdk"

const client = new Divisor({
  tenantId: process.env.DIVISOR_TENANT_ID,
})

const variant = client.getVariant({
  testName: "checkout-flow",
  userId: user.id,
})

console.log(variant)
// { value: "A", payload?: {...} }`}</code>
                </pre>

                <p className="text-xs text-neutral-500">
                  The SDK automatically resolves the correct variant based on
                  traffic distribution.
                </p>
              </div>
            </TabsContent>

            {/* ===================== React ===================== */}
            <TabsContent value="react">
              <div className="rounded-lg border border-neutral-800 p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Example using Divisor inside a React component.
                </p>

                <pre className="bg-neutral-900 rounded-md p-4 overflow-x-auto text-sm">
                  <code>{`import { Divisor } from "@divisor.dev/sdk"
import { useMemo } from "react"

const client = new Divisor({
  tenantId: import.meta.env.VITE_DIVISOR_TENANT_ID,
})

export function Checkout() {
  const variant = useMemo(() => {
    return client.getVariant({
      testName: "checkout-flow",
      userId: "user-123",
    })
  }, [])

  if (variant.value === "A") {
    return <CheckoutV1 />
  }

  return <CheckoutV2 />
}`}</code>
                </pre>

                <p className="text-xs text-neutral-500">
                  Tip: cache the client instance and avoid calling
                  <code className="mx-1">getVariant</code>
                  on every render.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
