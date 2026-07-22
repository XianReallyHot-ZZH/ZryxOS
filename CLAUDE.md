# ZryxOS AI 助手项目指南

## 项目概述

ZryxOS 是基于 Java 实现的面向企业场景的 Agent OS（智能体操作系统）。它作为统一平台部署在企业自有基础设施（K8s 或服务器）上，运行多个业务 Agent，共享渠道接入、模型路由、工具调用、记忆系统、沙箱执行等能力。

### 核心定位

- **技术栈**: Java 21 + Spring Boot 3.x + Spring AI Alibaba
- **部署模式**: 单 JAR 文件，自托管，无云厂商锁定
- **目标用户**: 需要私有、可审计、可控的 Agent 基础设施的企业
- **差异化**: 首个 Java 原生 Agent OS，填补 Java 生态在 Node.js (OpenClaw) 和 Python (Hermes Agent) 之外的空白

### 项目状态

**当前阶段**: 核心开发（4 周，共 12 小时）
- 目标: 交付 Agent OS 运行时内核
- 范围: 五大核心能力可运行
- 后续: 扩展功能和企业治理层由社区共建

## 架构总览

### 核心分层（自底向上）

1. **存储层** (`zryxos-storage`)
   - SQLite: sessions, tool_invocations, llm_calls, scheduled_tasks, task_executions
   - 文件系统: .zryxos/ 目录（profiles、MEMORY.md、skills、agents）

2. **能力层**
   - **Provider** (`zryxos-provider`): LLM 抽象，显式 provider-name 到 ChatModel 映射
   - **Memory** (`zryxos-memory`): 三层（会话 + 长期 MEMORY.md + 情景），MemoryService 统一门面
   - **Tool** (`zryxos-tool`): 内置工具 + MCP 集成 + Sandbox + NotifyTools
   - **Notify**: 出站推送能力（WebhookNotifyAdapter）

3. **引擎层** (`zryxos-core`)
   - **ReActLoop**: 自实现 Reason+Act 循环（最大 10 次迭代）
   - **PromptBuilder**: 组装 system prompt + bootstrap + memory + history + tools
   - **ToolExecutor**: Sandbox 检查 + 审计写入
   - **AgentService**: 三种触发源的统一入口
   - **AgentScheduler**: 第三触发源（基于 cron 的钟推）

4. **Agent 层**
   - 一个 Agent = 一个目录（`.zryxos/agents/<name>/`）
   - `AGENT.md`: frontmatter（profile）+ 正文（任务指令）
   - 可选: `skills/*.md`（子指令）、`scripts/`、`REFERENCE.md`
   - 由 `AgentLoader` 加载 → 派生 Profile → 注册到 ProfileRegistry

5. **Channel/触发层**
   - CLI Channel (`zryxos-channel-cli`): 人推
   - Web Service (`zryxos-web`): 通过 REST API 人推
   - AgentScheduler: 钟推（cron 触发）

### 五大核心能力

1. **LLM 集成**: 基于 Spring AI Alibaba 的 Provider 抽象
2. **ReAct 循环**: 自实现的智能体推理循环
3. **Memory 系统**: 会话 + MEMORY.md（长期），三层设计
4. **Tool 体系**: 内置（file/shell/HTTP/memory/notify）+ 插件（MCP/Java @Tool）
5. **Web Service**: 10 个 REST 端点供外部集成

### 九个 Maven 模块

```
zryxos-core          # 核心抽象、ReAct 循环、Agent/Profile 管理、调度器
zryxos-provider      # LLM provider 抽象
zryxos-memory        # Memory service 门面、LongTermMemory、MemoryTools
zryxos-tool          # 内置工具、MCP client、ToolRegistry、Sandbox、NotifyTools
zryxos-channel-cli   # CLI 渠道
zryxos-web           # REST API（6 个 controller，10 个端点）
zryxos-storage       # SQLite 持久化、repositories
zryxos-cli           # Picocli 入口、12 个命令、ConfigLoader
zryxos-boot          # Spring Boot 启动、自动配置
```

## 宪法原则（非协商）

1. **JDK 21 + Spring Boot 3.x 单 JAR 部署**
2. **五大核心能力优先**: 先做运行时内核，后做治理层
3. **自实现 ReAct 循环**: 不直接使用 Spring AI Agent 抽象
4. **Spring AI 使用边界**: 
   - ✅ 使用: Provider 抽象、协议转换、@Tool schema 生成
   - ❌ 禁止: 自动工具执行（会导致工具被调用两次）
   - 工具调度: 100% 由 ReActLoop + ToolExecutor 控制
5. **Plugin Tool 三档接入**: 零代码（AGENT.md + MCP）→ 轻代码（MCP server）→ 重代码（@Tool Java Bean）
6. **SQLite + MEMORY.md 存储**: 向量检索放扩展阶段；`tool_invocations` 和 `llm_calls` 审计表从第一天就写入
7. **每个 user story 必须有 demo**: 优先跑通而非完美

## 关键设计决策

### ReAct 循环
- 自实现（约数十行 Java）
- LLM 决定工具使用 → ZryxOS 执行 → 结果回填 → 继续
- MAX_ITERATIONS 默认: 10（可在 Profile 中配置）

### Spring AI 集成
**关键**: Spring AI 自动执行必须禁用
- 仅使用: ChatClient 抽象、协议转换、schema 生成
- 工具执行: 完全通过 ToolExecutor
- 常见错误: 启用自动执行导致工具运行两次

### Provider 映射
- 显式 provider-name 到 ChatModel 映射（非类型扫描）
- 多 provider: 防止多个 ChatModel bean 存在时的歧义

### Memory 架构
- **MemoryService 门面**: 统一接口隐藏 SessionManager + LongTermMemory
- **MEMORY.md 结构**: 核心记忆区（永不截断）+ 归档记忆区（可截断）
- **三种后端选项**（核心阶段交付全部三种）:
  - `MarkdownMemoryStore`（默认）: 单个 .zryxos/memory/MEMORY.md 文件
  - `SqliteMemoryStore`: memory_entries 表中的结构化条目
  - `Mem0MemoryStore`: 自托管 Mem0 集成

### Tool 体系
- **ZryxTool 抽象**: 所有工具类型的统一接口
- **三档插件**:
  1. 零代码: AGENT.md 目录 + 复用 MCP server
  2. 轻代码: 用任意语言编写 MCP server
  3. 重代码: Java @Tool 注解的 Spring Bean
- **Sandbox**: 接口优先设计
  - 核心阶段: `WhitelistSandbox`（应用层路径/命令/域名白名单）
  - 扩展阶段: 容器隔离 → microVM（信号驱动升级）

### Agent 定义
- **一个 Agent = 一个目录**（`.zryxos/agents/<name>/`）
- `AGENT.md` frontmatter → Profile 派生（通过 `AgentLoader.deriveProfile`）
- 正文 → system prompt 注入（通过 `ContextLoader`）
- 子资源: 通过 `read_file`/`shell` 按需加载（渐进式披露）
- 不是 Tool: Agent 目录是上下文来源，不是可执行工具

### 通知系统（NotifyTools）
- **用途**: 对称的出站渠道（补充入站 Channel 适配器）
- **NotifyChannelAdapter 接口**: `send(NotifyTarget, content)`
- **核心实现**: `WebhookNotifyAdapter`（IM 平台的通用 webhook）
- **使用**: `notify` 工具，通过 Profile 的 `notify_channels` 字段配置
- Sandbox 域名白名单强制执行，通过现有 tool_invocations 审计

### 定时任务（AgentScheduler）
- **第三触发源**: 钟推（cron），与人推（CLI/Web）并列
- **相同执行路径**: 像 CLI/Web 一样调用 `AgentService.process`
- **Profile 配置**: AGENT.md frontmatter 中的 `schedules` 字段
- **并发控制**: 进程级 ReentrantLock（每任务）防止重叠
- **Session 标识**: channel=scheduler, user=scheduler，每个 Profile 共享 session
- **状态持久化**: 两张表（`scheduled_tasks`, `task_executions`）用于管理

## 文件系统结构

```
.zryxos/
├── agents/              # Agent 目录（每个 = 一个 Agent）
│   └── <name>/
│       ├── AGENT.md     # frontmatter（profile）+ 正文（指令）
│       ├── skills/      # 可选子指令
│       ├── scripts/     # 可选脚本
│       └── REFERENCE.md # 可选参考文档
├── memory/
│   └── MEMORY.md        # 长期记忆（核心 + 归档区）
├── mcp_servers.yaml     # MCP server 配置
├── sessions/            # Session 数据（如果基于文件）
├── logs/                # 结构化日志
├── AGENTS.md            # Bootstrap: 项目级 agent 行为
├── SOUL.md              # Bootstrap: agent 人格
├── USER.md              # Bootstrap: 用户偏好
└── zryxos.db            # SQLite 数据库
```

## 数据库 Schema

### 核心表

**sessions**
- session_id (PK): channel + user + profile 组合
- profile_name, channel, user_id
- messages_json: 序列化的对话历史
- status: active / archived
- 时间戳: created_at, last_active_at, archived_at

**tool_invocations**（审计，第一天写入）
- id, session_id, tool_name
- input_json, result_json
- success, error_message, duration_ms
- created_at

**llm_calls**（审计，第一天写入）
- id, session_id, provider, model
- prompt_tokens, completion_tokens, total_tokens
- duration_ms, created_at

**scheduled_tasks**（调度器状态）
- task_id (PK), profile_name, cron, zone, message
- enabled, next_run_at, last_run_at, last_status, run_count
- updated_at

**task_executions**（调度器历史）
- id (PK), task_id, session_id
- started_at, success, error_message, duration_ms

## 开发指南

### 开发本项目时

1. **实现前先阅读**: 始终检查现有代码和文档
2. **遵循模块边界**: 尊重 9 模块结构
3. **宪法合规**: 每个 PR 必须符合上述原则
4. **测试每个能力**: 核心阶段要求所有五大能力都有可工作的 demo
5. **第一天就审计**: 立即写入 tool_invocations 和 llm_calls 表

### 常见陷阱（避免）

❌ **启用 Spring AI 自动工具执行** → 工具运行两次  
❌ **类型扫描 Provider beans** → 多 provider 时产生歧义  
❌ **将 Agent 目录当作 Tool** → 应该是上下文来源  
❌ **将 Memory 合并到 Session** → 保持 MemoryService 为独立门面  
❌ **使用 SecurityManager** → JDK 17+ 已废弃，JDK 21 已移除  
❌ **拆分 Tool 模块** → 保持为统一的 `zryxos-tool`  
❌ **跳过审计表写入** → 必须从核心阶段开始写  

### 命名规范

- **模块**: `zryxos-<name>`（小写）
- **核心接口**: `ZryxTool`, `ZryxOsCli`（大驼峰）
- **命令**: `zryxos <subcommand>`（小写）
- **目录**: `.zryxos/`（小写）
- **数据库**: `zryxos.db`（小写）

## 开发阶段

### 核心阶段（当前，4 周/12 小时）

**第 1 周**: LLM + ReAct
- Maven 结构、Provider 抽象、ReAct 循环、一个 HTTP 工具、CLI 渠道

**第 2 周**: Memory + Tool
- MEMORY.md、MemoryTools、file/shell 工具、Sandbox、MCP client、Agent 目录加载

**第 3 周**: Web Service
- Spring MVC、6 个 controller、10 个 REST 端点、ConfigLoader

**第 4 周**: 多 agent + 完善
- 多个 Profile、SQLite 持久化、Bootstrap 加载、12 个 CLI 命令、调度器、项目主页

### 验收 Demo（必须通过）

**Demo 1: 每日天气**（每天早上自动运行）
- 能力: LLM + ReAct + HTTP Tool + Scheduler + Notify
- 场景: Cron 触发 → 查询天气 → 生成穿搭建议 → 推送到 IM
- 验证: 无需手动触发，所有 HTTP 调用通过 Sandbox，tool_invocations 中有审计记录

**Demo 2: 每日科技日报**（每天早上自动运行）
- 能力: AGENT.md 目录 + MCP + Memory + Scheduler + Notify
- 场景: 业务方写 AGENT.md + 配置 MCP → Agent 通过 read_file 读子指令 → 调用新闻 MCP → 考虑记忆偏好 → 推送日报
- 验证: 零 Java 代码，子指令按需加载，记忆影响输出

### 扩展阶段（社区驱动）

- 多渠道（企业微信、飞书、钉钉）
- Provider 可靠性（fallback、circuit breaker）
- Memory 语义检索（向量数据库）
- 完整 Sandbox（容器 → microVM）
- 企业治理（SSO、多租户、RBAC、完整审计）
- Web 仪表板
- Kubernetes operator

## 参考文档

### 关键文档（在 docs/ 中）

- `01-IndustryResearch.md`: Agent OS 格局、OpenClaw/Hermes 分析、Java 生态空白
- `02-DemandAnalysis.md`: 需求（What），五大核心能力，验收标准
- `03-TechnicalSolution.md`: 技术设计（How），架构、9 模块、实现细节
- `04-AiProgrammingGuide.md`: Spec-Kit 工作流、5 个 user story、实施节奏

### 重要概念

- **Agent OS vs Agent Runtime**: OS 管理多个 agent + 治理；Runtime 执行单个 agent
- **Profile vs Skill**: Profile = 运行时绑定（怎么跑）；Skill = 任务定义（做什么）
- **三种触发源**: CLI（人推）+ Web Service（人推）+ AgentScheduler（钟推）
- **渐进式披露**: AGENT.md 正文预先加载，子资源按需加载
- **信号驱动升级**: 核心交付基础，扩展根据实际需求升级

## 命令参考

```bash
# 工作区
zryxos init                      # 初始化 .zryxos/ 工作区

# 运行模式
zryxos chat [--profile <name>]   # 交互式 CLI
zryxos serve                     # REST API 服务器
zryxos gateway                   # 多渠道守护进程

# Profile 管理
zryxos profile list
zryxos profile create <name>
zryxos profile show <name>
zryxos profile delete <name>

# 信息查询
zryxos status
zryxos provider list
zryxos tool list
zryxos session list
```

## API 端点（核心 10 个）

### 会话管理（4 个）
- `POST /api/v1/sessions` - 创建会话
- `POST /api/v1/sessions/{id}/messages` - 发送消息
- `GET /api/v1/sessions/{id}` - 查询历史
- `DELETE /api/v1/sessions/{id}` - 归档会话

### Agent 调用（1 个）
- `POST /api/v1/agents/{name}/invoke` - 无状态调用

### 信息查询（3 个）
- `GET /api/v1/profiles` - 列出 profiles
- `GET /api/v1/memory` - 查询长期记忆
- `GET /api/v1/tools` - 列出可用工具

### 系统状态（2 个）
- `GET /api/v1/health` - 健康检查
- `GET /api/v1/info` - 运行时信息

## 贡献指南

为 ZryxOS 贡献时：

1. **理解架构**: 阅读 docs/ 中的全部四份文档
2. **尊重宪法原则**: 非协商的设计决策
3. **遵循模块边界**: 不要跨模块混合职责
4. **编写测试**: 每个特性需要端到端测试
5. **更新文档**: 更新相关 docs/ 文件
6. **保持命名一致性**: 所有 Zryx 相关命名必须对齐

## 许可与致谢

- 项目: ZryxOS
- 仓库: https://github.com/XianReallyHot-ZZH/ZryxOS
- 作者: XianReallyHot-ZZH
- 许可: （待指定）
- AI 助手: Claude Opus 4.8

---

*本指南基于完整的项目文档生成。详细信息请参考 `docs/` 目录中的四份文档。*
