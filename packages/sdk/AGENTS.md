# Divisor SDK Instructions

The `@divisor.dev/sdk` is a lightweight library to fetch experiment variants.

## Basic Usage (JavaScript/TypeScript)

```typescript
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: process.env.DIVISOR_TENANT_ID!,
})

async function checkExperiment() {
  const result = await client.getVariant({
    experimentName: "checkout-flow",
    userId: "user-123", // optional
    variantFallback: "default" // optional
  })
  
  console.log(result.variant) // "A", "B", or "default"
}
```

---

## React

Use a hook to manage the variant state.

```tsx
import { useState, useEffect } from 'react'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: process.env.NEXT_PUBLIC_DIVISOR_TENANT_ID!,
})

export function useExperiment(name: string, fallback: string) {
  const [variant, setVariant] = useState(fallback)

  useEffect(() => {
    client.getVariant({ experimentName: name, variantFallback: fallback })
      .then(res => setVariant(res.variant ?? fallback))
  }, [name, fallback])

  return variant
}
```

---

## Angular

Create a service to provide the Divisor client.

```typescript
import { Injectable } from '@angular/core';
import { DivisorClient } from "@divisor.dev/sdk";

@Injectable({
  providedIn: 'root'
})
export class DivisorService {
  private client = new DivisorClient({
    tenantId: 'your-tenant-id'
  });

  async getVariant(name: string, fallback: string) {
    const result = await this.client.getVariant({
      experimentName: name,
      variantFallback: fallback
    });
    return result.variant;
  }
}
```

---

## Vue

Use the Composition API for experiment logic.

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { DivisorClient } from "@divisor.dev/sdk"

const client = new DivisorClient({
  tenantId: 'your-tenant-id'
})

const variant = ref('default')

onMounted(async () => {
  const res = await client.getVariant({
    experimentName: 'checkout-flow',
    variantFallback: 'default'
  })
  variant.value = res.variant
})
</script>
```
