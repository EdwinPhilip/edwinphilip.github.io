import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'Edwin Philip',
  description: 'Engineering leadership, platform engineering and public learning notes',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://edwinphilip.github.io/' },
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
      { text: 'Linux Internals', link: '/guides/linux-internals/' },
      { text: 'Kubernetes', link: '/guides/kubernetes/' },
      { text: 'Terraform', link: '/guides/terraform/' },
      { text: 'GCP Fundamentals', link: '/guides/gcp/' }
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
      '/guides/kubernetes/': [
        { text: 'Kubernetes Architecture & Operations', link: '/guides/kubernetes/' },
        { text: 'Complete Module 3', items: [
          { text: '1. Architecture', link: '/guides/kubernetes/q1' },
          { text: '2. Deployment lifecycle', link: '/guides/kubernetes/q2' },
          { text: '3. etcd and Raft', link: '/guides/kubernetes/q3' },
          { text: '4. Controllers and operators', link: '/guides/kubernetes/q4' },
          { text: '5. Scheduler', link: '/guides/kubernetes/q5' },
          { text: '6. Workload controllers', link: '/guides/kubernetes/q6' },
          { text: '7. Resources and QoS', link: '/guides/kubernetes/q7' },
          { text: '8. Probes and lifecycle', link: '/guides/kubernetes/q8' },
          { text: '9. CSI and storage', link: '/guides/kubernetes/q9' },
          { text: '10. Autoscaling', link: '/guides/kubernetes/q10' },
          { text: '11. Security and admission', link: '/guides/kubernetes/q11' },
          { text: '12. Upgrades and troubleshooting', link: '/guides/kubernetes/q12' },
          { text: 'Hands-on labs', link: '/guides/kubernetes/labs' },
          { text: '42 difficult follow-ups', link: '/guides/kubernetes/follow-ups' }
        ] }
      ],
      '/guides/terraform/': [
        { text: 'Terraform Architecture, AWS and GCP', link: '/guides/terraform/' },
        { text: 'Complete Module 4', items: [
          { text: '1. Terraform fundamentals', link: '/guides/terraform/q1' },
          { text: '2. Dependency graph and planning', link: '/guides/terraform/q2' },
          { text: '3. HCL and resource identity', link: '/guides/terraform/q3' },
          { text: '4. State and remote backends', link: '/guides/terraform/q4' },
          { text: '5. Modules and providers', link: '/guides/terraform/q5' },
          { text: '6. Terraform on AWS', link: '/guides/terraform/q6' },
          { text: '7. Terraform on Google Cloud', link: '/guides/terraform/q7' },
          { text: '8. Import and refactoring', link: '/guides/terraform/q8' },
          { text: '9. Drift and recovery', link: '/guides/terraform/q9' },
          { text: '10. Security, secrets and policy', link: '/guides/terraform/q10' },
          { text: '11. CI/CD and Atlantis', link: '/guides/terraform/q11' },
          { text: '12. Enterprise platform design', link: '/guides/terraform/q12' },
          { text: 'Hands-on labs', link: '/guides/terraform/labs' },
          { text: '45 difficult follow-ups', link: '/guides/terraform/follow-ups' }
        ] }
      ],
      '/guides/gcp/': [
        { text: 'GCP Fundamentals and Production Engineering', link: '/guides/gcp/' },
        { text: 'Complete Module 5', items: [
          { text: '1. Resource hierarchy', link: '/guides/gcp/q1' },
          { text: '2. IAM and workload identity', link: '/guides/gcp/q2' },
          { text: '3. VPC, Shared VPC and firewall', link: '/guides/gcp/q3' },
          { text: '4. NAT, DNS and load balancing', link: '/guides/gcp/q4' },
          { text: '5. Compute Engine and MIGs', link: '/guides/gcp/q5' },
          { text: '6. Storage, artifacts and data', link: '/guides/gcp/q6' },
          { text: '7. Observability and SLOs', link: '/guides/gcp/q7' },
          { text: '8. Architecture and recovery', link: '/guides/gcp/q8' },
          { text: 'Hands-on labs', link: '/guides/gcp/labs' },
          { text: '40 challenging follow-ups', link: '/guides/gcp/follow-ups' }
        ] }
      ],
      '/guides/': [
        { text: 'Learning Guides', items: [
          { text: 'All guides', link: '/guides/' },
          { text: 'Networking Fundamentals', link: '/guides/networking/' },
          { text: 'Linux Internals', link: '/guides/linux-internals/' },
          { text: 'Kubernetes Architecture', link: '/guides/kubernetes/' },
          { text: 'Terraform Architecture', link: '/guides/terraform/' },
          { text: 'GCP Fundamentals', link: '/guides/gcp/' }
        ] }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/EdwinPhilip' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/edwin-philip-sudo/' }
    ],
    search: { provider: 'local' },
    footer: { message: 'Practical engineering knowledge, openly shared.', copyright: '© 2026 Edwin Philip' },
    editLink: { pattern: 'https://github.com/EdwinPhilip/EdwinPhilip.github.io/edit/main/docs/:path', text: 'Suggest an improvement' },
    outline: { level: [2, 3] }
  }
}))