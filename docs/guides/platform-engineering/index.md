# CI/CD, GitOps & Platform Engineering

**Module 8.** Eight comprehensive senior-level chapters on secure delivery architecture, pull-based deployment reconciliation, progressive rollout, artifact supply-chain security, federated identity, developer platforms, observability and multi-cluster governance.

::: info Public learning material
All company, repository, marketplace and cloud examples are hypothetical. Manifest fragments require appropriate controllers, versions, policies and environment-specific values. This module does not disclose or describe a particular employer's systems.
:::

## Prerequisites

Git, CI basics, containers, Kubernetes workload lifecycle, networking, IAM fundamentals, Terraform and a basic understanding of service-level objectives.

## Learning objectives

- Trace source review through reproducible or verifiable build, immutable digest and controlled promotion.
- Explain Argo CD reconciliation and handle drift, pruning and emergency intervention.
- Select canary, blue-green, rolling or feature-flag rollout strategies and business-aware gates.
- Threat-model build runners, dependencies, tokens, SBOMs, signatures and provenance.
- Isolate human, CI, CD and runtime identities using short-lived credentials and least privilege.
- Design usable self-service contracts, golden paths and safe cleanup.
- Define platform user-journey SLOs, DORA-style delivery trends and telemetry cost limits.
- Govern multi-cluster change ownership, upgrades, disaster recovery and incident response.

## Eight chapters

1. [CI/CD architecture, trust boundaries and immutable artifacts](./q1)
2. [GitOps, Argo CD, drift and ownership](./q2)
3. [Progressive delivery and controlled rollout analysis](./q3)
4. [Software supply-chain security, SBOM and provenance](./q4)
5. [Identity, secrets and environment isolation](./q5)
6. [Internal developer platforms and self-service contracts](./q6)
7. [Platform observability and engineering effectiveness](./q7)
8. [Multi-cluster governance, recovery and technical leadership](./q8)

## Practice and sequence

Begin with Q1-Q4 to establish the trusted delivery chain; continue with Q5-Q6 for security and developer experience; finish with Q7-Q8 for operating a platform as a product. Work through [eight labs](./labs) and [40 advanced technical FAQs](./follow-ups).

## Authoritative references

- [GitHub Actions security](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Argo CD user guide](https://argo-cd.readthedocs.io/en/stable/user-guide/)
- [Argo Rollouts analysis](https://argoproj.github.io/argo-rollouts/features/analysis/)
- [SLSA software supply chain framework](https://slsa.dev/)
- [Kubernetes Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [CNCF platform engineering resources](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- [DORA](https://dora.dev/)

[← All engineering guides](/guides/) · [Start Q1 →](./q1)
