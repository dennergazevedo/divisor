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

The `DivisorClient` is the main class for interacting with the Divisor service. It manages communication with our Edge API to retrieve experiment variants.

### Configuration

To instantiate the client, you will need your `tenantId`:

```typescript
import { DivisorClient } from '@divisor.dev/sdk';

const client = new DivisorClient({
  tenantId: 'your-tenant-id'
});
```

### Retrieving Variants

The main method is `getVariant`, which decides which version of the experiment the user should see.

```typescript
const result = await client.getVariant({
  experimentName: 'my-experiment',
  userId: 'user-id', // Optional
  variantFallback: 'control' // Optional
});

console.log(result.variant); // Ex: 'v1', 'v2' or 'control'
```
