# Tenant

Manage tenants and their members.

## Create Tenant

Create a new tenant organization.

- **URL**: `/api/tenant/create`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Name of the tenant |
| `url` | `string` | Unique URL slug for the tenant |

### Response

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

### Response

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

### Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `tenantId` | `string` | Yes | ID of the tenant |

### Response

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

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `userId` | `string` | ID of the user to update |
| `role` | `string` | New role (`admin` or `member`) |

### Response

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

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `userId` | `string` | ID of the user to remove |

### Response

```json
{
  "status": "removed"
}
```
