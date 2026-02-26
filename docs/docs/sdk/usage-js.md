---
title: Usage with JavaScript/TypeScript
sidebar_position: 2
---

# Usage with JavaScript and TypeScript

The Divisor SDK is written in TypeScript and provides full type definitions for a superior development experience.

## Basic Configuration

To start using the SDK in a pure JavaScript or TypeScript project:

```typescript
import { DivisorClient } from '@divisor.dev/sdk';

// Initial configuration
const config = {
  tenantId: 'your-tenant-id',
  userId: 'user-123' // Optional: provide a unique ID for the user
};

const divisor = new DivisorClient(config);
```

## Fetching Variants

The `getVariant` method is asynchronous and returns the assigned variant for a specific experiment.

```typescript
async function handleExperiment() {
  const result = await divisor.getVariant({
    experimentName: 'contact-button-text',
    variantFallback: 'original' // Optional: Value returned in case of error
  });

  if (result.variant === 'get-help') {
    renderButton('Get Help');
  } else {
    renderButton('Contact Us');
  }
}
```

## Tracking Conversions

Record events such as sales, clicks, or signups using the `conversion` method.

```typescript
async function onOrderPlaced() {
  await divisor.conversion({
    experimentName: 'contact-button-text',
    variant: 'get-help', // The variant the user saw
    value: 49.90, // Value of the transaction
    itensCount: 1 // Number of items
  });
}
```

## Type Reference

### `DivisorConfig`

| Property | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | The unique identifier for your workspace/tenant. |
| `userId` | `string` | Optional: provide a unique ID for the user. |

### `GetVariant` (Parameters)

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `experimentName` | `string` | Yes | The name of the experiment configured in the dashboard. |
| `variantFallback` | `string` | No | Variant to be used if something goes wrong (e.g., offline network). |

### `ExperimentResult`

| Property | Type | Description |
| :--- | :--- | :--- |
| `experiment` | `string` | Name of the requested experiment. |
| `variant` | `string \| null` | The variant assigned to the user. |