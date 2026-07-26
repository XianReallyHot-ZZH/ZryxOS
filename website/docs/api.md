---
title: REST API
description: Complete HTTP API reference — 10 endpoints for session management, agent invocation, and system queries.
outline: deep
---

# REST API

ZryxOS exposes 10 REST API endpoints for enterprise integration.

Base URL: `http://localhost:8080/api/v1`

## Session Management

### Create Session

```http
POST /api/v1/sessions
Content-Type: application/json

{
  "profile_name": "default",
  "channel": "http",
  "user_id": "user-001"
}
```

Response:
```json
{
  "session_id": "http_user-001_default",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### Send Message

```http
POST /api/v1/sessions/{session_id}/messages
Content-Type: application/json

{
  "message": "What can you help with?"
}
```

Response:
```json
{
  "response": "I can help you with...",
  "session_id": "http_user-001_default",
  "tool_calls": []
}
```

### Get Session History

```http
GET /api/v1/sessions/{session_id}
```

Response:
```json
{
  "session_id": "http_user-001_default",
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
  ],
  "status": "active"
}
```

### Archive Session

```http
DELETE /api/v1/sessions/{session_id}
```

Response:
```json
{
  "session_id": "http_user-001_default",
  "status": "archived"
}
```

## Agent Invocation

### Invoke Agent (Stateless)

One-off request without session state.

```http
POST /api/v1/agents/{profile_name}/invoke
Content-Type: application/json

{
  "message": "What is 2+2?"
}
```

Response:
```json
{
  "response": "2+2 equals 4.",
  "tool_calls": []
}
```

## Info Queries

### List Profiles

```http
GET /api/v1/profiles
```

Response:
```json
{
  "profiles": [
    {
      "name": "default",
      "description": "Default agent profile",
      "provider": "deepseek",
      "tools": ["http_get", "read_file"]
    }
  ]
}
```

### Query Memory

```http
GET /api/v1/memory?query=deployment
```

Response:
```json
{
  "entries": [
    {
      "content": "Production uses K8s deployment",
      "timestamp": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### List Tools

```http
GET /api/v1/tools
```

Response:
```json
{
  "tools": [
    {
      "name": "http_get",
      "type": "built-in",
      "description": "Fetch data from HTTP endpoint"
    },
    {
      "name": "weather_tool",
      "type": "mcp",
      "description": "Get weather information"
    }
  ]
}
```

## System Status

### Health Check

```http
GET /api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "version": "0.1.0"
}
```

### Runtime Info

```http
GET /api/v1/info
```

Response:
```json
{
  "version": "0.1.0",
  "java_version": "21.0.1",
  "profiles_count": 3,
  "active_sessions": 2,
  "registered_tools": 12
}
```

## Authentication

Currently, ZryxOS REST API does not enforce authentication (designed for internal enterprise networks). Enterprise SSO integration is planned for the governance phase.

For production deployment behind a reverse proxy, implement authentication at the proxy level.

## Error Responses

Standard error format:

```json
{
  "error": "Profile not found",
  "code": "PROFILE_NOT_FOUND",
  "status": 404
}
```

Common status codes:
- `400` — Bad request (invalid payload)
- `404` — Resource not found
- `500` — Internal server error

---

*For quick examples, see [Quick Start](/docs/quick-start). For CLI commands, see [CLI Commands](/docs/commands).*
