---
title: Core Capabilities
description: Deep dive into ZryxOS's five core capabilities — LLM integration, ReAct loop, Memory system, Tool framework, and Web Service.
outline: deep
---

# Core Capabilities

ZryxOS delivers five core capabilities that form the foundation of an enterprise Agent OS.

## 1. LLM Integration

Unified Provider abstraction powered by **Spring AI Alibaba**.

**Supported Providers:**
- DeepSeek
- Tongyi Qianwen (Alibaba Cloud)
- Kimi (Moonshot AI)
- OpenAI
- Local inference (Ollama, vLLM)

**Configuration Example:**

```yaml
provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}
  base_url: https://api.deepseek.com  # optional
  max_tokens: 4096
  temperature: 0.7
```

**Multi-Provider Support:**

```yaml
providers:
  - name: deepseek
    model: deepseek-chat
  - name: qwen
    model: qwen-plus
  - name: local
    model: llama3
    base_url: http://localhost:11434
```

Switch at runtime by changing profile config — no code changes required.

## 2. ReAct Loop

Self-implemented reasoning loop. Not wrapped in external agent frameworks.

**Execution Flow:**

1. LLM receives prompt with available tools
2. LLM decides: call tool or return final answer
3. If tool call → ToolExecutor executes (with Sandbox validation)
4. Result fed back to LLM
5. Repeat until final answer or max iterations reached

**Configuration:**

```yaml
react:
  max_iterations: 10
  tool_choice: auto  # or required, none
```

**Why Self-Implemented?**

- Full control over execution flow
- Custom tool orchestration logic
- Precise audit points
- No external framework lock-in

## 3. Memory System

Three-layer memory architecture.

### Session Memory

Current conversation stored in `sessions.messages_json`. Automatically managed by SessionManager.

### Long-Term Memory

`.zryxos/memory/MEMORY.md` structure:

```markdown
# Core Memory (Never Truncated)

- User prefers concise responses
- Project uses Java 21 features
- API keys stored in environment variables

---

# Archive (Can Be Truncated)

## 2024-01-15
- Discussed deployment strategies
- Decided on K8s for production
```

### Three Backend Options

1. **MarkdownMemoryStore** (default) — Single MEMORY.md file
2. **SqliteMemoryStore** — Structured entries in `memory_entries` table
3. **Mem0MemoryStore** — Self-hosted Mem0 integration (future)

**MemoryTools API:**

```yaml
tools:
  - memory_add     # Add to long-term memory
  - memory_query   # Search memory
  - memory_list    # List all entries
```

## 4. Tool System

Agents interact with the world via tools.

### Built-in Tools

- `read_file` / `write_file` — File operations
- `shell` — Execute shell commands
- `http_get` / `http_post` — HTTP requests
- `memory_add` / `memory_query` — Memory operations
- `notify` — Push notifications to webhooks

### Three-Tier Plugin Integration

**1. Zero-Code — SKILL.md + MCP**

Write a skill definition, reuse existing MCP servers:

```markdown
---
name: weather-skill
mcp_server: weather-server
---

Query weather information via wttr.in API.
```

**2. Light-Code — Custom MCP Server**

Implement MCP protocol in any language:

```python
# weather_mcp_server.py
from mcp import MCPServer

server = MCPServer()

@server.tool("get_weather")
def get_weather(city: str) -> str:
    # Call weather API
    return f"Weather in {city}: 20°C, sunny"

server.run()
```

**3. Heavy-Code — Java @Tool Bean**

```java
@Component
public class WeatherTools {
    @Tool(name = "get_weather", 
          description = "Get current weather for a city")
    public String getWeather(@Param("city") String city) {
        // Implementation
        return "Weather: 20°C, sunny";
    }
}
```

### Sandbox

Application-layer whitelist enforcement:

```yaml
sandbox:
  allowed_paths:
    - /data
    - /tmp
  allowed_commands:
    - curl
    - wget
  allowed_domains:
    - api.openweathermap.org
    - wttr.in
```

All tool executions logged to `tool_invocations` audit table.

## 5. Web Service

10 REST API endpoints for enterprise integration.

### Session Management (4 endpoints)

```bash
# Create session
POST /api/v1/sessions

# Send message
POST /api/v1/sessions/{id}/messages

# Get history
GET /api/v1/sessions/{id}

# Archive session
DELETE /api/v1/sessions/{id}
```

### Agent Invocation (1 endpoint)

```bash
# Stateless invocation
POST /api/v1/agents/{name}/invoke
```

### Info Queries (3 endpoints)

```bash
# List profiles
GET /api/v1/profiles

# Query memory
GET /api/v1/memory

# List tools
GET /api/v1/tools
```

### System Status (2 endpoints)

```bash
# Health check
GET /api/v1/health

# Runtime info
GET /api/v1/info
```

**OpenAPI Specification:**

Full OpenAPI 3.0 spec available at `/api/v1/docs` when service is running.

---

*For hands-on examples, see [Quick Start](/docs/quick-start). For architecture details, see [Architecture](/docs/architecture).*
