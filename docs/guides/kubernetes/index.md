# Kubernetes Architecture & Production Operations

**A complete, practical study guide for intermediate-to-senior platform engineers.** This module explains the Kubernetes control plane, the lifecycle of a resource from API request to running workload, distributed reconciliation, placement, stateful workloads, scaling, security and production operations.

::: info Scope and safety
All marketplace and infrastructure examples are hypothetical. Exact behavior can vary by Kubernetes version, add-on, CNI/CSI implementation and managed service. Validate commands before applying them in an authorized environment. Never publish credentials, private cluster configuration or production logs.
:::

## Prerequisites

- Familiarity with Linux processes, TCP/IP, containers and basic YAML.
- Basic `kubectl`, Deployments and Services experience.
- Access to an isolated Kubernetes cluster for hands-on labs.

## Learning objectives

By the end, you should be able to trace a Deployment through admission, etcd, controllers, scheduling and kubelet; explain Raft quorum and watch recovery; implement safe reconciliation; diagnose placement, resource, probe and volume failures; design autoscaling and access controls; and upgrade a production cluster with verified compatibility and recovery boundaries.

## Chapters

1. [Architecture: control plane, nodes and failure boundaries](./q1)
2. [Complete Deployment lifecycle: apply to serving traffic](./q2)
3. [etcd, Raft, quorum, watches and recoverability](./q3)
4. [Controllers, informers, ownership and finalizers](./q4)
5. [Scheduler filtering, scoring and topology](./q5)
6. [Deployments, StatefulSets, DaemonSets, Jobs and CronJobs](./q6)
7. [Resources, QoS, throttling, eviction and priority](./q7)
8. [Probes, graceful termination, readiness gates and PDBs](./q8)
9. [Storage: PV, PVC, CSI, topology and snapshots](./q9)
10. [Autoscaling with HPA, VPA, KEDA and node provisioning](./q10)
11. [Security: authentication, RBAC, admission and isolation](./q11)
12. [Upgrades, compatibility and production troubleshooting](./q12)

## Practice

- [Six hands-on labs with commands, expected behavior and safety notes](./labs)
- [42 advanced technical FAQs](./follow-ups)

## Recommended learning sequence

Start with Chapters 1–4 to establish the control-plane model. Then study placement and workload guarantees in Chapters 5–6; use Chapters 7–10 to reason about resource, storage and scale failures. Finish with security and upgrades, and revisit the 42-question challenge bank without looking at answers. Draw the sequence diagrams and reproduce the labs in an isolated environment.

## Primary technical references

- [Kubernetes architecture](https://kubernetes.io/docs/concepts/architecture/)
- [Admission controllers](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/)
- [Scheduler framework](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/)
- [Workload controllers](https://kubernetes.io/docs/concepts/workloads/controllers/)
- [etcd documentation](https://etcd.io/docs/)
- [Pod lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Storage classes](https://kubernetes.io/docs/concepts/storage/storage-classes/)
- [HPA internals](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
- [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
- [Version skew policy](https://kubernetes.io/releases/version-skew-policy/)

[← All guides](/guides/) · [Start Chapter 1 →](./q1)
