<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()
const isZh = computed(() => lang.value === 'zh-CN')
const t = (zh, en) => isZh.value ? zh : en

const capabilities = computed(() => [
  {
    icon: '🤖',
    title: t('LLM 集成', 'LLM Integration'),
    subtitle: t('Spring AI Alibaba · 多 Provider · 模型路由', 'Spring AI Alibaba · Multi-Provider · Model Routing'),
    code: `# Provider 配置 (profiles/default.yaml)
provider:
  name: deepseek
  model: deepseek-chat
  api_key: \${DEEPSEEK_API_KEY}

# 多 Provider 并存
providers:
  - name: deepseek
    model: deepseek-chat
  - name: qwen
    model: qwen-plus`,
  },
  {
    icon: '🔄',
    title: t('ReAct 循环', 'ReAct Loop'),
    subtitle: t('自实现推理循环 · 工具调用 · 完全可控', 'Self-implemented reasoning · Tool execution · Fully controllable'),
    code: `# ReAct 循环流程
LLM 思考 → 决定调用工具 → ZryxOS 执行
         ↑                      ↓
         └────── 回填结果 ────────┘

# 配置
max_iterations: 10
tool_choice: auto`,
  },
  {
    icon: '🧠',
    title: t('记忆系统', 'Memory System'),
    subtitle: t('会话记忆 + 长期记忆 · MEMORY.md · 跨对话保持上下文', 'Session + Long-term · MEMORY.md · Cross-conversation context'),
    code: `# 三层记忆架构
1. 会话记忆 (Session Memory)
   - 当前对话的消息历史
   - 自动管理，无需配置

2. 长期记忆 (Long-term Memory)
   - .zryxos/memory/MEMORY.md
   - 核心记忆区 + 归档记忆区
   - 关键词检索，预留向量升级

3. 情景记忆 (Episodic - 扩展阶段)`,
  },
])

const scenarios = computed(() => [
  {
    num: '01',
    title: t('运维自动化', 'DevOps Automation'),
    desc: t('告警处理、故障自愈、巡检报告。Agent 通过 Shell/HTTP 工具执行运维操作，通过 Scheduler 定时巡检，结果推送到企业 IM。', 'Alert handling, self-healing, inspection reports. Agents execute ops via Shell/HTTP tools, scheduled patrols via Scheduler, results pushed to IM.'),
  },
  {
    num: '02',
    title: t('知识管理', 'Knowledge Management'),
    desc: t('企业文档检索、规章制度问答。Agent 读取文档、索引知识库，通过 Memory 保留上下文，支持 CLI 和 REST API 多渠道接入。', 'Enterprise doc search, policy Q&A. Agents read docs, index knowledge, retain context via Memory, accessible via CLI and REST API.'),
  },
  {
    num: '03',
    title: t('客服助手', 'Customer Support'),
    desc: t('多渠道客服、工单处理。通过 Web Service 接入企业 IM 平台，Agent 处理客户咨询，调用工单系统 API 创建、查询工单。', 'Multi-channel support, ticket handling. Integrate via Web Service to IM platforms, agents handle inquiries, call ticket system APIs.'),
  },
  {
    num: '04',
    title: t('研发助手', 'Dev Assistant'),
    desc: t('代码审查、需求分析、技术调研。Agent 通过文件工具读取代码、通过 HTTP 工具查询 API 文档，生成分析报告。', 'Code review, requirement analysis, tech research. Agents read code via file tools, query API docs via HTTP, generate reports.'),
  },
  {
    num: '05',
    title: t('定时任务', 'Scheduled Tasks'),
    desc: t('每日数据同步、定时报表生成。通过 Scheduler 配置 cron 表达式，Agent 自动运行，结果通过 Notify 推送到指定渠道。', 'Daily data sync, scheduled reports. Configure cron via Scheduler, agents run automatically, results pushed via Notify.'),
  },
  {
    num: '06',
    title: t('多 Agent 协同', 'Multi-Agent Coordination'),
    desc: t('一个底座运行多个业务 Agent，共享 Provider、Memory、Tool 能力。通过 Profile 配置隔离，通过会话管理实现并发。', 'One runtime runs multiple agents, sharing Provider, Memory, Tool capabilities. Profile-based isolation, session-based concurrency.'),
  },
])
</script>

<template>
  <div class="zryxos-page">

    <!-- ── HERO ── -->
    <section class="zryxos-hero">
      <div class="zryxos-hero-inner">
        <div class="zryxos-badge">
          <span class="zryxos-badge-dot"></span>
          {{ t('配置即 Agent · Java 原生 · 私有部署', 'Config-driven · Java-native · Self-hosted') }}
        </div>

        <h1 class="zryxos-title">
          <span class="zryxos-title-name">ZryxOS</span>
        </h1>

        <p class="zryxos-title-sub">{{ t('企业级 Java Agent 操作系统', 'The Java-native Agent OS') }}</p>

        <p class="zryxos-hero-desc">
          {{ t('ZryxOS 是基于 Java 21 和 Spring Boot 3.x 构建的 Agent 运行底座。一份配置定义一个 Agent，一个底座运行一群 Agent。私有部署，数据不出域，完全可审计。', 'ZryxOS is an Agent runtime built on Java 21 + Spring Boot 3.x. One config defines an agent, one runtime runs a fleet. Self-hosted, fully auditable, data stays in your infrastructure.') }}
        </p>

        <div class="zryxos-hero-actions">
          <a class="zryxos-btn-primary" :href="t('/zh/docs/quick-start', '/docs/quick-start')">
            {{ t('快速开始', 'Get Started') }} →
          </a>
          <a class="zryxos-btn-ghost" :href="t('/zh/docs/what', '/docs/what')">
            {{ t('了解更多', 'Learn More') }}
          </a>
          <a class="zryxos-btn-ghost" href="https://github.com/XianReallyHot-ZZH/ZryxOS" target="_blank" rel="noopener">
            GitHub
          </a>
        </div>

        <div class="zryxos-hero-note">
          {{ t('JDK 21 · Spring Boot 3.x · Spring AI Alibaba · MCP · A2A · 单 JAR 部署', 'JDK 21 · Spring Boot 3.x · Spring AI Alibaba · MCP · A2A · Single JAR deployment') }}
        </div>
      </div>
    </section>

    <!-- ── PROBLEM ── -->
    <section class="zryxos-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-problem">
          <div class="zryxos-problem-text">
            <h2 class="zryxos-section-title">{{ t('为什么需要 ZryxOS', 'Why ZryxOS') }}</h2>
            <p>{{ t('企业需要 Agent，但现有方案大多基于 Python 或云托管平台，对于后端标准是 Java 且需要私有部署的企业来说，存在明显的痛点。', 'Enterprises need agents, but existing solutions are mostly Python-based or cloud-hosted. For Java-centric organizations requiring self-hosting, there is a clear gap.') }}</p>
            <p class="zryxos-problem-item">
              <strong>{{ t('① 技术栈不匹配', '① Stack mismatch') }}</strong>
              {{ t('现有 Agent 框架多为 Python 生态，企业 Java 技术栈难以集成和运维。', 'Most agent frameworks are Python-based, difficult to integrate with enterprise Java stacks.') }}
            </p>
            <p class="zryxos-problem-item">
              <strong>{{ t('② 无法私有部署', '② Cannot self-host') }}</strong>
              {{ t('云托管方案数据外流，不符合企业合规要求。', 'Cloud-hosted solutions leak data, violating compliance requirements.') }}
            </p>
            <p class="zryxos-problem-item">
              <strong>{{ t('③ 缺乏审计能力', '③ No auditability') }}</strong>
              {{ t('LLM 调用、工具执行缺乏审计记录，无法追溯。', 'LLM calls and tool executions lack audit trails, no traceability.') }}
            </p>
            <p class="zryxos-solution-line">{{ t('ZryxOS 专为企业场景设计，填补 Java 生态的 Agent OS 空白。', 'ZryxOS is designed for enterprise scenarios, filling the Agent OS gap in the Java ecosystem.') }}</p>
          </div>
          <div class="zryxos-problem-compare">
            <div class="zryxos-compare-item zryxos-compare-bad">
              <div class="zryxos-compare-label">{{ t('现有方案', 'Existing Solutions') }}</div>
              <div class="zryxos-compare-rows">
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon">✗</span>
                  <span>{{ t('Python 框架，Java 企业难以集成', 'Python frameworks, hard to integrate with Java') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon">✗</span>
                  <span>{{ t('云托管平台，数据外流合规风险', 'Cloud-hosted, data leakage compliance risk') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon">✗</span>
                  <span>{{ t('缺乏审计，LLM 调用和工具执行不可追溯', 'No audit trail, LLM and tool calls untraceable') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon">✗</span>
                  <span>{{ t('依赖外部框架，核心逻辑不可控', 'Depends on external frameworks, core logic uncontrollable') }}</span>
                </div>
              </div>
            </div>
            <div class="zryxos-compare-item zryxos-compare-good">
              <div class="zryxos-compare-label">ZryxOS</div>
              <div class="zryxos-compare-rows">
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon zryxos-icon-ok">✓</span>
                  <span>{{ t('Java 原生，Spring Boot 单 JAR 部署', 'Java-native, Spring Boot single JAR') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon zryxos-icon-ok">✓</span>
                  <span>{{ t('私有部署，数据留在企业内部', 'Self-hosted, data stays in your infrastructure') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon zryxos-icon-ok">✓</span>
                  <span>{{ t('从第一天审计，所有调用可追溯', 'Audit from day one, all calls traceable') }}</span>
                </div>
                <div class="zryxos-compare-row">
                  <span class="zryxos-compare-icon zryxos-icon-ok">✓</span>
                  <span>{{ t('自实现 ReAct，核心逻辑完全可控', 'Self-implemented ReAct, fully controllable') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── ARCHITECTURE DIAGRAM ── -->
    <section class="zryxos-section zryxos-arch-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-section-header">
          <div class="zryxos-section-tag">{{ t('系统架构', 'Architecture') }}</div>
          <h2 class="zryxos-section-title">{{ t('清晰的五层架构', 'Clean Five-Layer Architecture') }}</h2>
        </div>
        <img src="/architecture.svg" alt="ZryxOS Architecture" class="zryxos-arch-img" />
      </div>
    </section>

    <!-- ── CAPABILITIES ── -->
    <section class="zryxos-section zryxos-primitives-section">
      <div class="zryxos-section-inner zryxos-primitives-inner">
        <div class="zryxos-section-header">
          <div class="zryxos-section-tag">{{ t('核心能力', 'Core Capabilities') }}</div>
          <h2 class="zryxos-section-title">{{ t('五大核心能力', 'Five Core Capabilities') }}</h2>
        </div>
        <div class="zryxos-primitives">
          <div v-for="p in capabilities" :key="p.title" class="zryxos-primitive">
            <div class="zryxos-primitive-header">
              <span class="zryxos-primitive-icon">{{ p.icon }}</span>
              <div>
                <h3 class="zryxos-primitive-title">{{ p.title }}</h3>
                <p class="zryxos-primitive-subtitle">{{ p.subtitle }}</p>
              </div>
            </div>
            <pre class="zryxos-code"><code>{{ p.code }}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SCENARIOS ── -->
    <section class="zryxos-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-section-header">
          <div class="zryxos-section-tag">{{ t('真实场景', 'Real Scenarios') }}</div>
          <h2 class="zryxos-section-title">{{ t('六个真实使用场景', 'Six Real-World Use Cases') }}</h2>
        </div>
        <div class="zryxos-scenarios">
          <div v-for="s in scenarios" :key="s.num" class="zryxos-scenario">
            <div class="zryxos-scenario-num">{{ s.num }}</div>
            <div>
              <h3 class="zryxos-scenario-title">{{ s.title }}</h3>
              <p class="zryxos-scenario-desc">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── INTEGRATION ── -->
    <section class="zryxos-section zryxos-integration-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-section-header">
          <div class="zryxos-section-tag">{{ t('接入方式', 'Integration') }}</div>
          <h2 class="zryxos-section-title">{{ t('三种运行模式，灵活接入', 'Three Run Modes, Flexible Integration') }}</h2>
        </div>
        <div class="zryxos-integration-cards">
          <div class="zryxos-integration-card">
            <div class="zryxos-integration-icon">💬</div>
            <h3 class="zryxos-integration-title">{{ t('CLI 交互模式', 'CLI Interactive Mode') }}</h3>
            <p class="zryxos-integration-desc">{{ t('命令行交互式对话，适合本地开发和调试。支持多 Profile 切换，实时查看 Agent 响应。', 'Command-line interactive chat, ideal for local development and debugging. Multi-profile support, real-time agent responses.') }}</p>
            <pre class="zryxos-code"><code>java -jar zryxos.jar chat --profile default</code></pre>
          </div>
          <div class="zryxos-integration-card zryxos-integration-featured">
            <div class="zryxos-integration-icon">🌐</div>
            <h3 class="zryxos-integration-title">{{ t('REST API 服务', 'REST API Service') }}</h3>
            <p class="zryxos-integration-desc">{{ t('HTTP 接口服务，适合企业系统集成。10 个核心端点，支持会话管理和无状态调用。', 'HTTP API service for enterprise integration. 10 core endpoints, session management and stateless invocation.') }}</p>
            <pre class="zryxos-code"><code>java -jar zryxos.jar serve --port 8080

# 调用 Agent
curl -X POST http://localhost:8080/api/v1/agents/default/invoke \\
  -H "Content-Type: application/json" \\
  -d '{"message": "查询今天天气"}'</code></pre>
          </div>
          <div class="zryxos-integration-card">
            <div class="zryxos-integration-icon">⏰</div>
            <h3 class="zryxos-integration-title">{{ t('定时任务模式', 'Scheduled Tasks') }}</h3>
            <p class="zryxos-integration-desc">{{ t('内置 cron 调度器，无需外部 cron。在 Profile 中配置 schedules，Agent 自动按时运行，结果推送到指定渠道。', 'Built-in cron scheduler, no external cron needed. Configure schedules in Profile, agents run on time, results pushed to channels.') }}</p>
            <pre class="zryxos-code"><code>schedules:
  - cron: "0 9 * * *"
    message: "生成每日报表"
  - cron: "*/30 * * * *"
    message: "健康检查"</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CLI COMMANDS ── -->
    <section class="zryxos-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-section-header">
          <div class="zryxos-section-tag">{{ t('命令行工具', 'CLI Commands') }}</div>
          <h2 class="zryxos-section-title">{{ t('完整的命令行工具', 'Complete CLI Toolkit') }}</h2>
          <p class="zryxos-section-desc">{{ t('12 个核心命令，覆盖初始化、运行、Profile 管理、状态查询全流程。', '12 core commands covering initialization, runtime, profile management, and status queries.') }}</p>
        </div>
        <div class="zryxos-cmd-grid">
          <div class="zryxos-cmd-group">
            <div class="zryxos-cmd-group-label">{{ t('工作区管理', 'Workspace') }}</div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos init</code>
              <span class="zryxos-cmd-desc">{{ t('初始化 .zryxos/ 工作区', 'Initialize .zryxos/ workspace') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos status</code>
              <span class="zryxos-cmd-desc">{{ t('查看运行时状态', 'Show runtime status') }}</span>
            </div>
          </div>
          <div class="zryxos-cmd-group">
            <div class="zryxos-cmd-group-label">{{ t('运行模式', 'Run Modes') }}</div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos chat [--profile]</code>
              <span class="zryxos-cmd-desc">{{ t('交互式对话', 'Interactive chat') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos serve</code>
              <span class="zryxos-cmd-desc">{{ t('启动 HTTP API 服务', 'Start HTTP API service') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos gateway</code>
              <span class="zryxos-cmd-desc">{{ t('多渠道守护进程', 'Multi-channel daemon') }}</span>
            </div>
          </div>
          <div class="zryxos-cmd-group">
            <div class="zryxos-cmd-group-label">{{ t('Profile 管理', 'Profile Management') }}</div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos profile list</code>
              <span class="zryxos-cmd-desc">{{ t('列出所有 Profile', 'List all profiles') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos profile create</code>
              <span class="zryxos-cmd-desc">{{ t('创建新 Profile', 'Create new profile') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos profile show</code>
              <span class="zryxos-cmd-desc">{{ t('查看 Profile 详情', 'Show profile details') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos profile delete</code>
              <span class="zryxos-cmd-desc">{{ t('删除 Profile', 'Delete profile') }}</span>
            </div>
          </div>
          <div class="zryxos-cmd-group">
            <div class="zryxos-cmd-group-label">{{ t('信息查询', 'Info') }}</div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos provider list</code>
              <span class="zryxos-cmd-desc">{{ t('列出已配置的 Provider', 'List configured providers') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos tool list</code>
              <span class="zryxos-cmd-desc">{{ t('列出已注册的 Tool', 'List registered tools') }}</span>
            </div>
            <div class="zryxos-cmd-row">
              <code class="zryxos-cmd-name">zryxos session list</code>
              <span class="zryxos-cmd-desc">{{ t('列出会话历史', 'List session history') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section class="zryxos-section zryxos-cta-section">
      <div class="zryxos-section-inner">
        <div class="zryxos-cta">
          <h2 class="zryxos-cta-title">{{ t('立即开始', 'Get Started') }}</h2>
          <p class="zryxos-cta-desc">{{ t('克隆仓库，5 分钟启动你的第一个 Agent。', 'Clone the repo, start your first agent in 5 minutes.') }}</p>
          <pre class="zryxos-code zryxos-cta-code"><code># 克隆项目
git clone https://github.com/XianReallyHot-ZZH/ZryxOS.git
cd ZryxOS

# 构建
mvn clean package

# 初始化工作区
java -jar target/zryxos.jar init

# 配置 Provider (编辑 .zryxos/profiles/default.yaml)
provider:
  name: deepseek
  model: deepseek-chat
  api_key: ${DEEPSEEK_API_KEY}

# 启动对话
java -jar target/zryxos.jar chat</code></pre>
          <div class="zryxos-cta-links">
            <a class="zryxos-btn-primary" :href="t('/zh/docs/quick-start', '/docs/quick-start')">{{ t('查看文档', 'Read the Docs') }}</a>
            <a class="zryxos-btn-ghost" href="https://github.com/XianReallyHot-ZZH/ZryxOS" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.zryxos-page {
  min-height: 100vh;
  background: #ffffff;
  color: #000000;
  font-family: inherit;
}

/* ── Hero ── */
.zryxos-hero {
  position: relative;
  padding: 100px 24px 80px;
  text-align: center;
  overflow: hidden;
}
.zryxos-hero-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.zryxos-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  border: 1px solid #d4d4d4;
  background: #f5f5f5;
  color: #555555;
  font-size: 12px;
  margin-bottom: 28px;
}
.zryxos-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #ea580c;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.4; transform:scale(1.4); }
}
.zryxos-title {
  margin: 0 0 12px;
  line-height: 1;
}
.zryxos-title-name {
  font-size: clamp(72px, 14vw, 120px);
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.zryxos-title-sub {
  font-size: 18px;
  color: #666666;
  margin: 0 0 20px;
}
.zryxos-hero-desc {
  font-size: 16px;
  line-height: 1.7;
  color: #444444;
  max-width: 600px;
  margin: 0 0 32px;
}
.zryxos-hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}
.zryxos-btn-primary {
  padding: 11px 28px;
  border-radius: 8px;
  background: #ea580c;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
}
.zryxos-btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
.zryxos-btn-ghost {
  padding: 11px 28px;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
  color: #333333;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.zryxos-btn-ghost:hover { border-color: #ea580c; background: #fff7ed; }
.zryxos-hero-note {
  font-size: 12px;
  color: #999999;
}

/* ── Section ── */
.zryxos-section { padding: 72px 24px; }
.zryxos-section-inner { max-width: 1000px; margin: 0 auto; }
.zryxos-primitives-inner { max-width: 1400px; }
.zryxos-section-header { text-align: center; margin-bottom: 48px; }
.zryxos-section-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555555;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #d4d4d4;
  background: #f5f5f5;
  margin-bottom: 14px;
}
.zryxos-section-title {
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px;
}
.zryxos-section-desc {
  font-size: 15px;
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* ── Problem ── */
.zryxos-problem {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
.zryxos-problem-text p { color: #666666; line-height: 1.7; margin: 0 0 14px; font-size: 15px; }
.zryxos-problem-item strong { color: #000000; display: block; margin-bottom: 4px; }
.zryxos-solution-line { color: #000000 !important; font-weight: 600; }
.zryxos-problem-compare { display: flex; flex-direction: column; gap: 16px; }
.zryxos-compare-item {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}
.zryxos-compare-bad { background: #fafafa; }
.zryxos-compare-good { background: #fff7ed; border-color: #fed7aa; }
.zryxos-compare-label { font-size: 11px; font-weight: 700; color: #999999; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
.zryxos-compare-rows { display: flex; flex-direction: column; gap: 8px; }
.zryxos-compare-row { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555555; line-height: 1.5; }
.zryxos-compare-icon { flex-shrink: 0; font-style: normal; color: #bbbbbb; font-weight: 700; width: 14px; }
.zryxos-icon-ok { color: #ea580c; }

/* ── Architecture ── */
.zryxos-arch-section { background: #f5f5f5; }
.zryxos-arch-img {
  width: 100%;
  display: block;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #ffffff;
}

/* ── Primitives ── */
.zryxos-primitives-section { background: #f5f5f5; }
.zryxos-primitives { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 1fr; gap: 16px; }
.zryxos-primitive {
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e5e5e5;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 0;
  overflow: hidden;
}
.zryxos-primitive .zryxos-code { flex: 1; }
.zryxos-primitive:hover { border-color: #ea580c; box-shadow: 0 4px 16px rgba(234, 88, 12, 0.1); }
.zryxos-primitive-header { display: flex; align-items: flex-start; gap: 12px; }
.zryxos-primitive-icon { font-size: 28px; flex-shrink: 0; }
.zryxos-primitive-title { font-size: 17px; font-weight: 700; color: #000000; margin: 0 0 2px; }
.zryxos-primitive-subtitle { font-size: 12px; color: #999999; margin: 0; }
.zryxos-code {
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 12px;
  line-height: 1.6;
  color: #333333;
  overflow-x: auto;
  margin: 0;
  white-space: pre;
}
.zryxos-code code { font-family: 'JetBrains Mono', 'Fira Code', monospace; background: none; color: inherit; }

/* ── Scenarios ── */
.zryxos-scenarios { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.zryxos-scenario {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
}
.zryxos-scenario-num {
  font-size: 28px;
  font-weight: 900;
  color: #e5e5e5;
  line-height: 1;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}
.zryxos-scenario-title { font-size: 15px; font-weight: 600; color: #000000; margin: 0 0 6px; }
.zryxos-scenario-desc { font-size: 13px; color: #666666; line-height: 1.6; margin: 0; }

/* ── Integration ── */
.zryxos-integration-section { background: #f5f5f5; }
.zryxos-integration-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}
.zryxos-integration-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}
.zryxos-integration-featured { border-color: #ea580c; border-width: 2px; }
.zryxos-integration-icon { font-size: 28px; }
.zryxos-integration-title { font-size: 17px; font-weight: 700; color: #000000; margin: 0; }
.zryxos-integration-desc { font-size: 14px; color: #666666; line-height: 1.6; margin: 0; flex: 1; }
.zryxos-integration-card .zryxos-code {
  max-height: 180px;
  overflow-y: auto;
  flex-shrink: 0;
}

/* ── Command grid ── */
.zryxos-cmd-grid { display: flex; flex-direction: column; gap: 28px; }
.zryxos-cmd-group { display: flex; flex-direction: column; gap: 6px; }
.zryxos-cmd-group-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #555555;
  margin-bottom: 4px;
}
.zryxos-cmd-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  flex-wrap: wrap;
}
.zryxos-cmd-name {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 12px;
  color: #000000;
  background: #f0f0f0;
  border: 1px solid #d4d4d4;
  padding: 2px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  white-space: nowrap;
}
.zryxos-cmd-desc { font-size: 13px; color: #666666; flex: 1; }

/* ── CTA ── */
.zryxos-cta-section { background: #f5f5f5; }
.zryxos-cta { text-align: center; max-width: 680px; margin: 0 auto; }
.zryxos-cta-title { font-size: 28px; font-weight: 700; color: #000000; margin: 0 0 12px; }
.zryxos-cta-desc { font-size: 15px; color: #666666; margin: 0 0 24px; }
.zryxos-cta-code { text-align: left; margin-bottom: 28px; }
.zryxos-cta-links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .zryxos-integration-cards { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .zryxos-hero { padding: 72px 20px 60px; }
  .zryxos-problem { grid-template-columns: 1fr; }
  .zryxos-primitives { grid-template-columns: 1fr; }
  .zryxos-scenarios { grid-template-columns: 1fr; }
  .zryxos-section { padding: 48px 20px; }
}
</style>
