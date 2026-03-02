# Support

Support request endpoints.

## Send Support Request

Submit a support request which will be sent via email to the support team.

- **URL**: `/api/support`
- **Method**: `POST`
- **Auth Required**: No

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | User's email address |
| `subject` | `string` | Subject of the support request |
| `message` | `string` | Detailed message |

### Response

```json
{
  "message": "Support request sent successfully"
}
```
