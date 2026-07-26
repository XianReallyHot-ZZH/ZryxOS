---
title: What is ZryxOS
description: ZryxOS — A Java-native Agent OS for enterprises. One config defines an agent, one runtime runs a fleet.
outline: deep
---

# What is ZryxOS

![ZryxOS Architecture](/architecture.svg)

ZryxOS is a Java-native Agent Operating System built on **JDK 21** and **Spring Boot 3.x**. It is designed for enterprises that need **self-hosted, fully auditable, and completely controllable** agent infrastructure.

## Why ZryxOS Exists

The vision behind ZryxOS is to make agent deployment **just work** in enterprise Java environments. While the agent ecosystem has matured around Python frameworks and cloud-hosted platforms, there is a clear gap for organizations that:

- Run Java as their backend standard
- Require self-hosted deployment for compliance and data sovereignty
- Need full auditability of LLM calls and tool executions
- Want controllable core logic without external framework lock-in

ZryxOS fills this gap as the first Java-native Agent OS in the ecosystem.

## Core Positioning

**Agent Runtime vs Agent OS**

- **Agent Runtime** — executes a single agent: calls LLM, executes tools, manages context, controls the reasoning loop
- **Agent OS** — manages a fleet of agents: lifecycle, unified channels, shared memory, multi-tenancy, governance, and cross-node coordination in distributed mode

ZryxOS is the latter. It is not just another agent — it is the runtime foundation that makes a fleet of agents reliably run and coordinate.

## Design Philosophy

### Config-Driven Agents

One Profile config defines one agent. No code required. Multiple agents can coexist on the same runtime instance, each with isolated configuration.

### Self-Implemented ReAct

The core reasoning loop is implemented from scratch, not wrapped in an external agent framework. This gives complete control over the execution flow and tool orchestration.

### Java-Native

Built on JDK 21 and Spring Boot 3.x. Single executable JAR deployment. Reuses existing Java operational toolchains. Runs on K8s, VMs, or bare metal — no cloud vendor lock-in.

### Private & Auditable

Deployed in your own infrastructure. Data never leaves your domain. All LLM calls and tool invocations are logged to SQLite audit tables from day one.

### Open Standards

- **Tools** — MCP (Model Context Protocol)
- **Agent Collaboration** — A2A (Agent-to-Agent)
- **Skills** — SKILL.md format

Integrates with the ecosystem, no proprietary protocols.

## Five Core Capabilities

### 1. LLM Integration

Unified Provider abstraction powered by **Spring AI Alibaba**. Supports mainstream models: DeepSeek, Tongyi Qianwen, Kimi, OpenAI, and local inference. Switch providers at runtime without code changes.

### 2. ReAct Loop

The reasoning engine. LLM decides whether to call tools and which ones. ZryxOS executes them and feeds results back. LLM decides the next step until it returns a final response or reaches the max iteration limit. Fully controllable loop behavior.

### 3. Memory System

Agents retain state across conversations. Two-layer memory: session memory + long-term memory (MEMORY.md). Long-term memory uses file-based storage with keyword search, with vector search upgrade path reserved.

### 4. Tool System

Agents interact with the external world via tools. Built-in tools: file, shell, HTTP. Three-tier plugin integration:

- **Zero-code** — Write SKILL.md, reuse existing MCP servers
- **Light-code** — Implement your own MCP server in any language
- **Heavy-code** — Java `@Tool` annotated Spring Beans

### 5. Web Service

All capabilities exposed via REST API. 10 core endpoints for session management, agent invocation, memory queries, and system info. Any language can integrate over HTTP.

## Key Features

- 🤖 **Config-Driven** — One Profile defines one agent, no coding required
- ☕ **Java-Native** — JDK 21 + Spring Boot, single JAR deployment
- 🔒 **Self-Hosted** — Runs on your K8s, VMs, or bare metal. Data stays in your domain.
- 🛡️ **Secure & Auditable** — Tool sandboxing, whitelist enforcement, full audit trail from day one
- 🧠 **Self-Implemented ReAct** — Core reasoning loop under full control
- 🔌 **Open Standards** — MCP for tools, A2A for agent collaboration, SKILL.md for skills
- 🧩 **Three-Tier Tool Extension** — Zero-code → Light-code → Heavy-code, pick by complexity
- 💾 **Cross-Conversation Memory** — Session + long-term memory layers
- 🌐 **Stateless & Scalable** — Runtime instances are stateless, state externalized for distributed future

## Roadmap

Our development philosophy: **slow is fast, focused and restrained**. First, solidify the single-node runtime kernel — make running and managing a fleet of agents on one node truly usable and used by real teams. Then grow distributed capabilities on top of that foundation. Distributed is the end vision, but engineering follows a single-node-first approach, with every step solid.

- **Phase 1 (Current) — Single-Node Runtime Kernel**
  - Five core capabilities working: config-driven agents, multi-agent coexistence, REST API integration, MCP integration
  - Make running and managing a fleet on a single node usable
  
- **Phase 2 (Planned) — Distributed Runtime Foundation**
  - Stateless nodes, externalized state, multi-replica deployment
  - Support larger scale and high availability
  
- **Phase 3 (Vision) — Cross-Node Agent Collaboration**
  - Introduce agent messaging substrate, integrate A2A
  - Enable agents on different nodes to discover, delegate, and reliably coordinate asynchronously
  
- **Horizontal Capabilities (Gradual across phases)**
  - Multi-tenancy, SSO, full audit, tool policies, observability, web management UI

## Project Information

- **Language**: Java (JDK 21)
- **License**: Apache 2.0
- **Organization**: zryx-labs
- **Long-Term Goal**: Join the Apache Software Foundation, aim for Apache Top-Level Project status

*For architecture details, see [Architecture](/docs/architecture). For getting started, see [Quick Start](/docs/quick-start).*
