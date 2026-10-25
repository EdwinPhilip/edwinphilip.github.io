# Google Cloud Fundamentals and Production Engineering

**Module 5 · Intermediate to senior platform/cloud engineering guide · Eight complete chapters**

Google Cloud has familiar concepts for engineers coming from other providers, but its resource hierarchy, global VPC networking, project policies, IAM federation and load-balancing architecture require their own mental model. This field guide develops those fundamentals from first principles, then connects them to operational debugging and reliable system design.

::: info Public education and accuracy
Examples use fictional marketplace infrastructure and placeholder resource names. They are teaching designs, not claims about a real production environment. Google Cloud services change rapidly: verify version, region, account policy, release stage, CLI syntax and pricing before deployment. Code snippets are educational and sometimes require prerequisites discussed in their chapters.
:::

## Prerequisites

Familiarity with Linux and TCP/IP, service deployment and a basic cloud model. Kubernetes and Terraform knowledge help with the examples but are not required to follow all conceptual material. For labs use a controlled Google Cloud sandbox with an approved budget, IAM rights and a cleanup plan. Read-only commands are sufficient for most investigations.

## What you will learn

- Explain organization, folders, projects, billing, API enablement, quotas and policy inheritance.
- Use IAM roles, service accounts, ADC and federation without long-lived keys.
- Design VPC/subnet, Shared VPC, firewall and hybrid routing based on actual resource scopes.
- Trace HTTPS ingress, backend health, DNS and Cloud NAT egress end to end.
- Operate Compute Engine templates, managed instance groups and autoscaling.
- Choose object storage, artifacts, relational transactions, messaging, caches and analytics deliberately.
- Correlate Cloud Monitoring, Logging, Trace and Audit Logs to a user-facing SLO.
- Evaluate multi-zone/multi-region reliability, disaster recovery, cost and security trade-offs.

## Eight main chapters

1. [Resource hierarchy, projects, governance and quotas](./q1): Administrative hierarchy, org policy, billing, API operations, failure cases.
2. [IAM, service accounts, ADC and workload identity](./q2): Authentication/authorization, token flow, GKE/CI federation, 403 diagnosis.
3. [VPC, Shared VPC, routes and firewall](./q3): Global VPC, regional subnets, firewall, hybrid networking and packet tracing.
4. [Cloud NAT, Cloud DNS and load balancing](./q4): HTTPS request sequence, NAT outbound mapping, proxy types, DNS and troubleshooting.
5. [Compute Engine and managed instance groups](./q5): Templates, VM boot, regional capacity, rolling updates, Spot and autohealing.
6. [Cloud Storage, Artifact Registry and data services](./q6): Objects, images, transactions, Pub/Sub idempotency and product selection.
7. [Observability, SLOs and incident diagnosis](./q7): Metrics, logs, traces, audit evidence, percentile and burn-rate reasoning.
8. [Architecture, security, DR and costs](./q8): Hypothetical marketplace design, failure domains, regional incident, trade-offs.

## engineering reference and hands-on practice

- [40 advanced technical FAQs](./follow-ups)
- [Eight hands-on and tabletop labs, including expected observations and safety controls](./labs)

## Study order

Start with hierarchy and identity (Q1–Q2), which explains where permissions apply. Then work through network design and packet flow (Q3–Q4). Study compute and data guarantees (Q5–Q6), and finish with service-level observability and architecture decisions (Q7–Q8). Work through labs before answering the entire 40-question bank without notes.

## AWS-to-GCP quick map

| AWS concept | GCP concept | Caution |
| --- | --- | --- |
| Organizations / OUs / accounts | Organization / folders / projects | Not one-to-one isolation or inheritance |
| Regional VPC + zonal subnets | Global VPC + regional subnets | Different network scope |
| IAM roles + STS | IAM principals/roles + federation/impersonation | Different trust model |
| ALB / NLB | Application / Network Load Balancers | Product classes and datapaths differ |
| NAT Gateway | Public NAT | Port and translation models differ |
| EC2 + ASG | Compute Engine + MIG | Regional distribution semantics |
| S3 / ECR | Cloud Storage / Artifact Registry | Location, class and IAM details differ |
| RDS / Aurora | Cloud SQL and other DB products | HA/replication options differ |
| CloudWatch / X-Ray | Monitoring / Logging / Cloud Trace | Query/metric models vary |

## Authoritative references

- [Google Cloud Resource Manager hierarchy](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy)
- [Cloud IAM overview](https://cloud.google.com/iam/docs/overview)
- [Workload Identity Federation](https://cloud.google.com/iam/docs/workload-identity-federation)
- [Google VPC and Shared VPC](https://cloud.google.com/vpc/docs/vpc)
- [Public NAT](https://cloud.google.com/nat/docs/public-nat)
- [Cloud Load Balancing](https://cloud.google.com/load-balancing/docs/load-balancing-overview)
- [Compute Engine managed instance groups](https://cloud.google.com/compute/docs/instance-groups)
- [Cloud Storage](https://cloud.google.com/storage/docs/introduction)
- [Cloud SQL](https://cloud.google.com/sql/docs)
- [Cloud Monitoring](https://cloud.google.com/monitoring/docs/monitoring-overview)
- [Google Cloud architecture framework](https://cloud.google.com/architecture/framework)

[← All modules](/guides/) · [Start with Q1 →](./q1)
