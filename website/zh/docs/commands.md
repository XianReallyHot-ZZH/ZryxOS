---
title: CLI 命令
description: 全部 12 个 ZryxOS CLI 命令的完整参考。
outline: deep
---

# CLI 命令

ZryxOS 提供 12 个核心命令，涵盖初始化、运行时、Profile 管理和状态查询。

## 工作区管理

### zryxos init

在当前目录初始化 `.zryxos/` 工作区。

```bash
java -jar zryxos.jar init
```

创建:
- `.zryxos/profiles/default.yaml`
- `.zryxos/memory/MEMORY.md`
- `.zryxos/mcp_servers.yaml`（可选）

### zryxos status

显示运行时状态和配置。

```bash
java -jar zryxos.jar status
```

输出:
- 当前 profiles
- 活动会话
- 已配置的 providers
- 已注册的工具

## 运行模式

### zryxos chat

交互式 CLI 对话模式。

```bash
java -jar zryxos.jar chat [--profile <name>]
```

选项:
- `--profile` — Profile 名称（默认: `default`）

### zryxos serve

启动 HTTP API 服务。

```bash
java -jar zryxos.jar serve [--port <port>]
```

选项:
- `--port` — HTTP 端口（默认: `8080`）

### zryxos gateway

多渠道守护进程（包含调度器）。

```bash
java -jar zryxos.jar gateway
```

启用:
- REST API
- 定时任务
- 多个渠道适配器

## Profile 管理

### zryxos profile list

列出所有 profiles。

```bash
java -jar zryxos.jar profile list
```

### zryxos profile create

创建新 profile。

```bash
java -jar zryxos.jar profile create <name>
```

从模板创建 `.zryxos/profiles/<name>.yaml`。

### zryxos profile show

显示 profile 详情。

```bash
java -jar zryxos.jar profile show <name>
```

### zryxos profile delete

删除 profile。

```bash
java -jar zryxos.jar profile delete <name>
```

## 信息查询

### zryxos provider list

列出已配置的 providers。

```bash
java -jar zryxos.jar provider list
```

输出:
- Provider 名称
- 模型
- 状态（已配置/活动）

### zryxos tool list

列出已注册的工具。

```bash
java -jar zryxos.jar tool list
```

输出:
- 工具名称
- 类型（内置/MCP/Java）
- 描述

### zryxos session list

列出会话历史。

```bash
java -jar zryxos.jar session list [--active]
```

选项:
- `--active` — 仅显示活动会话

---

*使用示例请参阅 [快速开始](/zh/docs/quick-start)。REST API 请参阅 [REST API](/zh/docs/api)。*
