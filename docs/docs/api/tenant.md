# Tenant

Manage tenants and their members.

:::note
Individual tenants are typically discovered via the [Get Current User](../api/auth#get-current-user-me) endpoint, which returns all tenants the user belongs to.
:::

## Create Tenant

Create a new tenant organization.

- **URL**: `/api/tenant/create`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body (Create)

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Name of the tenant |
| `url` | `string` | Unique URL slug for the tenant |

### Response (Create)

Returns the created tenant details.

```json
{
  "tenant": {
    "id": "tenant_id",
    "name": "My Company",
    "url": "my-company"
  }
}
```

## List Tenant Invites

List all pending invitations for a specific tenant.

- **URL**: `/api/tenant/list-invites`
- **Method**: `GET`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |

### Response (Invites)

```json
{
  "invites": [
    {
      "id": "invite_id",
      "email": "user@example.com",
      "role": "member",
      "created_at": "..."
    }
  ]
}
```

## List Tenant Members

List all members of a tenant.

- **URL**: `/api/tenant/list-users`
- **Method**: `GET`
- **Auth Required**: Yes

### Query Parameters (Members)

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |

### Response (Members)

```json
{
  "members": [
    {
      "user_id": "user_id",
      "email": "user@example.com",
      "role": "owner",
      "joined_at": "..."
    }
  ]
}
```

## Update Permissions

Update a member's role within the tenant.

- **URL**: `/api/tenant/permissions`
- **Method**: `POST`
- **Auth Required**: Yes
- **Role Required**: `owner`

### Request Body (Permissions)

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `userId` | `string` | ID of the user to update |
| `role` | `string` | New role (`admin` or `member`) |

### Response (Permissions)

```json
{
  "status": "updated"
}
```

## Remove User

Remove a user from the tenant.

- **URL**: `/api/tenant/remove-user`
- **Method**: `POST`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin` (cannot remove owner)

### Request Body (Remove)

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `userId` | `string` | ID of the user to remove |

### Response (Remove)

```json
{
  "status": "removed"
}
```
