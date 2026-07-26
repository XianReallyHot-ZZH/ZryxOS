---
title: 五大核心能力
description: 深入了解 ZryxOS 的五大核心能力 — LLM 集成、ReAct 循环、记忆系统、工具框架和 Web 服务。
outline: deep
---

# 五大核心能力

ZryxOS 提供五大核心能力,构成企业级 Agent OS 的基础。

## 1. LLM 集成

基于 **Spring AI Alibaba** 的统一 Provider 抽象。

**支持的 Provider:**
- DeepSeek
- 通义千问（阿里云）
- Kimi（月之暗面）
- OpenAI
- 本地推理（Ollama、vLLM）

**配置示例:**

```yaml
provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}
  base_url: https://api.deepseek.com  # 可选
  max_tokens: 4096
  temperature: 0.7
```

**多 Provider 支持:**

```yaml
providers:
  - name: deepseek
    model: deepseek-chat
  - name: qwen
    model: qwen-plus
  - name: local
    model: llama3
    base_url: http://localhost:11434
```

运行时切换只需修改 profile 配置 — 无需代码更改。

## 2. ReAct 循环

自实现推理循环。不封装外部 Agent 框架。

**执行流程:**

1. LLM 收到包含可用工具的提示词
2. LLM 决定: 调用工具或返回最终答案
3. 如果调用工具 → ToolExecutor 执行（带 Sandbox 校验）
4. 结果回填给 LLM
5. 重复直到最终答案或达到最大迭代次数

**配置:**

```yaml
react:
  max_iterations: 10
  tool_choice: auto  # 或 required、none
```

**为什么自实现？**

- 完全控制执行流程
- 自定义工具编排逻辑
- 精确的审计点
- 无外部框架锁定

## 3. 记忆系统

三层记忆架构。

### 会话记忆

当前对话存储在 `sessions.messages_json`。由 SessionManager 自动管理。

### 长期记忆

`.zryxos/memory/MEMORY.md` 结构:

```markdown
# 核心记忆区（永不截断）

- 用户偏好简洁回答
- 项目使用 Java 21 特性
- API 密钥存储在环境变量中

---

# 归档记忆区（可截断）

## 2024-01-15
- 讨论了部署策略
- 决定生产环境使用 K8s
```

### 三种后端选项

1. **MarkdownMemoryStore**（默认）— 单个 MEMORY.md 文件
2. **SqliteMemoryStore** — `memory_entries` 表中的结构化条目
3. **Mem0MemoryStore** — 自托管 Mem0 集成（未来）

**MemoryTools API:**

```yaml
tools:
  - memory_add     # 添加到长期记忆
  - memory_query   # 搜索记忆
  - memory_list    # 列出所有条目
```

## 4. 工具体系

Agent 通过工具与世界交互。

### 内置工具

- `read_file` / `write_file` — 文件操作
- `shell` — 执行 shell 命令
- `http_get` / `http_post` — HTTP 请求
- `memory_add` / `memory_query` — 记忆操作
- `notify` — 推送通知到 webhook

### 三档插件集成

**1. 零代码 — SKILL.md + MCP**

编写技能定义,复用现有 MCP 服务器:

```markdown
---
name: weather-skill
mcp_server: weather-server
---

通过 wttr.in API 查询天气信息。
```

**2. 轻代码 — 自定义 MCP 服务器**

用任意语言实现 MCP 协议:

```python
# weather_mcp_server.py
from mcp import MCPServer

server = MCPServer()

@server.tool("get_weather")
def get_weather(city: str) -> str:
    # 调用天气 API
    return f"{city}天气: 20°C, 晴天"

server.run()
```

**3. 重代码 — Java @Tool Bean**

```java
@Component
public class WeatherTools {
    @Tool(name = "get_weather", 
          description = "获取城市当前天气")
    public String getWeather(@Param("city") String city) {
        // 实现
        return "天气: 20°C, 晴天";
    }
}
```

### 沙箱

应用层白名单强制执行:

```yaml
sandbox:
  allowed_paths:
    - /data
    - /tmp
  allowed_commands:
    - curl
    - wget
  allowed_domains:
    - api.openweathermap.org
    - wttr.in
```

所有工具执行记录到 `tool_invocations` 审计表。

## 5. 对外服务

10 个 REST API 端点供企业集成。

### 会话管理（4 个端点）

```bash
# 创建会话
POST /api/v1/sessions

# 发送消息
POST /api/v1/sessions/{id}/messages

# 获取历史
GET /api/v1/sessions/{id}

# 归档会话
DELETE /api/v1/sessions/{id}
```

### Agent 调用（1 个端点）

```bash
# 无状态调用
POST /api/v1/agents/{name}/invoke
```

### 信息查询（3 个端点）

```bash
# 列出 profiles
GET /api/v1/profiles

# 查询记忆
GET /api/v1/memory

# 列出工具
GET /api/v1/tools
```

### 系统状态（2 个端点）

```bash
# 健康检查
GET /api/v1/health

# 运行时信息
GET /api/v1/info
```

**OpenAPI 规范:**

服务运行时可在 `/api/v1/docs` 获取完整的 OpenAPI 3.0 规范。

---

*动手示例请参阅 [快速开始](/zh/docs/quick-start)。架构细节请参阅 [系统架构](/zh/docs/architecture)。*
