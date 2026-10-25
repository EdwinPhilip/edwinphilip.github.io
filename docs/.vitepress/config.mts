import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Edwin Philip',
  description: 'Engineering leadership, platform engineering and public learning notes',
  base: '/knowledge-base/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://edwinphilip.github.io/knowledge-base/' },
  head: [
    ['meta', { name: 'theme-color', content: '#0c766f' }],
    ['meta', { name: 'author', content: 'Edwin Philip' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Edwin Philip',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About & Experience', link: '/about' },
      { text: 'Knowledge Base', link: '/guides/' },
      { text: 'Networking', link: '/guides/networking/' },
      { text: 'Linux Internals', link: '/guides/linux-internals/' }
    ],
    sidebar: {
      '/guides/networking/': [
        { text: 'Networking Fundamentals', link: '/guides/networking/' },
        { text: 'Complete Module 1', items: [
          { text: '1. HTTPS request lifecycle', link: '/guides/networking/q1' },
          { text: '2. TCP fundamentals', link: '/guides/networking/q2' },
          { text: '3. DNS internals', link: '/guides/networking/q3' },
          { text: '4. TLS and PKI', link: '/guides/networking/q4' },
          { text: '5. Load balancers and proxies', link: '/guides/networking/q5' },
          { text: '6. CIDR, routing and NAT', link: '/guides/networking/q6' },
          { text: '7. Kubernetes and GKE networking', link: '/guides/networking/q7' },
          { text: '8. Production troubleshooting', link: '/guides/networking/q8' },
        ] }
      ],
      '/guides/linux-internals/': [
        { text: 'Linux Internals', link: '/guides/linux-internals/' },
        { text: 'Complete Module 2', items: [
          { text: '1. Processes & scheduling', link: '/guides/linux-internals/q1' },
          { text: '2. Virtual memory', link: '/guides/linux-internals/q2' },
          { text: '3. Cgroups & OOM', link: '/guides/linux-internals/q3' },
          { text: '4. CPU quotas & PSI', link: '/guides/linux-internals/q4' },
          { text: '5. Storage & durability', link: '/guides/linux-internals/q5' },
          { text: '6. File descriptors & epoll', link: '/guides/linux-internals/q6' },
          { text: '7. Incident investigation', link: '/guides/linux-internals/q7' },
          { text: 'Hands-on labs', link: '/guides/linux-internals/labs' },
          { text: '35 difficult follow-ups', link: '/guides/linux-internals/follow-ups' }
        ] }
      ],
      '/guides/': [
        { text: 'Learning Guides', items: [
          { text: 'All guides', link: '/guides/' },
          { text: 'Networking Fundamentals', link: '/guides/networking/' },
          { text: 'Linux Internals', link: '/guides/linux-internals/' }
        ] }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/EdwinPhilip' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/edwin-philip-sudo/' }
    ],
    search: { provider: 'local' },
    footer: { message: 'Practical engineering knowledge, openly shared.', copyright: '© 2026 Edwin Philip' },
    editLink: { pattern: 'https://github.com/EdwinPhilip/knowledge-base/edit/main/docs/:path', text: 'Suggest an improvement' },
    outline: { level: [2, 3] }
  }
}))