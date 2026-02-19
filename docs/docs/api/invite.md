# Invites

Manage tenant invitations.

## Create Invite

Invite a user to join a tenant.

- **URL**: `/api/invite/create`
- **Method**: `POST`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `tenantId` | `string` | ID of the tenant |
| `email` | `string` | User's email to invite |
| `role` | `string` | Role assigned: `admin` or `member` |

### Response

Returns the created invite details.

```json
{
  "invite": {
    "id": "invite_id",
    "email": "user@example.com",
    "role": "member",
    "token": "...",
    "created_at": "..."
  }
}
```

## List My Invites

List pending invitations for the authenticated user.

- **URL**: `/api/invite/list`
- **Method**: `GET`
- **Auth Required**: Yes

### Response (My Invites)

```json
{
  "invites": [
    {
      "id": "invite_id",
      "tenant_id": "tenant_id",
      "tenant_name": "Tenant Name",
      "role": "member",
      "created_at": "..."
    }
  ]
}
```

## Respond to Invite

Accept or decline an invitation.

- **URL**: `/api/invite/respond`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body (Respond)

| Field | Type | Description |
| :--- | :--- | :--- |
| `inviteId` | `string` | ID of the invite |
| `accept` | `boolean` | `true` to accept, `false` to decline |

### Response (Respond)

```json
{
  "status": "accepted" // or "declined"
}
```

## Cancel Invite

Cancel a pending invitation sent by the tenant.

- **URL**: `/api/invite/cancel`
- **Method**: `POST`
- **Auth Required**: Yes
- **Role Required**: `owner` or `admin`

### Request Body (Cancel)

| Field | Type | Description |
| :--- | :--- | :--- |
| `inviteId` | `string` | ID of the invite to cancel |

### Response (Cancel)

```json
{
  "status": "canceled"
}
```
