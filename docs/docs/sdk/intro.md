---
title: Introduction
sidebar_position: 1
---

# Divisor SDK

The Divisor SDK allows you to integrate A/B tests and edge experiments into your applications in a simple and performant way.

## Installation

Add the SDK to your project using your favorite package manager:

```bash
npm install @divisor.dev/sdk
# or
yarn add @divisor.dev/sdk
# or
pnpm add @divisor.dev/sdk
```

## Main Concepts

### DivisorClient

The `DivisorClient` is the main class for interacting with the Divisor service. It manages communication with our Edge API to retrieve experiment variants and our Analytics API to track conversions.

### Configuration

To instantiate the client, you will need your `tenantId`. You can also provide an optional `userId`.

```typescript
import { DivisorClient } from '@divisor.dev/sdk';

const client = new DivisorClient({
  tenantId: 'your-tenant-id',
  userId: 'user-123' // Optional
});
```

### Retrieving Variants

The `getVariant` method determines which version of the experiment the user should see.

```typescript
const { variant } = await client.getVariant({
  experimentName: 'my-experiment',
  variantFallback: 'control' // Optional
});

console.log(variant); // Ex: 'v1', 'v2' or 'control'
```

### Tracking Conversions

Track user actions (e.g., purchases) using the `conversion` method.

```typescript
await client.conversion({
  experimentName: 'my-experiment',
  variant: 'v1',
  value: 100,
  itensCount: 1
});
```
