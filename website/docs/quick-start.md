---
title: Quick Start
description: Get ZryxOS running in 5 minutes. Build, initialize, configure, and start your first agent.
outline: deep
---

# Quick Start

Get ZryxOS running in 5 minutes.

## Prerequisites

- **JDK 21+** ([Download](https://adoptium.net/))
- **Maven 3.8+**
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/XianReallyHot-ZZH/ZryxOS.git
cd ZryxOS
```

### 2. Build the Project

```bash
mvn clean package
```

This produces `target/zryxos.jar` — a single executable JAR.

### 3. Initialize Workspace

```bash
java -jar target/zryxos.jar init
```

This creates a `.zryxos/` workspace in the current directory with default configuration:

```
.zryxos/
├── profiles/
│   └── default.yaml       # Default agent profile
├── memory/
│   └── MEMORY.md          # Long-term memory
├── mcp_servers.yaml       # MCP server config (optional)
└── zryxos.db              # SQLite database (created on first run)
```

### 4. Configure LLM Provider

Edit `.zryxos/profiles/default.yaml` and fill in your API key:

```yaml
name: default
description: Default agent profile

identity:
  agent_name: ZryxOS Assistant
  prompt: You are a helpful assistant.

provider:
  name: deepseek        # or qwen, kimi, openai
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}  # Read from environment variable

tools:
  - http_get
  - http_post
  - read_file
  - write_file

channels:
  - name: cli
```

**Environment Variable Setup:**

```bash
export DEEPSEEK_API_KEY=your_api_key_here
```

Or replace `${DEEPSEEK_API_KEY}` directly with your key (not recommended for production).

### 5. Start Chat

```bash
java -jar target/zryxos.jar chat
```

You should see:

```
ZryxOS v0.1.0
Profile: default
Type 'exit' to quit

You: Hello
Assistant: Hello! How can I help you today?
```

## Your First Agent

Let's create a weather assistant agent.

### 1. Create Profile

```bash
java -jar target/zryxos.jar profile create weather-bot
```

### 2. Edit Configuration

Edit `.zryxos/profiles/weather-bot.yaml`:

```yaml
name: weather-bot
description: Weather query assistant with outfit recommendations

identity:
  agent_name: Weather Assistant
  prompt: |
    You are a friendly weather assistant. Help users check weather 
    and give outfit recommendations based on temperature and conditions.

provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}

tools:
  - http_get       # For calling weather API
  - http_post

sandbox:
  allowed_domains:
    - api.openweathermap.org
    - wttr.in

channels:
  - name: cli
```

### 3. Chat with Weather Bot

```bash
java -jar target/zryxos.jar chat --profile weather-bot
```

Example conversation:

```
You: What's the weather in Beijing today?
Assistant: Let me check that for you.
[Agent calls weather API via http_get tool]
Assistant: Beijing is currently 15°C with clear skies. 
I recommend wearing a light jacket if going out.
```

## Run as HTTP Service

Instead of CLI, start ZryxOS as an HTTP API server:

```bash
java -jar target/zryxos.jar serve --port 8080
```

### Create a Session

```bash
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "profile_name": "default",
    "channel": "http",
    "user_id": "user-001"
  }'
```

Response:

```json
{
  "session_id": "http_user-001_default",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### Send a Message

```bash
curl -X POST http://localhost:8080/api/v1/sessions/http_user-001_default/messages \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, what can you do?"
  }'
```

Response:

```json
{
  "response": "Hello! I'm ZryxOS Assistant. I can help you with...",
  "session_id": "http_user-001_default"
}
```

### Stateless Invocation

For one-off requests without session state:

```bash
curl -X POST http://localhost:8080/api/v1/agents/default/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is 2+2?"
  }'
```

## Scheduled Tasks

Configure agents to run on a schedule.

Edit `.zryxos/profiles/daily-report.yaml`:

```yaml
name: daily-report
description: Daily report generator

identity:
  agent_name: Report Bot
  prompt: Generate a daily summary report.

provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}

tools:
  - http_get
  - read_file

schedules:
  - cron: "0 9 * * *"          # Every day at 9 AM
    message: "Generate daily report"
  - cron: "0 18 * * FRI"       # Every Friday at 6 PM
    message: "Generate weekly summary"

notify_channels:
  - type: webhook
    url: ${REPORT_WEBHOOK_URL}

channels:
  - name: scheduler
```

Start the gateway (includes scheduler):

```bash
java -jar target/zryxos.jar gateway
```

The agent will run automatically at scheduled times and push results to the configured webhook.

## Next Steps

- **[Architecture](/docs/architecture)** — Understand the five-layer architecture
- **[Core Capabilities](/docs/capabilities)** — Deep dive into LLM, ReAct, Memory, Tools, Web Service
- **[CLI Commands](/docs/commands)** — All 12 commands reference
- **[REST API](/docs/api)** — Complete HTTP API documentation

## Common Issues

**Issue: `DEEPSEEK_API_KEY not found`**

Solution: Export the environment variable before running:

```bash
export DEEPSEEK_API_KEY=your_key
java -jar target/zryxos.jar chat
```

**Issue: Tool execution blocked by sandbox**

Solution: Add the domain/command to whitelist in profile config:

```yaml
sandbox:
  allowed_domains:
    - example.com
  allowed_commands:
    - curl
    - wget
```

**Issue: Port 8080 already in use**

Solution: Specify a different port:

```bash
java -jar target/zryxos.jar serve --port 8090
```
