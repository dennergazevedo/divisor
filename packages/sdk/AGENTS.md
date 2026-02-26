# Divisor SDK Instructions

The `@divisor.dev/sdk` is a lightweight library to fetch experiment variants and track conversions.

## Installation

```bash
npm install @divisor.dev/sdk
```

## Initialization

Initialize the `DivisorClient` with your `tenantId`. You can also optionally provide a `userId`. If not provided, a unique ID will be generated and stored in a cookie.

```typescript
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: "your-tenant-id",
  userId: "user-123" // optional
})
```

## Fetching a Variant

Use `getVariant` to receive the variant for a given experiment.

```typescript
async function checkExperiment() {
  const result = await client.getVariant({
    experimentName: "checkout-flow",
    variantFallback: "default" // optional
  })
  
  console.log(result.variant) // "A", "B", or "default"
}
```

## Tracking Conversions

Use the `conversion` method to track user events, such as completed purchases.

```typescript
async function trackConversion() {
  await client.conversion({
    experimentName: "checkout-flow",
    variant: "B",
    value: 150.00,
    itensCount: 2
  })
}
```

---

## React

```tsx
import { useState, useEffect } from 'react'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: process.env.NEXT_PUBLIC_DIVISOR_TENANT_ID!,
  userId: 'user-123' // Get this from your auth system
})

export function useExperiment(name: string, fallback: string) {
  const [variant, setVariant] = useState(fallback)

  useEffect(() => {
    client.getVariant({ experimentName: name, variantFallback: fallback })
      .then(res => setVariant(res.variant ?? fallback))
  }, [name, fallback])

  return variant
}

// Tracking example
const handlePurchase = () => {
  client.conversion({
    experimentName: "checkout-flow",
    variant: "B",
    value: 200,
    itensCount: 1
  })
}
```

---

## Angular

```typescript
import { Injectable } from '@angular/core';
import { DivisorClient } from "@divisor.dev/sdk";

@Injectable({
  providedIn: 'root'
})
export class DivisorService {
  private client = new DivisorClient({
    tenantId: 'your-tenant-id',
    userId: 'user-123'
  });

  async getVariant(name: string, fallback: string) {
    const result = await this.client.getVariant({
      experimentName: name,
      variantFallback: fallback
    });
    return result.variant;
  }

  async trackConversion(data: any) {
    await this.client.conversion(data);
  }
}
```

---

## Vue

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: 'your-tenant-id',
  userId: 'user-123'
})

const variant = ref('default')

onMounted(async () => {
  const res = await client.getVariant({
    experimentName: 'checkout-flow',
    variantFallback: 'default'
  })
  variant.value = res.variant
})

const track = () => {
  client.conversion({
    experimentName: 'checkout-flow',
    variant: variant.value,
    value: 50,
    itensCount: 1
  })
}
</script>
```
