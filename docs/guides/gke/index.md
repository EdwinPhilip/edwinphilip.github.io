# GKE Architecture, Networking and Production Operations

**Module 6 · Intermediate to Senior/Lead · Eight complete chapters**

This guide explores how managed Kubernetes behaves on Google Cloud: managed control plane, Standard and Autopilot operations, node pools, VPC-native Pod routing, eBPF, Gateway/Ingress with NEGs, workload identity, CSI storage, autoscaling, upgrades and recovery.

It builds on [Kubernetes architecture](../kubernetes/) and [GCP Fundamentals](../gcp/), but emphasizes the Google-specific operational integration rather than repeating generic Kubernetes concepts.

::: info Examples and version scope
All cloud projects, marketplace workloads, account identifiers and incidents are hypothetical for public engineering education. Snippets are educational and may require existing clusters, namespaces and cloud policies. Exact behavior varies with GKE version, cluster mode, release channel and enabled features. Confirm the target environment and official Google Cloud documentation before applying changes.
:::

## Prerequisites

- Kubernetes Deployments, Services, scheduler, etcd/control plane and Pod lifecycle basics.
- Subnetting, CIDR, TCP, DNS and L4/L7 load-balancing knowledge.
- Google Cloud projects, IAM, VPC, Cloud NAT and Compute Engine fundamentals.
- Read-only cluster and GCP inspection access, or a budgeted disposable sandbox.

## Learning objectives

After completing the guide, you should be able to:

- Trace the full managed control-plane-to-Pod lifecycle and identify failure boundaries.
- Choose Standard/Autopilot modes based on actual node, security and workload needs.
- Diagnose scheduling, node auto-provisioning and quota/IP capacity bottlenecks.
- Explain Pod alias IPs, ClusterIP service routing, Dataplane V2 and network policies.
- Trace Google Cloud L7 frontend to NEG Pod endpoint with LB health and readiness gates.
- Configure least-privilege GKE workload identity and separate Google IAM from Kubernetes RBAC.
- Explain CSI provisioning, zonal/regional storage and safe failure recovery.
- Design HPA/VPA/KEDA/node scaling without overloading databases or remote APIs.
- Plan GKE upgrades, observe SLOs and handle cluster or regional recovery safely.

## Chapters

1. [GKE architecture, control plane, Standard versus Autopilot](./q1)  
   End-to-end Kubernetes API/controller/scheduler/kubelet request flow; regional and zonal modes.
2. [Node pools, scheduling and capacity](./q2)  
   Resource requests, node taints/affinity, topology, ComputeClasses, quotas and autoscaler failure.
3. [VPC-native networking, Services, DNS and eBPF](./q3)  
   Pod secondary IP sizing, ClusterIP, Dataplane V2, NetworkPolicy, Pod SNAT and Cloud NAT.
4. [Ingress, Gateway API, NEGs and load-balancer health](./q4)  
   HTTPS request path, Pod-direct routing, backend health, NEG readiness gates and draining.
5. [IAM, workload identity, RBAC and Pod security](./q5)  
   Direct GKE federation, GSA impersonation, admission, isolation and 403 troubleshooting.
6. [CSI storage, StatefulSets and recoverability](./q6)  
   PVC/PV/StorageClass, WaitForFirstConsumer, zonal/regional disks, attachment and snapshots.
7. [Autoscaling, resource management and latency](./q7)  
   HPA math, VPA feedback, throttling, memory pressure and downstream capacity.
8. [GKE upgrades, production incidents and disaster recovery](./q8)  
   Release channels, node rolling upgrades, PDBs, observability, SLOs and recovery runbooks.

## Practice

- [40 challenging technical follow-ups with complete model answers](./follow-ups)
- [Eight labs and tabletop exercises with expected observations and safety notes](./labs)

## Recommended study sequence

Study Q1–Q2 for architecture, scheduling and node operations. Q3–Q4 build packet-by-packet intuition from internal Pod routing to external client load balancing. Q5–Q6 cover identities, security and storage, then Q7–Q8 connect autoscaling and upgrades to measurable reliability. Finish by explaining each lab incident aloud before opening the model answers.

## Verified reference documentation

- [GKE modes of operation](https://cloud.google.com/kubernetes-engine/docs/concepts/choose-cluster-mode)
- [GKE control plane network isolation](https://cloud.google.com/kubernetes-engine/docs/concepts/network-isolation)
- [GKE cluster autoscaler](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler)
- [VPC-native clusters / Pod CIDRs](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips)
- [GKE Dataplane V2](https://cloud.google.com/kubernetes-engine/docs/concepts/dataplane-v2)
- [GKE load balancing and NEGs](https://cloud.google.com/kubernetes-engine/docs/concepts/about-load-balancing)
- [GKE Gateway API](https://cloud.google.com/kubernetes-engine/docs/concepts/gateway-api)
- [Ingress backend health](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress-routing-security)
- [Workload Identity Federation for GKE](https://cloud.google.com/kubernetes-engine/docs/concepts/workload-identity)
- [PersistentVolume and CSI](https://cloud.google.com/kubernetes-engine/docs/concepts/persistent-volumes)
- [GKE release channels](https://cloud.google.com/kubernetes-engine/docs/concepts/release-channels)

[← All guides](/guides/) · [Begin Module 6 Q1 →](./q1)
