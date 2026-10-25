# Jenkins Architecture, Pipelines and Production Operations

**Module 11.** A practical senior-level engineering guide to understanding how Jenkins works and how to operate it safely at scale. The material covers the controller/agent execution model, Declarative and Scripted Pipelines, SCM branch discovery, ephemeral build infrastructure, BuildKit and artifacts, Shared Libraries, credential isolation, disaster recovery, JVM troubleshooting and CI platform governance.

::: info Scope and audience
All incidents, organizations, repositories and infrastructure examples are **hypothetical**. Jenkins behavior depends on installed plugin versions, core/LTS line, hosting model and security configuration. Code examples are teaching fixtures, not deployment-ready configurations. Apply changes only in authorized test environments.
:::

## Prerequisites

- Basic Linux processes, storage, networking, Java process diagnostics and Git
- Containers, Kubernetes Pods and RBAC fundamentals
- Familiarity with a CI job running source checkout, tests and a build
- Ability to read simple Groovy and shell; no previous plugin development is required

## Learning outcomes

You should be able to:

- Trace a queued Jenkins job to a specific eligible agent and executor.
- Explain controller Pipeline CPS coordination, durability limits and where Groovy work executes.
- Write bounded, testable Jenkinsfiles and choose between Declarative and Scripted syntax.
- Secure Multibranch/Organization Folder pipelines against untrusted changes.
- Provision and debug Kubernetes agents, workspace reuse and toolchain drift.
- Build traceable container artifacts with safe caches, digests and isolated publishing.
- Govern Shared Libraries by version, API design and trust level.
- Isolate credentials, trusted steps and production authorization.
- Recover a stateful Jenkins controller using backups, protected keys and tested upgrades.
- Diagnose UI 502s, queue bottlenecks, CPS failures, disk pressure and agent disconnections.
- Design Jenkins as one component of a governed internal developer platform.

## Ten chapters

1. [Controller, agents, executors and complete build request flow](./q1)
2. [Declarative Pipeline, Groovy CPS, parallelism and reliable stages](./q2)
3. [Multibranch, SCM events, webhooks and untrusted change requests](./q3)
4. [Kubernetes agents, provisioning, queue latency and isolation](./q4)
5. [Container image builds, BuildKit caching and artifact provenance](./q5)
6. [Shared Libraries, trusted code, versioning and governance](./q6)
7. [Jenkins security: credentials, authentication and agent trust](./q7)
8. [Controller lifecycle: JCasC, backups, upgrades and restore](./q8)
9. [Production troubleshooting: queue, JVM, storage and 502 errors](./q9)
10. [CI platform architecture, GitOps handoff, SLOs and trade-offs](./q10)

## Practice and advanced questions

- [Eight hands-on exercises and game-day scenarios](./labs)
- [47 advanced technical FAQs with complete model answers](./follow-ups)

## Recommended learning sequence

Start with Chapters 1–3 to understand job discovery and orchestration. Then use Chapters 4–6 to connect execution, artifacts and reusable library design. Continue through Chapters 7–9 to learn security, recovery and incident response, and finish with Chapter 10's platform architecture. Run the labs only in a disposable Jenkins instance and rehearse the FAQ explanations aloud.

## Authoritative references

- [Jenkins user handbook](https://www.jenkins.io/doc/book/)
- [Using agents](https://www.jenkins.io/doc/book/using/using-agents/)
- [Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkins Pipeline scaling](https://www.jenkins.io/doc/book/pipeline/scaling-pipeline/)
- [Shared Libraries](https://www.jenkins.io/doc/book/pipeline/shared-libraries/)
- [Jenkins Kubernetes plugin](https://plugins.jenkins.io/kubernetes/)
- [Jenkins security](https://www.jenkins.io/doc/book/security/)
- [Backing up and restoring Jenkins](https://www.jenkins.io/doc/book/system-administration/backing-up/)
- [Configuration as Code](https://plugins.jenkins.io/configuration-as-code/)
- [Jenkins upgrade guide](https://www.jenkins.io/doc/upgrade-guide/)

[← Knowledge Base](/guides/) · [Start with chapter 1](./q1)
