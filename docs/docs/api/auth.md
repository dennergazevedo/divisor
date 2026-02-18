# Auth

Authentication endpoints for managing user sessions and registration.

## Login

Authenticate a user and start a session.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | User's email address |
| `password` | `string` | User's password |

### Response

Returns user details, associated tenants, and pending invites. Sets `auth_token` cookie.

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "tenants": [
    {
      "id": "tenant_id",
      "name": "Tenant Name",
      "role": "owner"
    }
  ],
  "invites": []
}
```

## Logout

Terminate the current user session.

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Auth Required**: Yes

### Response

Clears the `auth_token` cookie.

```json
{
  "success": true
}
```

## Get Current User (Me)

Retrieve the currently authenticated user's information.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: Yes (Cookie `auth_token`)

### Response

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "tenants": [...],
  "invites": [...]
}
```

## Register

Register a new user.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | User's email address |
| `password` | `string` | User's password (min 6 chars recommended) |
| `name` | `string` | User's full name (optional) |

### Response

Returns the created user and sets `auth_token` cookie.

```json
{
  "user": {
    "id": "new_user_id",
    "email": "user@example.com"
  }
}
```
