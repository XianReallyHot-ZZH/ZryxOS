---
title: Architecture
description: ZryxOS five-layer architecture — from triggers to storage, understanding the complete system design.
outline: deep
---

# Architecture

ZryxOS adopts a clean five-layer architecture, from trigger sources down to storage.

![ZryxOS Architecture](/architecture.svg)

## Five Layers Overview

### 1. Channel / Trigger Layer

Three trigger sources:

- **CLI** — Human-triggered, interactive command-line chat
- **REST API** — Human-triggered, HTTP integration for enterprise systems
- **Scheduler** — Clock-triggered, cron-based scheduled execution

All three converge into `AgentService.process()`, ensuring uniform execution paths.

### 2. Agent Layer

One Agent = One directory (`.zryxos/agents/<name>/`):

- `AGENT.md` — Frontmatter defines Profile, body defines task instructions
- Optional: `skills/*.md`, `scripts/`, `REFERENCE.md`

Loaded by `AgentLoader` → derives Profile → registers to `ProfileRegistry`.

### 3. Engine Layer

**ReActLoop** — Self-implemented reasoning loop (not wrapped in external frameworks):

1. LLM decides whether to call tools and which ones
2. `ToolExecutor` executes with Sandbox validation
3. Results fed back to LLM
4. Loop continues until final response or max iterations reached

**PromptBuilder** — Assembles system prompt:
- Bootstrap (AGENTS.md, SOUL.md, USER.md)
- Memory context
- Conversation history
- Available tools

**AgentService** — Unified entry point for all three trigger sources.

**AgentScheduler** — Third trigger source, cron-based clock push.

### 4. Capability Layer

**Provider** (LLM Integration):
- Spring AI Alibaba abstraction
- Explicit provider-name → ChatModel mapping (no type scanning)
- Multi-provider coexistence

**Memory**:
- `MemoryService` facade — hides SessionManager + LongTermMemory
- Session memory (current conversation)
- Long-term memory (MEMORY.md: core + archive sections)
- Three backend options: Markdown / SQLite / Mem0

**Tool**:
- `ZryxTool` abstraction — unified interface for all tool types
- Built-in: file, shell, HTTP, memory, notify
- Plugin integration: MCP client + Java `@Tool` beans
- `Sandbox` — application-layer whitelist (path/command/domain)

**Notify**:
- Outbound push capability (symmetric to inbound Channel)
- `NotifyChannelAdapter` interface
- Core implementation: `WebhookNotifyAdapter`

### 5. Storage Layer

**SQLite**:
- `sessions` — session metadata and message history
- `tool_invocations` — audit trail (written from day one)
- `llm_calls` — audit trail (written from day one)
- `scheduled_tasks` — scheduler state
- `task_executions` — scheduler history

**Filesystem**:
- `.zryxos/agents/` — Agent directories
- `.zryxos/memory/MEMORY.md` — long-term memory
- `.zryxos/profiles/` — Profile configs (derived from AGENT.md)

## Key Design Decisions

### ReAct Loop: Self-Implemented

Not wrapped in Spring AI Agent abstraction. LLM decides tool usage → ZryxOS executes → result fed back → continue. Max iterations default: 10 (configurable per Profile).

**Critical:** Spring AI auto-execution must be disabled. Use only: ChatClient abstraction, protocol conversion, schema generation. Tool execution 100% controlled by ToolExecutor.

### Provider Mapping: Explicit

Explicit provider-name → ChatModel mapping (not type scanning). Prevents ambiguity when multiple providers coexist.

### Memory Architecture: Three-Layer

- **Session Memory** — managed by SessionManager, stored in `sessions.messages_json`
- **Long-term Memory** — MEMORY.md file, two sections (core never truncated, archive can be truncated)
- **Episodic Memory** — planned for expansion phase

**MemoryService Facade** — unified interface hiding SessionManager + LongTermMemory.

### Tool System: Three-Tier Plugin

1. **Zero-code** — AGENT.md directory + reuse MCP server
2. **Light-code** — Write MCP server in any language
3. **Heavy-code** — Java `@Tool` annotated Spring Bean

### Agent Definition: Directory-Based

One Agent = One directory. `AGENT.md` frontmatter → Profile derivation. Body → system prompt injection. Sub-resources (skills, scripts) loaded on-demand via tools (progressive disclosure).

**Not a Tool** — Agent directory is a context source, not an executable tool.

### Scheduler: Third Trigger Source

Clock-triggered execution, parallel to human-triggered (CLI/REST). Calls same `AgentService.process()`. Process-level ReentrantLock prevents overlapping runs per task.

### Notify System: Symmetric Outbound

Complements inbound Channels with outbound push. `NotifyChannelAdapter` interface, core impl: `WebhookNotifyAdapter`. Domain whitelist enforced by Sandbox, audited via existing `tool_invocations` table.

## Module Structure (9 Maven Modules)

```
zryxos-core          # Core abstractions, ReAct loop, Agent/Profile management, scheduler
zryxos-provider      # LLM provider abstraction
zryxos-memory        # Memory service facade, LongTermMemory, MemoryTools
zryxos-tool          # Built-in tools, MCP client, ToolRegistry, Sandbox, NotifyTools
zryxos-channel-cli   # CLI channel
zryxos-web           # REST API (6 controllers, 10 endpoints)
zryxos-storage       # SQLite persistence, repositories
zryxos-cli           # Picocli entry, 12 commands, ConfigLoader
zryxos-boot          # Spring Boot startup, auto-configuration
```

## Execution Flow

**CLI Trigger:**
```
User types in CLI → CliChannel.sendMessage()
  → AgentService.process(profile, message, sessionId)
    → PromptBuilder.build(session + memory + tools)
      → ReActLoop.execute(prompt)
        → LLM decides tool call
          → ToolExecutor.execute(toolName, args) [with Sandbox check]
            → Tool implementation (file/shell/http/...)
              → Result written to tool_invocations audit table
            → Result fed back to LLM
          → Loop continues or returns final response
        → Response written to sessions.messages_json
      → Response returned to CLI
```

**REST API Trigger:**
```
HTTP POST /api/v1/sessions/{id}/messages
  → SessionController.sendMessage()
    → AgentService.process() [same path as CLI]
      → [same as above]
    → JSON response
```

**Scheduler Trigger:**
```
AgentScheduler.tick() [cron matched]
  → Check ReentrantLock (prevent overlap)
    → AgentService.process(profile, scheduledMessage, schedulerSessionId)
      → [same execution path]
        → If notify_channels configured:
          → NotifyTools.notify(channel, result)
            → WebhookNotifyAdapter.send(url, payload)
              → Domain whitelist enforced by Sandbox
              → Audited in tool_invocations table
      → Execution recorded in task_executions table
```

## Statefulness

**Stateless Runtime Instances** — All state externalized to SQLite and filesystem. Multiple instances can run (future load balancing), each reads from shared storage.

**Stateful Components:**
- Sessions (SQLite `sessions` table)
- Memory (MEMORY.md file + SQLite optional backend)
- Scheduler state (`scheduled_tasks`, `task_executions` tables)

This design enables smooth transition to distributed mode in Phase 2.

## Security Model

**Sandbox** — Application-layer enforcement (not JDK SecurityManager, which is removed in JDK 21):

- File tools: path whitelist
- Shell tools: command whitelist
- HTTP tools: domain whitelist
- NotifyTools: domain whitelist

**Audit Trail** — From day one:
- `tool_invocations` — every tool call logged
- `llm_calls` — every LLM request logged (tokens, duration, provider)

**Credential Management** — Environment variables (never hardcoded). Enterprise integration via vault (planned for governance phase).

*For hands-on examples, see [Quick Start](/docs/quick-start). For detailed capability breakdown, see [Core Capabilities](/docs/capabilities).*
