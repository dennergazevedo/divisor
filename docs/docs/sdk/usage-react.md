---
title: Usage with React
sidebar_position: 3
---

# Usage with React

Integrating Divisor into React applications is simple. We recommend creating a Context or a custom hook to manage the client.

## Provider Example

Create a `DivisorProvider` to make the client available throughout your application.

```tsx
// DivisorContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { DivisorClient } from '@divisor.dev/sdk';

const DivisorContext = createContext<DivisorClient | null>(null);

export const DivisorProvider: React.FC<{ tenantId: string; children: React.ReactNode }> = ({ 
  tenantId, 
  children 
}) => {
  const client = useMemo(() => new DivisorClient({ tenantId }), [tenantId]);

  return (
    <DivisorContext.Provider value={client}>
      {children}
    </DivisorContext.Provider>
  );
};

export const useDivisor = () => {
  const context = useContext(DivisorContext);
  if (!context) {
    throw new Error('useDivisor must be used within a DivisorProvider');
  }
  return context;
};
```

## Using in Components

You can use the hook to fetch variants within your components.

```tsx
import { useEffect, useState } from 'react';
import { useDivisor } from './DivisorContext';

const HeroSection = () => {
  const divisor = useDivisor();
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    divisor.getVariant({
      experimentName: 'hero-title-test',
      variantFallback: 'control'
    }).then(result => setVariant(result.variant));
  }, [divisor]);

  if (variant === 'v1') {
    return <h1>Increase your sales today!</h1>;
  }

  return <h1>Welcome to Divisor</h1>;
};
```

## SSR Tips (Next.js)

If you are using Next.js with App Router, you can initialize the client directly in Server Components:

```tsx
// page.tsx (Server Component)
import { DivisorClient } from '@divisor.dev/sdk';

export default async function Page() {
  const divisor = new DivisorClient({ tenantId: process.env.DIVISOR_TENANT_ID! });
  const { variant } = await divisor.getVariant({ experimentName: 'home-test' });

  return (
    <div>
      {variant === 'A' ? <ComponentA /> : <ComponentB />}
    </div>
  );
}
```
