# Experiments

Manage A/B testing experiments and variants.

## Create Experiment

Create a new experiment with variants.

- **URL**: `/api/experiments/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `name` | `string` | Name of the experiment (must be unique within tenant) |
| `endsAt` | `string` \| `null` | ISO date string for experiment end date |
| `variants` | `VariantInput[]` | List of variants (min 2) |

#### VariantInput

| Field | Type | Description |
| :--- | :--- | :--- |
| `value` | `string` | Variant value/name |
| `percent` | `number` | Traffic percentage (sum must be 100) |

### Response

Returns the created experiment with variants.

```json
{
  "experiment": {
    "id": "exp_id",
    "name": "Experiment Name",
    "is_active": true,
    "ends_at": "2023-12-31T23:59:59.999Z",
    "variants": [...]
  }
}
```

## List Experiments

List experiments for a tenant.

- **URL**: `/api/experiments/list`
- **Method**: `GET`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |
| `active` | `boolean` | No | Filter by active status (`true` or `false`) |

### Response (List)

Returns a list of experiments with their variants.

```json
{
  "experiments": [
    {
      "id": "exp_id",
      "name": "Experiment Name",
      "is_active": true,
      "variants": [...]
    }
  ]
}
```

## Update Experiment

Update an existing experiment.

- **URL**: `/api/experiments/update`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Request Body (Update)

| Field | Type | Description |
| :--- | :--- | :--- |
| `experimentId` | `string` | ID of the experiment to update |
| `tenantId` | `string` | ID of the tenant |
| `name` | `string` | New name of the experiment |
| `isActive` | `boolean` | Active status of the experiment |
| `endsAt` | `string` \| `null` | ISO date string for end date, or `null` for no expiration |
| `variants` | `VariantInput[]` | List of variants (replaces all existing variants) |

### Response (Update)

```json
{
  "status": "updated"
}
```

## Find Experiment

Internal endpoint to fetch experiment details for Edge functions. Requires a secret header.

- **URL**: `/api/experiments/find`
- **Method**: `GET`
- **Auth Required**: No (Secret Header)

### Headers

| Header | Value | Description |
| :--- | :--- | :--- |
| `x-edge-secret` | `string` | Internal secret for verification |

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |
| `name` | `string` | Yes | Name of the experiment |

### Response

```json
{
  "id": "exp_id",
  "name": "Experiment Name",
  "isActive": true,
  "endsAt": "...",
  "variants": [...],
  "owner": {
    "plan_status": "active",
    "current_plan": "pro"
  }
}
```

## Get Experiment Performance

Get performance metrics for a specific experiment.

- **URL**: `/api/experiments/performance/:experimentName`
- **Method**: `GET`
- **Auth Required**: Yes

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |

### Response

```json
{
  "performance": [
    {
      "variant": "control",
      "conversions": 150,
      "visitors": 1000,
      "conversion_rate": 0.15
    },
    {
      "variant": "variant-a",
      "conversions": 180,
      "visitors": 1000,
      "conversion_rate": 0.18
    }
  ]
}
```

## List Performance Experiments

List active experiments that have performance data available.

- **URL**: `/api/experiments/performance`
- **Method**: `GET`
- **Auth Required**: Yes

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |
| `page` | `number` | No | Page number (default: 1) |
| `limit` | `number` | No | Results per page (default: 10) |

### Response

```json
{
  "experiments": [
    { "experimentName": "Landing Page CTA" },
    { "experimentName": "Pricing Table Color" }
  ],
  "total": 2
}
```
