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

## Validate Sessions

Identify and correct user records with expired plans and reset their sessions.

- **URL**: `/api/auth/validate`
- **Method**: `GET`
- **Auth Required**: No (Internal/Cron)

### Response

```json
{
  "success": true,
  "message": "X users corrected and sessions reset.",
  "updatedIds": ["user_id_1", "user_id_2"]
}
```

## Change Password

Update the authenticated user's password.

- **URL**: `/api/auth/password`
- **Method**: `POST`
- **Auth Required**: Yes

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `currentPassword` | `string` | Current password |
| `newPassword` | `string` | New password (min 8 chars) |

### Response

```json
{
  "message": "Password updated successfully"
}
```

## Google Login

Initiate Google OAuth2 authentication flow.

- **URL**: `/api/auth/google`
- **Method**: `GET`
- **Auth Required**: No

### Response

Redirects the user to the Google OAuth consent screen.

## Google Callback

Handle the callback from Google OAuth2.

- **URL**: `/api/auth/google/callback`
- **Method**: `GET`
- **Auth Required**: No

### Response

Sets `auth_token` cookie and redirects the user to the application home page.

## Forgot Password

Request a password recovery email.

- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | User's email address |

### Response

```json
{
  "message": "If an account exists with this email, you will receive a reset link shortly."
}
```

## Reset Password

Reset the password using a recovery token.

- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `token` | `string` | Recovery token from email |
| `password` | `string` | New password |

### Response

```json
{
  "message": "Password updated successfully."
}
```
