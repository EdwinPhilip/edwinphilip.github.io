# Cloud Architecture, Reliability & System Design

**Module 7.** An eight-chapter field guide for senior platform engineers designing and operating reliable cloud services. It covers user-facing SLOs, failure domains, cascading failures, consistency, multi-region recovery, capacity, caching and incident leadership.

::: info Public learning material
All marketplace/SaaS examples are fictional and designed for learning. Provider limits, API behavior, monitoring schema and feature support depend on the deployed version and service configuration. No example represents a verified private infrastructure deployment.
:::

## Prerequisites

Linux and container fundamentals; networking and TLS; Kubernetes workloads and scheduling; database transactions; familiarity with one cloud provider.

## Learning objectives

- Define business-outcome SLIs, realistic SLOs and error-budget policies.
- Design around node, zone, region, shared-dependency and human-error failure domains.
- Prevent cascading failure using deadlines, bulkheads, bounded queues, backpressure and safe retries.
- Preserve financial/event correctness through idempotency, authoritative storage and an outbox.
- Choose active-passive or active-active recovery only after defining RPO/RTO and fencing.
- Forecast peak capacity and include autoscaling delay plus downstream saturation.
- Design cache degradation that never violates authoritative write semantics.
- Lead an evidence-driven incident, verify recovery and invest in tested corrective actions.

## Eight chapters

1. [SLIs, SLOs, error budgets and reliability governance](./q1)
2. [High availability, multi-zone design and failure domains](./q2)
3. [Deadlines, retries, circuit breaking and backpressure](./q3)
4. [Transaction correctness, consistency and event delivery](./q4)
5. [Multi-region architecture, disaster recovery and RPO/RTO](./q5)
6. [Peak capacity, autoscaling and load testing](./q6)
7. [Data-layer reliability, caching and degradation](./q7)
8. [Incident leadership, game days and cost trade-offs](./q8)

## Practice and sequence

Read Q1-Q2 to define what must work, Q3-Q4 to preserve behavior under partial failure, Q5-Q7 to build resilient infrastructure/data paths, and Q8 to practice operating the design. Then complete [seven labs](./labs) and rehearse [40 challenging follow-ups with model answers](./follow-ups).

## Authoritative references

- [Google SRE book](https://sre.google/sre-book/table-of-contents/)
- [Google SRE workbook: alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)
- [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- [Kubernetes scheduling and topology](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/)
- [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

[← All engineering guides](/guides/) · [Start Q1 →](./q1)
