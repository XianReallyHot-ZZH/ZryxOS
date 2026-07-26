---
title: 快速开始
description: 5 分钟启动 ZryxOS。构建、初始化、配置并启动你的第一个 Agent。
outline: deep
---

# 快速开始

5 分钟启动 ZryxOS。

## 前置要求

- **JDK 21+** ([下载](https://adoptium.net/))
- **Maven 3.8+**
- **Git**

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/XianReallyHot-ZZH/ZryxOS.git
cd ZryxOS
```

### 2. 构建项目

```bash
mvn clean package
```

生成 `target/zryxos.jar` —— 单个可执行 JAR 文件。

### 3. 初始化工作区

```bash
java -jar target/zryxos.jar init
```

在当前目录创建 `.zryxos/` 工作区，包含默认配置：

```
.zryxos/
├── profiles/
│   └── default.yaml       # 默认 Agent Profile
├── memory/
│   └── MEMORY.md          # 长期记忆
├── mcp_servers.yaml       # MCP 服务器配置（可选）
└── zryxos.db              # SQLite 数据库（首次运行时创建）
```

### 4. 配置 LLM Provider

编辑 `.zryxos/profiles/default.yaml`，填入你的 API Key：

```yaml
name: default
description: 默认 Agent Profile

identity:
  agent_name: ZryxOS 助手
  prompt: 你是一个有帮助的助手。

provider:
  name: deepseek        # 或 qwen, kimi, openai
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}  # 从环境变量读取

tools:
  - http_get
  - http_post
  - read_file
  - write_file

channels:
  - name: cli
```

**环境变量设置：**

```bash
export DEEPSEEK_API_KEY=your_api_key_here
```

或直接替换 `${DEEPSEEK_API_KEY}` 为你的密钥（生产环境不推荐）。

### 5. 启动对话

```bash
java -jar target/zryxos.jar chat
```

你会看到：

```
ZryxOS v0.1.0
Profile: default
输入 'exit' 退出

You: 你好
Assistant: 你好！有什么可以帮助你的吗？
```

## 你的第一个 Agent

让我们创建一个天气助手 Agent。

### 1. 创建 Profile

```bash
java -jar target/zryxos.jar profile create weather-bot
```

### 2. 编辑配置

编辑 `.zryxos/profiles/weather-bot.yaml`：

```yaml
name: weather-bot
description: 天气查询助手，提供穿搭建议

identity:
  agent_name: 天气小助手
  prompt: |
    你是一个友好的天气助手。帮助用户查询天气并根据温度和天气情况
    给出穿搭建议。

provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}

tools:
  - http_get       # 调用天气 API
  - http_post

sandbox:
  allowed_domains:
    - api.openweathermap.org
    - wttr.in

channels:
  - name: cli
```

### 3. 与天气助手对话

```bash
java -jar target/zryxos.jar chat --profile weather-bot
```

示例对话：

```
You: 北京今天天气怎么样？
Assistant: 让我帮你查询一下。
[Agent 通过 http_get 工具调用天气 API]
Assistant: 北京目前气温 15°C，天气晴朗。
建议外出时穿一件薄外套。
```

## 作为 HTTP 服务运行

除了 CLI，还可以将 ZryxOS 作为 HTTP API 服务器启动：

```bash
java -jar target/zryxos.jar serve --port 8080
```

### 创建会话

```bash
curl -X POST http://localhost:8080/api/v1/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "profile_name": "default",
    "channel": "http",
    "user_id": "user-001"
  }'
```

响应：

```json
{
  "session_id": "http_user-001_default",
  "status": "active",
  "created_at": "2024-01-20T10:30:00Z"
}
```

### 发送消息

```bash
curl -X POST http://localhost:8080/api/v1/sessions/http_user-001_default/messages \
  -H "Content-Type: application/json" \
  -d '{
    "message": "你好，你能做什么？"
  }'
```

响应：

```json
{
  "response": "你好！我是 ZryxOS 助手。我可以帮助你...",
  "session_id": "http_user-001_default"
}
```

### 无状态调用

用于不需要会话状态的一次性请求：

```bash
curl -X POST http://localhost:8080/api/v1/agents/default/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "message": "2+2 等于多少？"
  }'
```

## 定时任务

配置 Agent 按计划运行。

编辑 `.zryxos/profiles/daily-report.yaml`：

```yaml
name: daily-report
description: 每日报表生成器

identity:
  agent_name: 报表机器人
  prompt: 生成每日汇总报表。

provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}

tools:
  - http_get
  - read_file

schedules:
  - cron: "0 9 * * *"          # 每天上午 9 点
    message: "生成每日报表"
  - cron: "0 18 * * FRI"       # 每周五下午 6 点
    message: "生成周报"

notify_channels:
  - type: webhook
    url: ${REPORT_WEBHOOK_URL}

channels:
  - name: scheduler
```

启动网关（包含调度器）：

```bash
java -jar target/zryxos.jar gateway
```

Agent 将在计划时间自动运行，并将结果推送到配置的 webhook。

## 下一步

- **[系统架构](/zh/docs/architecture)** — 理解五层架构
- **[五大核心能力](/zh/docs/capabilities)** — 深入了解 LLM、ReAct、Memory、Tools、Web Service
- **[CLI 命令](/zh/docs/commands)** — 全部 12 个命令参考
- **[REST API](/zh/docs/api)** — 完整 HTTP API 文档

## 常见问题

**问题：`DEEPSEEK_API_KEY not found`**

解决方案：运行前导出环境变量：

```bash
export DEEPSEEK_API_KEY=your_key
java -jar target/zryxos.jar chat
```

**问题：工具执行被沙箱阻止**

解决方案：在 profile 配置中添加域名/命令到白名单：

```yaml
sandbox:
  allowed_domains:
    - example.com
  allowed_commands:
    - curl
    - wget
```

**问题：端口 8080 已被占用**

解决方案：指定不同的端口：

```bash
java -jar target/zryxos.jar serve --port 8090
```
