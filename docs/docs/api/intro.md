# API Introduction

Welcome to the Divisor API documentation.

The API allows you to programmatically interact with Divisor resources such as authentication, experiments, invites, and tenants.

## Authentication

Most endpoints require authentication via the `auth_token` cookie, which is set upon successful login or registration.

## Response Format

All API responses are in JSON format.

## Error Handling

Errors are returned with an appropriate HTTP status code and a JSON body containing an `error` message.

```json
{
  "error": "Description of the error"
}
```
