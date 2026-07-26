import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ZryxOS',
  titleTemplate: ':title — ZryxOS',
  description: 'An open-source Java-native Agent OS — one config defines an agent, one runtime runs a fleet. Self-hosted, auditable, built on JDK 21 + Spring Boot.',
  base: '/ZryxOS/',
  cleanUrls: true,
  appearance: 'force-light',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/ZryxOS/logo.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap' }],
    ['meta', { name: 'author', content: 'ZryxOS' }],
    ['meta', { name: 'keywords', content: 'ZryxOS, Agent OS, Java Agent, AI Agent runtime, Spring AI, ReAct, MCP, multi-agent, self-hosted agent platform, enterprise AI agent' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ZryxOS' }],
    ['meta', { property: 'og:title', content: 'ZryxOS — The Java-native Agent OS' }],
    ['meta', { property: 'og:description', content: 'One config defines an agent, one runtime runs a fleet. Self-hosted, auditable, built on JDK 21 + Spring Boot.' }],
    ['meta', { property: 'og:url', content: 'https://xianreallyhot-zzh.github.io/ZryxOS/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ZryxOS — The Java-native Agent OS' }],
    ['meta', { name: 'twitter:description', content: 'One config defines an agent, one runtime runs a fleet. Self-hosted, auditable, built on JDK 21 + Spring Boot.' }],
    ['link', { rel: 'canonical', href: 'https://xianreallyhot-zzh.github.io/ZryxOS/' }],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Docs', link: '/docs/what' },
          { text: 'GitHub', link: 'https://github.com/XianReallyHot-ZZH/ZryxOS' },
        ],
        sidebar: {
          '/docs/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'What is ZryxOS', link: '/docs/what' },
                { text: 'Quick Start', link: '/docs/quick-start' },
              ],
            },
            {
              text: 'Deep Dives',
              items: [
                { text: 'Architecture', link: '/docs/architecture' },
                { text: 'Core Capabilities', link: '/docs/capabilities' },
              ],
            },
            {
              text: 'Reference',
              items: [
                { text: 'CLI Commands', link: '/docs/commands' },
                { text: 'REST API', link: '/docs/api' },
                { text: 'Roadmap', link: '/docs/roadmap' },
              ],
            },
          ],
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '文档', link: '/zh/docs/what' },
          { text: 'GitHub', link: 'https://github.com/XianReallyHot-ZZH/ZryxOS' },
        ],
        sidebar: {
          '/zh/docs/': [
            {
              text: '快速入门',
              items: [
                { text: 'ZryxOS 是什么', link: '/zh/docs/what' },
                { text: '快速开始', link: '/zh/docs/quick-start' },
              ],
            },
            {
              text: '深入了解',
              items: [
                { text: '系统架构', link: '/zh/docs/architecture' },
                { text: '五大核心能力', link: '/zh/docs/capabilities' },
              ],
            },
            {
              text: '参考',
              items: [
                { text: 'CLI 命令', link: '/zh/docs/commands' },
                { text: 'REST API', link: '/zh/docs/api' },
                { text: '路线图', link: '/zh/docs/roadmap' },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    siteTitle: 'ZryxOS',
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XianReallyHot-ZZH/ZryxOS' },
    ],
  },

  sitemap: {
    hostname: 'https://xianreallyhot-zzh.github.io/ZryxOS/',
  },
})
