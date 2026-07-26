---
title: Roadmap
description: ZryxOS development roadmap — from single-node runtime to distributed agent coordination.
outline: deep
---

# Roadmap

Our development philosophy: **slow is fast, focused and restrained**. First, solidify the single-node runtime kernel — make running and managing a fleet of agents on one node truly usable and used by real teams. Then grow distributed capabilities on top of that foundation.

## Phase 1: Single-Node Runtime Kernel (Current)

**Timeline:** 4 weeks / 12 hours  
**Goal:** Deliver a working Agent OS runtime core

### Deliverables

✅ **LLM Integration**
- Spring AI Alibaba provider abstraction
- Multi-provider support (DeepSeek, Qwen, Kimi, OpenAI)
- Explicit provider-name mapping

✅ **ReAct Loop**
- Self-implemented reasoning loop
- Tool orchestration under full control
- Configurable max iterations

✅ **Memory System**
- Session memory (SQLite)
- Long-term memory (MEMORY.md)
- Three backend options (Markdown / SQLite / Mem0)

✅ **Tool Framework**
- Built-in tools (file, shell, HTTP, memory, notify)
- MCP client integration
- Java `@Tool` plugin support
- Application-layer Sandbox

✅ **Web Service**
- 10 REST API endpoints
- Session management
- Stateless invocation
- OpenAPI spec

✅ **Agent Scheduler**
- Cron-based scheduled execution
- Third trigger source (alongside CLI and REST)
- Notify integration

### Acceptance Demos

**Demo 1: Daily Weather Assistant**
- Scheduled execution (cron)
- HTTP tool for weather API
- Notify results to webhook
- Full audit trail

**Demo 2: Daily Tech Digest**
- AGENT.md directory
- MCP integration (zero Java code)
- Memory influence
- Scheduled report generation

### Status

**Completed:**
- Maven project structure ✓
- Core architecture design ✓
- Documentation framework ✓
- Project website (in progress)

**In Progress:**
- Five core capabilities implementation
- Acceptance demo preparation

**Next:**
- Production packaging
- Deployment documentation

## Phase 2: Distributed Runtime Foundation (Planned)

**Goal:** Scale to larger deployments, enable high availability

### Objectives

- **Stateless Nodes** — All state externalized to SQLite and filesystem
- **Multi-Replica Deployment** — Multiple ZryxOS instances sharing state
- **Load Balancing** — Session affinity routing
- **Health Monitoring** — Liveness/readiness probes
- **Configuration Management** — Centralized config store

### Technical Approach

- Shared SQLite (or migrate to PostgreSQL for distributed writes)
- Distributed file system for `.zryxos/` (NFS, S3-backed)
- Session sticky routing (by session_id hash)
- Kubernetes-native deployment

**Triggers for Phase 2:**
- Real user feedback requesting scale beyond single node
- Measured bottlenecks proving distributed mode necessary
- Community contributions showing demand

## Phase 3: Cross-Node Agent Collaboration (Vision)

**Goal:** Enable agents on different nodes to discover, delegate, and coordinate

### Objectives

- **Agent Discovery** — Registry visible across nodes
- **Agent Messaging** — Reliable async message delivery
- **A2A Protocol Integration** — Standard agent-to-agent communication
- **Distributed Memory** — Shared memory across nodes

### Technical Approach

- Integrate agent messaging substrate (e.g., mq9)
- Implement A2A protocol support
- Cross-node memory replication
- Distributed scheduler coordination

**Triggers for Phase 3:**
- Phase 2 widely adopted in production
- Real use cases requiring cross-node agent workflows
- Community maturity and contributor base

## Horizontal Capabilities (Gradual)

Features added incrementally across all phases:

### Security & Governance
- Multi-tenancy (namespace isolation)
- Enterprise SSO (OIDC, SAML)
- RBAC (role-based access control)
- Complete audit log (export, rotation)
- Tool policy engine (approve/deny/throttle)

### Developer Experience
- Web management UI
- Profile editor
- Memory browser
- Audit log viewer
- Real-time session monitor

### Observability
- Metrics (Prometheus)
- Tracing (OpenTelemetry)
- Structured logging
- Grafana dashboards

### Ecosystem
- Kubernetes operator
- Helm charts
- Docker images
- CI/CD examples
- Plugin marketplace

## Long-Term Vision

**Join the Apache Software Foundation**

ZryxOS aims to become an Apache Top-Level Project, serving the global community as the reference Java-native Agent OS.

**Milestones:**
1. Proven production adoption (Phase 1 complete, users in production)
2. Active contributor community (10+ regular contributors)
3. Mature governance model (committer process, release cadence)
4. Apache Incubator proposal
5. Graduation to Top-Level Project

## Contributing

ZryxOS is open for contributions at all phases.

**Current Priorities:**
- Phase 1 core capabilities implementation
- Acceptance demo development
- Documentation and examples
- Bug reports and testing

**Future Priorities:**
- Distributed mode design
- Ecosystem integrations
- Plugin development

See [GitHub Issues](https://github.com/XianReallyHot-ZZH/ZryxOS/issues) for current tasks.

---

*For current status, see [What is ZryxOS](/docs/what). To get started, see [Quick Start](/docs/quick-start).*
