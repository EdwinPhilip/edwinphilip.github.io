# Terraform Architecture, Internals, AWS and GCP

**Module 4: An end-to-end field guide for intermediate-to-senior platform, infrastructure and cloud engineers.**

Terraform is most useful when an engineer understands more than resource syntax. This module explains the execution graph, resource identity and state, cloud provider APIs, HCL design, safe refactoring, IAM, security policy, CI and partial-failure recovery. AWS and Google Cloud examples are parallel but preserve important provider differences.

::: info Public engineering examples
Cloud names, service IDs and incidents in this guide are illustrative. They are not reports of a particular employer's infrastructure. Version-specific provider resource schemas, Terraform language features and cloud service support should be checked against the deployed versions.
:::

## Prerequisites

- Basic infrastructure-as-code, Git and command-line usage.
- Familiarity with cloud networking, IAM and Kubernetes concepts.
- Read-only cloud access or a disposable AWS/GCP sandbox for exercises.
- Prior experience reading Terraform plans is helpful but not required.

## Learning objectives

By completing the guide, you should be able to:

- Explain Terraform Core, provider plugins, state and the complete plan/apply lifecycle.
- Reason about graph dependencies, unknown values, replacements and partial success.
- Design maintainable typed HCL and reusable versioned modules.
- Operate secure state backends and safely coordinate concurrent writers.
- Provision AWS and GCP foundations with provider-appropriate networking and IAM.
- Refactor/import resources without unintended recreation.
- Diagnose drift, API errors, provider incompatibility and state recovery scenarios.
- Build a secure Terraform PR pipeline with tests, policy checks and cost review.
- Design low-friction but governable infrastructure self-service for product teams.

## Chapters

1. [Terraform fundamentals and execution architecture](./q1)  
   HCL, provider plugins, backend state, init/plan/apply, declarative versus imperative operations.
2. [Dependency graph and apply internals](./q2)  
   Ordering, unknown values, parallelism, replacement and partial failure.
3. [HCL expressions and resource identity](./q3)  
   Variables, collections, data sources, for_each/count, dynamic and lifecycle.
4. [State, backends and locking](./q4)  
   S3/GCS, concurrency, sensitive state and state recovery.
5. [Providers, modules and multi-environment architecture](./q5)  
   Aliases, root/child configuration, versioning, accounts/projects and workspaces.
6. [Terraform on AWS](./q6)  
   VPC, subnets, NAT, IAM trust, EKS and database lifecycle.
7. [Terraform on Google Cloud](./q7)  
   Global VPC, Pod secondary ranges, Cloud NAT, IAM ownership, GKE and federation.
8. [Import, refactoring and state migration](./q8)  
   Import, moved, removed, module moves and cross-state handoffs.
9. [Drift, failures and disaster recovery](./q9)  
   Lifecycle ownership, partial apply, refresh-only, state recovery.
10. [Security, secrets and policy](./q10)  
    OIDC federation, provider trust, plan-time checks and cost governance.
11. [CI/CD, Atlantis, GitOps and testing](./q11)  
    PR plans, approval, two different locks, test and apply safety.
12. [Enterprise Terraform platform and incident response](./q12)  
    Platform APIs, ownership, risk and production network recovery.

## Interview preparation and practice

- [All 45 challenging follow-up questions and complete model answers](./follow-ups)
- [Eight hands-on and tabletop labs](./labs)

## Recommended learning sequence

Start with Q1-Q4 to understand Terraform's execution and state model. Study Q5 before using Q6-Q7 provider-specific examples. Then work through lifecycle and safe change topics in Q8-Q11. Finish with the lead-level system design in Q12, execute the labs in a sandbox and rehearse the follow-up bank aloud.

## Authoritative references

- [Terraform language and expressions](https://developer.hashicorp.com/terraform/language)
- [State and locking](https://developer.hashicorp.com/terraform/language/state)
- [S3 backend](https://developer.hashicorp.com/terraform/language/backend/s3)
- [GCS backend](https://developer.hashicorp.com/terraform/language/backend/gcs)
- [Module authoring and refactoring](https://developer.hashicorp.com/terraform/language/modules/develop)
- [Terraform testing](https://developer.hashicorp.com/terraform/language/tests)
- [HashiCorp AWS provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [HashiCorp Google provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [AWS EKS](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [GKE networking](https://cloud.google.com/kubernetes-engine/docs/concepts/alias-ips)
- [Cloud NAT](https://cloud.google.com/nat/docs/overview)

[← All guides](/guides/) · [Begin Q1 →](./q1)
