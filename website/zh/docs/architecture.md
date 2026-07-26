---
title: 系统架构
description: ZryxOS 五层架构 — 从触发源到存储层,理解完整的系统设计。
outline: deep
---

# 系统架构

ZryxOS 采用清晰的五层架构,从触发源一直到存储层。

![ZryxOS 架构](/architecture.svg)

## 五层架构总览

### 1. Channel / Trigger 层

三种触发源：

- **CLI** — 人推,交互式命令行对话
- **REST API** — 人推,HTTP 集成供企业系统调用
- **Scheduler** — 钟推,基于 cron 的定时执行

三种触发源统一汇入 `AgentService.process()`,确保执行路径一致。

### 2. Agent 层

一个 Agent = 一个目录 (`.zryxos/agents/<name>/`):

- `AGENT.md` — frontmatter 定义 Profile,正文定义任务指令
- 可选: `skills/*.md`、`scripts/`、`REFERENCE.md`

由 `AgentLoader` 加载 → 派生 Profile → 注册到 `ProfileRegistry`。

### 3. Engine 层

**ReActLoop** — 自实现推理循环（不封装外部框架）:

1. LLM 决定是否调用工具以及调用哪些工具
2. `ToolExecutor` 执行并进行 Sandbox 校验
3. 结果回填给 LLM
4. 循环继续直到最终响应或达到最大迭代次数

**PromptBuilder** — 组装系统提示词:
- Bootstrap (AGENTS.md, SOUL.md, USER.md)
- Memory 上下文
- 对话历史
- 可用工具

**AgentService** — 所有三种触发源的统一入口点。

**AgentScheduler** — 第三触发源,基于 cron 的时钟推送。

### 4. Capability 层

**Provider** (LLM 集成):
- Spring AI Alibaba 抽象
- 显式 provider-name → ChatModel 映射（非类型扫描）
- 多 Provider 并存

**Memory**:
- `MemoryService` 门面 — 隐藏 SessionManager + LongTermMemory
- 会话记忆（当前对话）
- 长期记忆（MEMORY.md: 核心 + 归档区）
- 三种后端选项: Markdown / SQLite / Mem0

**Tool**:
- `ZryxTool` 抽象 — 所有工具类型的统一接口
- 内置: file、shell、HTTP、memory、notify
- 插件集成: MCP client + Java `@Tool` beans
- `Sandbox` — 应用层白名单（路径/命令/域名）

**Notify**:
- 出站推送能力（与入站 Channel 对称）
- `NotifyChannelAdapter` 接口
- 核心实现: `WebhookNotifyAdapter`

### 5. Storage 层

**SQLite**:
- `sessions` — 会话元数据和消息历史
- `tool_invocations` — 审计轨迹（从第一天写入）
- `llm_calls` — 审计轨迹（从第一天写入）
- `scheduled_tasks` — 调度器状态
- `task_executions` — 调度器历史

**文件系统**:
- `.zryxos/agents/` — Agent 目录
- `.zryxos/memory/MEMORY.md` — 长期记忆
- `.zryxos/profiles/` — Profile 配置（从 AGENT.md 派生）

## 关键设计决策

### ReAct 循环: 自实现

不封装 Spring AI Agent 抽象。LLM 决定工具使用 → ZryxOS 执行 → 结果回填 → 继续。最大迭代次数默认: 10（可在 Profile 中配置）。

**关键:** 必须禁用 Spring AI 自动执行。仅使用: ChatClient 抽象、协议转换、schema 生成。工具执行 100% 由 ToolExecutor 控制。

### Provider 映射: 显式

显式 provider-name → ChatModel 映射（非类型扫描）。防止多个 Provider 共存时产生歧义。

### Memory 架构: 三层

- **会话记忆** — 由 SessionManager 管理,存储在 `sessions.messages_json`
- **长期记忆** — MEMORY.md 文件,两个区域（核心永不截断,归档可截断）
- **情景记忆** — 计划在扩展阶段实现

**MemoryService 门面** — 统一接口隐藏 SessionManager + LongTermMemory。

### 工具体系: 三档插件

1. **零代码** — AGENT.md 目录 + 复用 MCP 服务器
2. **轻代码** — 用任意语言编写 MCP 服务器
3. **重代码** — Java `@Tool` 注解的 Spring Bean

### Agent 定义: 基于目录

一个 Agent = 一个目录。`AGENT.md` frontmatter → Profile 派生。正文 → 系统提示词注入。子资源（skills、scripts）通过工具按需加载（渐进式披露）。

**不是 Tool** — Agent 目录是上下文来源,不是可执行工具。

### 调度器: 第三触发源

时钟触发执行,与人工触发（CLI/REST）并列。调用相同的 `AgentService.process()`。进程级 ReentrantLock 防止每个任务重叠运行。

### 通知系统: 对称出站

用出站推送补充入站 Channel。`NotifyChannelAdapter` 接口,核心实现: `WebhookNotifyAdapter`。域名白名单由 Sandbox 强制执行,通过现有 `tool_invocations` 表审计。

## 模块结构（9 个 Maven 模块）

```
zryxos-core          # 核心抽象、ReAct 循环、Agent/Profile 管理、调度器
zryxos-provider      # LLM provider 抽象
zryxos-memory        # Memory service 门面、LongTermMemory、MemoryTools
zryxos-tool          # 内置工具、MCP client、ToolRegistry、Sandbox、NotifyTools
zryxos-channel-cli   # CLI 渠道
zryxos-web           # REST API（6 个 controller,10 个端点）
zryxos-storage       # SQLite 持久化、repositories
zryxos-cli           # Picocli 入口、12 个命令、ConfigLoader
zryxos-boot          # Spring Boot 启动、自动配置
```

## 执行流程

**CLI 触发:**
```
用户在 CLI 输入 → CliChannel.sendMessage()
  → AgentService.process(profile, message, sessionId)
    → PromptBuilder.build(session + memory + tools)
      → ReActLoop.execute(prompt)
        → LLM 决定工具调用
          → ToolExecutor.execute(toolName, args) [带 Sandbox 检查]
            → Tool 实现 (file/shell/http/...)
              → 结果写入 tool_invocations 审计表
            → 结果回填给 LLM
          → 循环继续或返回最终响应
        → 响应写入 sessions.messages_json
      → 响应返回到 CLI
```

**REST API 触发:**
```
HTTP POST /api/v1/sessions/{id}/messages
  → SessionController.sendMessage()
    → AgentService.process() [与 CLI 相同路径]
      → [同上]
    → JSON 响应
```

**调度器触发:**
```
AgentScheduler.tick() [cron 匹配]
  → 检查 ReentrantLock（防止重叠）
    → AgentService.process(profile, scheduledMessage, schedulerSessionId)
      → [相同执行路径]
        → 如果配置了 notify_channels:
          → NotifyTools.notify(channel, result)
            → WebhookNotifyAdapter.send(url, payload)
              → Sandbox 强制执行域名白名单
              → 在 tool_invocations 表中审计
      → 执行记录到 task_executions 表
```

## 状态性

**无状态运行实例** — 所有状态外置到 SQLite 和文件系统。可以运行多个实例（未来负载均衡）,每个从共享存储读取。

**有状态组件:**
- 会话（SQLite `sessions` 表）
- 记忆（MEMORY.md 文件 + SQLite 可选后端）
- 调度器状态（`scheduled_tasks`、`task_executions` 表）

此设计支持在阶段二平滑过渡到分布式模式。

## 安全模型

**Sandbox** — 应用层强制执行（非 JDK SecurityManager,JDK 21 已移除）:

- 文件工具: 路径白名单
- Shell 工具: 命令白名单
- HTTP 工具: 域名白名单
- NotifyTools: 域名白名单

**审计轨迹** — 从第一天起:
- `tool_invocations` — 记录每次工具调用
- `llm_calls` — 记录每次 LLM 请求（token、耗时、provider）

**凭证管理** — 环境变量（从不硬编码）。企业集成通过 vault（计划在治理阶段实现）。

*动手示例请参阅 [快速开始](/zh/docs/quick-start)。详细能力分解请参阅 [五大核心能力](/zh/docs/capabilities)。*
