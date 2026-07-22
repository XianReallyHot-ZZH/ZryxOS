# ZryxOS Project Guide for AI Assistants

## Project Overview

ZryxOS is a Java-based Agent OS (Operating System) designed for enterprise scenarios. It serves as a unified platform deployed on enterprise infrastructure (K8s or servers) to run multiple business agents, sharing capabilities like channel integration, model routing, tool invocation, memory systems, and sandbox execution.

### Key Positioning

- **Technology Stack**: Java 21 + Spring Boot 3.x + Spring AI Alibaba
- **Deployment Model**: Single JAR, self-hosted, no cloud lock-in
- **Target Users**: Enterprises requiring private, auditable, controllable agent infrastructure
- **Differentiation**: First Java-native Agent OS, filling the gap left by Node.js (OpenClaw) and Python (Hermes Agent) in Java ecosystems

### Project Status

**Current Phase**: Core development (4 weeks, 12 hours total)
- Objective: Deliver Agent OS runtime kernel
- Scope: Five core capabilities operational
- Post-core: Extended features and enterprise governance via community

## Architecture Overview

### Core Layers (Bottom-up)

1. **Storage Layer** (`zryxos-storage`)
   - SQLite: sessions, tool_invocations, llm_calls, scheduled_tasks, task_executions
   - Filesystem: .zryxos/ directory (profiles, MEMORY.md, skills, agents)

2. **Capability Layer**
   - **Provider** (`zryxos-provider`): LLM abstraction, explicit provider-name-to-ChatModel mapping
   - **Memory** (`zryxos-memory`): Three-tier (session + long-term MEMORY.md + episodic), MemoryService façade
   - **Tool** (`zryxos-tool`): Built-in tools + MCP integration + Sandbox + NotifyTools
   - **Notify**: Outbound push capability (WebhookNotifyAdapter)

3. **Engine Layer** (`zryxos-core`)
   - **ReActLoop**: Self-implemented Reason+Act cycle (max 10 iterations)
   - **PromptBuilder**: Assembles system prompt + bootstrap + memory + history + tools
   - **ToolExecutor**: Sandbox check + audit write
   - **AgentService**: Unified entry point for all three trigger sources
   - **AgentScheduler**: Third trigger source (cron-based, clock-driven)

4. **Agent Layer**
   - One Agent = One directory (`.zryxos/agents/<name>/`)
   - `AGENT.md`: frontmatter (profile) + body (task instructions)
   - Optional: `skills/*.md` (sub-instructions), `scripts/`, `REFERENCE.md`
   - Loaded by `AgentLoader` → derives Profile → registers to ProfileRegistry

5. **Channel/Trigger Layer**
   - CLI Channel (`zryxos-channel-cli`): human-driven
   - Web Service (`zryxos-web`): human-driven via REST API
   - AgentScheduler: clock-driven (cron triggers)

### Five Core Capabilities

1. **LLM Integration**: Provider abstraction over Spring AI Alibaba
2. **ReAct Loop**: Self-implemented agent reasoning cycle
3. **Memory System**: Session + MEMORY.md (long-term), three-tier design
4. **Tool System**: Built-in (file/shell/HTTP/memory/notify) + Plugin (MCP/Java @Tool)
5. **Web Service**: 10 REST endpoints for external integration

### Nine Maven Modules

```
zryxos-core          # Core abstractions, ReAct loop, Agent/Profile management, scheduler
zryxos-provider      # LLM provider abstraction
zryxos-memory        # Memory service façade, LongTermMemory, MemoryTools
zryxos-tool          # Built-in tools, MCP client, ToolRegistry, Sandbox, NotifyTools
zryxos-channel-cli   # CLI channel
zryxos-web           # REST API (6 controllers, 10 endpoints)
zryxos-storage       # SQLite persistence, repositories
zryxos-cli           # Picocli entry, 12 commands, ConfigLoader
zryxos-boot          # Spring Boot startup, auto-configuration
```

## Constitutional Principles (Non-negotiable)

1. **JDK 21 + Spring Boot 3.x single-JAR deployment**
2. **Five core capabilities first**: Runtime kernel before governance layer
3. **Self-implemented ReAct loop**: No direct use of Spring AI Agent abstraction
4. **Spring AI usage boundary**: 
   - ✅ USE: Provider abstraction, protocol conversion, @Tool schema generation
   - ❌ NEVER: Automatic tool execution (leads to double invocation)
   - Tool scheduling: 100% controlled by ReActLoop + ToolExecutor
5. **Plugin Tool three-tier access**: Zero-code (AGENT.md + MCP) → Light-code (MCP server) → Heavy-code (@Tool Java Bean)
6. **SQLite + MEMORY.md storage**: Vector search in extended phase; `tool_invocations` and `llm_calls` audit tables written from day one
7. **Every user story must have demo**: Prioritize working over perfect

## Key Design Decisions

### ReAct Loop
- Self-implemented (~dozens of lines Java)
- LLM decides tool usage → OryxOS executes → result feeds back → continues
- MAX_ITERATIONS default: 10 (configurable per Profile)

### Spring AI Integration
**CRITICAL**: Spring AI auto-execution MUST be disabled
- Only use: ChatClient abstraction, protocol conversion, schema generation
- Tool execution: Exclusively via ToolExecutor
- Common mistake: Enabling auto-execution causes tools to run twice

### Provider Mapping
- Explicit provider-name-to-ChatModel mapping (NOT type scanning)
- Multiple providers: Prevents ambiguity when multiple ChatModel beans exist

### Memory Architecture
- **MemoryService façade**: Unified interface hiding SessionManager + LongTermMemory
- **MEMORY.md structure**: Core memory section (never truncated) + Archive section (truncatable)
- **Three backend options** (core phase delivers all three):
  - `MarkdownMemoryStore` (default): Single .zryxos/memory/MEMORY.md file
  - `SqliteMemoryStore`: Structured entries in memory_entries table
  - `Mem0MemoryStore`: Self-hosted Mem0 integration

### Tool System
- **OryxTool abstraction**: Unified interface for all tool types
- **Three plugin tiers**:
  1. Zero-code: AGENT.md directory + reuse MCP servers
  2. Light-code: Write MCP server in any language
  3. Heavy-code: Java @Tool annotated Spring Bean
- **Sandbox**: Interface-first design
  - Core phase: `WhitelistSandbox` (application-layer path/command/domain whitelist)
  - Extended phase: Container isolation → microVM (signal-driven upgrade)

### Agent Definition
- **One Agent = One Directory** (`.zryxos/agents/<name>/`)
- `AGENT.md` frontmatter → Profile derivation (via `AgentLoader.deriveProfile`)
- Body → system prompt injection (via `ContextLoader`)
- Sub-resources: Loaded on-demand via `read_file`/`shell` (progressive disclosure)
- NOT a Tool: Agent directory is context source, not executable tool

### Notification System (NotifyTools)
- **Purpose**: Symmetric outbound channel (complements inbound Channel adapters)
- **NotifyChannelAdapter interface**: `send(NotifyTarget, content)`
- **Core implementation**: `WebhookNotifyAdapter` (generic webhooks for IM platforms)
- **Usage**: `notify` tool, configured via Profile's `notify_channels` field
- Sandbox domain whitelist enforced, audit trail via existing tool_invocations

### Scheduled Tasks (AgentScheduler)
- **Third trigger source**: Clock-driven (cron) alongside human-driven (CLI/Web)
- **Same execution path**: Calls `AgentService.process` like CLI/Web
- **Profile configuration**: `schedules` field in AGENT.md frontmatter
- **Concurrency**: Process-level ReentrantLock (per-task) prevents overlap
- **Session identity**: channel=scheduler, user=scheduler, shared session per Profile
- **State persistence**: Two tables (`scheduled_tasks`, `task_executions`) for management

## File System Structure

```
.zryxos/
├── agents/              # Agent directories (each = one Agent)
│   └── <name>/
│       ├── AGENT.md     # frontmatter (profile) + body (instructions)
│       ├── skills/      # Optional sub-instructions
│       ├── scripts/     # Optional scripts
│       └── REFERENCE.md # Optional reference docs
├── memory/
│   └── MEMORY.md        # Long-term memory (core + archive sections)
├── mcp_servers.yaml     # MCP server configurations
├── sessions/            # Session data (if file-based)
├── logs/                # Structured logs
├── AGENTS.md            # Bootstrap: project-level agent behavior
├── SOUL.md              # Bootstrap: agent personality
├── USER.md              # Bootstrap: user preferences
└── zryxos.db            # SQLite database
```

## Database Schema

### Core Tables

**sessions**
- session_id (PK): channel + user + profile composite
- profile_name, channel, user_id
- messages_json: Serialized conversation history
- status: active / archived
- Timestamps: created_at, last_active_at, archived_at

**tool_invocations** (audit, day-one write)
- id, session_id, tool_name
- input_json, result_json
- success, error_message, duration_ms
- created_at

**llm_calls** (audit, day-one write)
- id, session_id, provider, model
- prompt_tokens, completion_tokens, total_tokens
- duration_ms, created_at

**scheduled_tasks** (scheduler state)
- task_id (PK), profile_name, cron, zone, message
- enabled, next_run_at, last_run_at, last_status, run_count
- updated_at

**task_executions** (scheduler history)
- id (PK), task_id, session_id
- started_at, success, error_message, duration_ms

## Development Guidelines

### When Working on This Project

1. **Read before implementing**: Always check existing code and documents
2. **Follow module boundaries**: Respect the 9-module structure
3. **Constitutional compliance**: Every PR must align with principles above
4. **Test each capability**: Core phase requires working demos for all five capabilities
5. **Audit from day one**: Write to tool_invocations and llm_calls tables immediately

### Common Pitfalls to Avoid

❌ **Enabling Spring AI auto tool execution** → Tools run twice  
❌ **Type-scanning for Provider beans** → Ambiguity with multiple providers  
❌ **Treating Agent directory as Tool** → Should be context source  
❌ **Merging Memory into Session** → Keep MemoryService as separate façade  
❌ **Using SecurityManager** → Deprecated in JDK 17+, removed in JDK 21  
❌ **Splitting Tool module** → Keep as unified `zryxos-tool`  
❌ **Skipping audit table writes** → Must write from core phase  

### Naming Conventions

- **Modules**: `zryxos-<name>` (lowercase)
- **Core interfaces**: `ZryxTool`, `ZryxOsCli` (PascalCase)
- **Commands**: `zryxos <subcommand>` (lowercase)
- **Directories**: `.zryxos/` (lowercase)
- **Database**: `zryxos.db` (lowercase)

## Development Phases

### Core Phase (Current, 4 weeks/12 hours)

**Week 1**: LLM + ReAct
- Maven structure, Provider abstraction, ReAct loop, one HTTP tool, CLI channel

**Week 2**: Memory + Tool
- MEMORY.md, MemoryTools, file/shell tools, Sandbox, MCP client, Agent directory loading

**Week 3**: Web Service
- Spring MVC, 6 controllers, 10 REST endpoints, ConfigLoader

**Week 4**: Multi-agent + Polish
- Multiple Profiles, SQLite persistence, Bootstrap loading, 12 CLI commands, scheduler, project homepage

### Acceptance Demos (Must Pass)

**Demo 1: Daily Weather** (Every morning auto-run)
- Capabilities: LLM + ReAct + HTTP Tool + Scheduler + Notify
- Scenario: Cron trigger → query weather → generate outfit advice → push to IM
- Validation: No manual trigger, all HTTP calls pass Sandbox, audit trail in tool_invocations

**Demo 2: Daily Tech Digest** (Every morning auto-run)
- Capabilities: AGENT.md directory + MCP + Memory + Scheduler + Notify
- Scenario: Business writes AGENT.md + configures MCP → Agent reads sub-instructions via read_file → calls news MCP → considers memory preferences → pushes digest
- Validation: Zero Java code, sub-instruction loaded on-demand, memory influences output

### Extended Phase (Community-driven)

- Multi-channel (WeChat Enterprise, Feishu, DingTalk)
- Provider reliability (fallback, circuit breaker)
- Memory semantic search (vector DB)
- Complete Sandbox (container → microVM)
- Enterprise governance (SSO, multi-tenancy, RBAC, full audit)
- Web dashboard
- Kubernetes operator

## References

### Key Documents (in docs/)

- `01-IndustryResearch.md`: Agent OS landscape, OpenClaw/Hermes analysis, Java ecosystem gap
- `02-DemandAnalysis.md`: Requirements (What), five core capabilities, acceptance criteria
- `03-TechnicalSolution.md`: Technical design (How), architecture, 9 modules, implementation details
- `04-AiProgrammingGuide.md`: Spec-Kit workflow, 5 user stories, implementation rhythm

### Important Concepts

- **Agent OS vs Agent Runtime**: OS manages multiple agents + governance; Runtime executes single agent
- **Profile vs Skill**: Profile = runtime binding (how to run); Skill = task definition (what to do)
- **Three trigger sources**: CLI (human) + Web Service (human) + AgentScheduler (clock)
- **Progressive disclosure**: AGENT.md body loaded upfront, sub-resources loaded on-demand
- **Signal-driven upgrade**: Core delivers basics, extended upgrades based on real needs

## Commands Reference

```bash
# Workspace
zryxos init                      # Initialize .zryxos/ workspace

# Runtime modes
zryxos chat [--profile <name>]   # Interactive CLI
zryxos serve                     # REST API server
zryxos gateway                   # Multi-channel daemon

# Profile management
zryxos profile list
zryxos profile create <name>
zryxos profile show <name>
zryxos profile delete <name>

# Information queries
zryxos status
zryxos provider list
zryxos tool list
zryxos session list
```

## API Endpoints (Core 10)

### Session Management (4)
- `POST /api/v1/sessions` - Create session
- `POST /api/v1/sessions/{id}/messages` - Send message
- `GET /api/v1/sessions/{id}` - Query history
- `DELETE /api/v1/sessions/{id}` - Archive session

### Agent Invocation (1)
- `POST /api/v1/agents/{name}/invoke` - Stateless call

### Information Queries (3)
- `GET /api/v1/profiles` - List profiles
- `GET /api/v1/memory` - Query long-term memory
- `GET /api/v1/tools` - List available tools

### System Status (2)
- `GET /api/v1/health` - Health check
- `GET /api/v1/info` - Runtime info

## Contributing

When contributing to ZryxOS:

1. **Understand the architecture**: Read all four documents in docs/
2. **Respect constitutional principles**: Non-negotiable design decisions
3. **Follow module boundaries**: Don't mix concerns across modules
4. **Write tests**: Each feature needs end-to-end test
5. **Document changes**: Update relevant docs/ files
6. **Maintain naming consistency**: All Zryx-related names must align

## License & Credits

- Project: ZryxOS
- Repository: https://github.com/XianReallyHot-ZZH/ZryxOS
- Author: XianReallyHot-ZZH
- License: (To be specified)
- AI Assistant: Claude Opus 4.8

---

*This guide is generated from comprehensive project documentation. For detailed information, refer to the four documents in the `docs/` directory.*
