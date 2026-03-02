# Stripe

Stripe integration endpoints for subscription management.

## Webhook

Handle Stripe webhooks to keep the local database in sync with Stripe events.

- **URL**: `/api/stripe/webhook`
- **Method**: `POST`
- **Auth Required**: No (Stripe Signature)

### Headers

| Header | Value | Description |
| :--- | :--- | :--- |
| `stripe-signature` | `string` | Signature for webhook verification |

### Response

```json
{
  "received": true
}
```

## Checkout Session

Create a Stripe Checkout session for a subscription plan.

- **URL**: `/api/stripe/checkout-session`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `plan` | `string` | Plan name (`growth` or `pro`) |
| `billingCycle` | `string` | Billing cycle (`monthly` or `annually`) |

### Response

```json
{
  "clientSecret": "cs_..."
}
```

## Update Invoice

Process invoice/payment status updates (often called via client-side after checkout).

- **URL**: `/api/stripe/invoice`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | User's email |
| `stripeId` | `string` | Stripe Session ID |
| `status` | `string` | status (optional, default: `pending`) |

### Response

```json
{
  "success": true
}
```
