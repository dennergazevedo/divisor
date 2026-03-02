---
title: Get Started
sidebar_position: 2
---

# Get Started

Welcome to Divisor! This guide will walk you through the initial steps to get your first experiment running.

## Prerequisites

- A Divisor account. If you don't have one, you can sign up at [app.divisor.dev](https://app.divisor.dev).
- Basic knowledge of JavaScript and your preferred framework (React, Angular, Vue, etc.).

## Step 1: Create Your First Experiment

1. Log in to your Divisor dashboard.
2. Click on **"Create Experiment"**.
3. Choose the **"A/B Test"** template.
4. **Name your experiment**: e.g., `Homepage CTA Test`.
5. **Define Variants**:
   - **Control**: The original version.
   - **Variant A**: The new version (e.g., change the button text to "Sign Up Now").
6. **Set Traffic Allocation**: Start with 50% / 50% for a simple test.
7. **Save** the experiment.

## Step 2: Install the SDK

Choose the installation method for your project:

```bash
# npm
npm install @divisor.dev/sdk

# yarn
yarn add @divisor.dev/sdk

# pnpm
pnpm add @divisor.dev/sdk
```

In your application, you need to initialize the `DivisorClient` with your `tenantId`. You can also optionally provide a `userId`.

```typescript
import { DivisorClient } from '@divisor.dev/sdk';

const client = new DivisorClient({
  tenantId: 'your-tenant-id-here', // You can find this in your Divisor dashboard settings
  userId: 'user-123' // Optional: provide a unique ID for the user
});
```

## Step 4: Implement the Experiment in Code

Use the `getVariant` method to determine which version the user should see.

```typescript
async function showHomepage() {
  const result = await client.getVariant({
    experimentName: 'Homepage CTA Test',
    variantFallback: 'control' // Fallback if something goes wrong
  });

  if (result.variant === 'Variant A') {
    renderNewButton();
  } else {
    renderOriginalButton();
  }
}
```


## Next Steps

- [Check SDK Usage Examples](./sdk/usage-js.md)
