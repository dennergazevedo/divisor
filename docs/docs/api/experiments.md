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

### Response

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

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `experimentId` | `string` | ID of the experiment to update |
| `tenantId` | `string` | ID of the tenant |
| `name` | `string` | New name of the experiment |
| `isActive` | `boolean` | Active status |
| `endsAt` | `string` \| `null` | ISO date string for end date |
| `variants` | `VariantInput[]` | List of variants (replaces existing) |

### Response

```json
{
  "status": "updated"
}
```
