---
title: 路线图
description: ZryxOS 开发路线图 — 从单机运行时到分布式 Agent 协作。
outline: deep
---

# 路线图

我们的开发理念是：**慢就是快，聚焦且克制**。首先，把单机运行时内核做扎实——让在一个节点上运行和管理一群 Agent 真正可用，被真实团队使用。然后在此基础上生长出分布式能力。

## 阶段一：单机运行时内核（当前）

**时间线:** 4 周 / 12 小时  
**目标:** 交付可工作的 Agent OS 运行时核心

### 交付物

✅ **LLM 集成**
- Spring AI Alibaba provider 抽象
- 多 Provider 支持（DeepSeek、Qwen、Kimi、OpenAI）
- 显式 provider-name 映射

✅ **ReAct 循环**
- 自实现推理循环
- 工具编排完全可控
- 可配置最大迭代次数

✅ **记忆系统**
- 会话记忆（SQLite）
- 长期记忆（MEMORY.md）
- 三种后端选项（Markdown / SQLite / Mem0）

✅ **工具框架**
- 内置工具（file、shell、HTTP、memory、notify）
- MCP client 集成
- Java `@Tool` 插件支持
- 应用层 Sandbox

✅ **对外服务**
- 10 个 REST API 端点
- 会话管理
- 无状态调用
- OpenAPI 规范

✅ **Agent 调度器**
- 基于 cron 的定时执行
- 第三触发源（与 CLI 和 REST 并列）
- Notify 集成

### 验收 Demo

**Demo 1: 每日天气助手**
- 定时执行（cron）
- HTTP 工具调用天气 API
- 结果通知到 webhook
- 完整审计轨迹

**Demo 2: 每日科技日报**
- AGENT.md 目录
- MCP 集成（零 Java 代码）
- 记忆影响输出
- 定时生成报告

### 状态

**已完成:**
- Maven 项目结构 ✓
- 核心架构设计 ✓
- 文档框架 ✓
- 项目网站（进行中）

**进行中:**
- 五大核心能力实现
- 验收 demo 准备

**下一步:**
- 生产打包
- 部署文档

## 阶段二：底座分布式（规划）

**目标:** 扩展到更大部署规模，实现高可用

### 目标

- **无状态节点** — 所有状态外置到 SQLite 和文件系统
- **多副本部署** — 多个 ZryxOS 实例共享状态
- **负载均衡** — 会话亲和性路由
- **健康监控** — 存活/就绪探针
- **配置管理** — 集中式配置存储

### 技术方案

- 共享 SQLite（或迁移到 PostgreSQL 支持分布式写入）
- 分布式文件系统用于 `.zryxos/`（NFS、S3-backed）
- 会话粘性路由（按 session_id 哈希）
- Kubernetes 原生部署

**触发条件:**
- 真实用户反馈需要超越单节点规模
- 测量到的瓶颈证明分布式模式必要
- 社区贡献显示需求

## 阶段三：跨节点 Agent 协作（愿景）

**目标:** 让不同节点上的 Agent 可以发现、委托和协同

### 目标

- **Agent 发现** — 跨节点可见的注册表
- **Agent 消息传递** — 可靠的异步消息投递
- **A2A 协议集成** — 标准的 Agent 间通信
- **分布式记忆** — 跨节点的共享记忆

### 技术方案

- 集成 Agent 消息传递底座（如 mq9）
- 实现 A2A 协议支持
- 跨节点记忆复制
- 分布式调度器协调

**触发条件:**
- 阶段二在生产环境广泛采用
- 真实用例需要跨节点 Agent 工作流
- 社区成熟度和贡献者基础

## 横向能力（渐进）

在所有阶段逐步添加的特性：

### 安全与治理
- 多租户（命名空间隔离）
- 企业 SSO（OIDC、SAML）
- RBAC（基于角色的访问控制）
- 完整审计日志（导出、轮转）
- 工具策略引擎（批准/拒绝/限流）

### 开发者体验
- Web 管理界面
- Profile 编辑器
- 记忆浏览器
- 审计日志查看器
- 实时会话监控

### 可观测性
- 指标（Prometheus）
- 追踪（OpenTelemetry）
- 结构化日志
- Grafana 仪表板

### 生态系统
- Kubernetes operator
- Helm charts
- Docker 镜像
- CI/CD 示例
- 插件市场

## 长期愿景

**走进 Apache 软件基金会**

ZryxOS 旨在成为 Apache 顶级项目，为全球社区提供参考的 Java 原生 Agent OS。

**里程碑:**
1. 经过验证的生产采用（阶段一完成，用户在生产环境使用）
2. 活跃的贡献者社区（10+ 常规贡献者）
3. 成熟的治理模型（提交者流程、发布节奏）
4. Apache 孵化器提案
5. 毕业为顶级项目

## 贡献

ZryxOS 在所有阶段都接受贡献。

**当前优先级:**
- 阶段一核心能力实现
- 验收 demo 开发
- 文档和示例
- Bug 报告和测试

**未来优先级:**
- 分布式模式设计
- 生态系统集成
- 插件开发

参见 [GitHub Issues](https://github.com/XianReallyHot-ZZH/ZryxOS/issues) 了解当前任务。

---

*当前状态请参阅 [ZryxOS 是什么](/zh/docs/what)。快速上手请参阅 [快速开始](/zh/docs/quick-start)。*
