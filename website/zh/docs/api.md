---
title: REST API
description: 完整的 HTTP API 参考 — 10 个端点，涵盖会话管理、Agent 调用和系统查询。
outline: deep
---

# REST API

ZryxOS 暴露 10 个 REST API 端点供企业集成。

基础 URL: `http://localhost:8080/api/v1`

## 会话管理

### 创建会话

```http
POST /api/v1/sessions
Content-Type: application/json

{
  "profile_name": "default",
  "channel": "http",
  "user_id": "user-001"
}
```

响应:
```json
{
  "session_id": "http_user-001_default",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### 发送消息

```http
POST /api/v1/sessions/{session_id}/messages
Content-Type: application/json

{
  "message": "你能帮我做什么？"
}
```

响应:
```json
{
  "response": "我可以帮助你...",
  "session_id": "http_user-001_default",
  "tool_calls": []
}
```

### 获取会话历史

```http
GET /api/v1/sessions/{session_id}
```

响应:
```json
{
  "session_id": "http_user-001_default",
  "messages": [
    {"role": "user", "content": "你好"},
    {"role": "assistant", "content": "你好！"}
  ],
  "status": "active"
}
```

### 归档会话

```http
DELETE /api/v1/sessions/{session_id}
```

响应:
```json
{
  "session_id": "http_user-001_default",
  "status": "archived"
}
```

## Agent 调用

### 调用 Agent（无状态）

不需要会话状态的一次性请求。

```http
POST /api/v1/agents/{profile_name}/invoke
Content-Type: application/json

{
  "message": "2+2 等于多少？"
}
```

响应:
```json
{
  "response": "2+2 等于 4。",
  "tool_calls": []
}
```

## 信息查询

### 列出 Profiles

```http
GET /api/v1/profiles
```

响应:
```json
{
  "profiles": [
    {
      "name": "default",
      "description": "默认 Agent Profile",
      "provider": "deepseek",
      "tools": ["http_get", "read_file"]
    }
  ]
}
```

### 查询记忆

```http
GET /api/v1/memory?query=部署
```

响应:
```json
{
  "entries": [
    {
      "content": "生产环境使用 K8s 部署",
      "timestamp": "2024-01-15T12:00:00Z"
    }
  ]
}
```

### 列出工具

```http
GET /api/v1/tools
```

响应:
```json
{
  "tools": [
    {
      "name": "http_get",
      "type": "built-in",
      "description": "从 HTTP 端点获取数据"
    },
    {
      "name": "weather_tool",
      "type": "mcp",
      "description": "获取天气信息"
    }
  ]
}
```

## 系统状态

### 健康检查

```http
GET /api/v1/health
```

响应:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "version": "0.1.0"
}
```

### 运行时信息

```http
GET /api/v1/info
```

响应:
```json
{
  "version": "0.1.0",
  "java_version": "21.0.1",
  "profiles_count": 3,
  "active_sessions": 2,
  "registered_tools": 12
}
```

## 认证

当前 ZryxOS REST API 不强制认证（设计用于企业内部网络）。企业 SSO 集成计划在治理阶段实现。

对于部署在反向代理后的生产环境，在代理层实现认证。

## 错误响应

标准错误格式:

```json
{
  "error": "Profile not found",
  "code": "PROFILE_NOT_FOUND",
  "status": 404
}
```

常见状态码:
- `400` — 错误请求（无效载荷）
- `404` — 资源未找到
- `500` — 内部服务器错误

---

*快速示例请参阅 [快速开始](/zh/docs/quick-start)。CLI 命令请参阅 [CLI 命令](/zh/docs/commands)。*
