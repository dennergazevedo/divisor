# Conversion

Log conversion data for experiments.

## Log Conversion

Log a conversion event for a user in a specific experiment. These logs are stored in Google Cloud Logging for further processing.

- **URL**: `/api/conversion`
- **Method**: `POST`
- **Auth Required**: No (Public SDK Access)

### Request Body

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | Unique identifier for the user |
| `tenantId` | `string` | ID of the tenant |
| `experimentName` | `string` | Name of the experiment |
| `variant` | `string` | Target variant |
| `value` | `number` | Optional value of the conversion (default: 0) |
| `itensCount` | `number` | Optional count of items involved (default: 0) |

### Response

```json
{
  "success": true
}
```
