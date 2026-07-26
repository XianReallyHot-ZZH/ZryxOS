---
title: CLI Commands
description: Complete reference for all 12 ZryxOS CLI commands.
outline: deep
---

# CLI Commands

ZryxOS provides 12 core commands covering initialization, runtime, profile management, and status queries.

## Workspace Management

### zryxos init

Initialize `.zryxos/` workspace in the current directory.

```bash
java -jar zryxos.jar init
```

Creates:
- `.zryxos/profiles/default.yaml`
- `.zryxos/memory/MEMORY.md`
- `.zryxos/mcp_servers.yaml` (optional)

### zryxos status

Show runtime status and configuration.

```bash
java -jar zryxos.jar status
```

Output:
- Current profiles
- Active sessions
- Configured providers
- Registered tools

## Run Modes

### zryxos chat

Interactive CLI chat mode.

```bash
java -jar zryxos.jar chat [--profile <name>]
```

Options:
- `--profile` — Profile name (default: `default`)

### zryxos serve

Start HTTP API service.

```bash
java -jar zryxos.jar serve [--port <port>]
```

Options:
- `--port` — HTTP port (default: `8080`)

### zryxos gateway

Multi-channel daemon (includes scheduler).

```bash
java -jar zryxos.jar gateway
```

Enables:
- REST API
- Scheduled tasks
- Multiple channel adapters

## Profile Management

### zryxos profile list

List all profiles.

```bash
java -jar zryxos.jar profile list
```

### zryxos profile create

Create a new profile.

```bash
java -jar zryxos.jar profile create <name>
```

Creates `.zryxos/profiles/<name>.yaml` from template.

### zryxos profile show

Show profile details.

```bash
java -jar zryxos.jar profile show <name>
```

### zryxos profile delete

Delete a profile.

```bash
java -jar zryxos.jar profile delete <name>
```

## Info Queries

### zryxos provider list

List configured providers.

```bash
java -jar zryxos.jar provider list
```

Output:
- Provider name
- Model
- Status (configured/active)

### zryxos tool list

List registered tools.

```bash
java -jar zryxos.jar tool list
```

Output:
- Tool name
- Type (built-in/MCP/Java)
- Description

### zryxos session list

List session history.

```bash
java -jar zryxos.jar session list [--active]
```

Options:
- `--active` — Show only active sessions

---

*For usage examples, see [Quick Start](/docs/quick-start). For REST API, see [REST API](/docs/api).*
