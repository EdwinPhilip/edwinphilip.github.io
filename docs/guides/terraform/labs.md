# Terraform Hands-on Labs

These labs extend the module's examples with reproducible exercises, expected observations and failure analysis.

::: warning Safety
Use a disposable account/project with a cost budget and restricted IAM. Never practice replacement, state manipulation, force-unlocking, policy bypass or destructive operations on production infrastructure. Back up state and inspect plans before every apply. The exact provider and Terraform versions determine available features.
:::

## Lab 1 · Init, plan, graph and apply

**Objective:** Trace a small resource from HCL to provider APIs and state.

1. Create a separate sandbox root and configure an encrypted remote backend.
2. Declare a low-cost AWS VPC or GCP VPC resource.
3. Run:

```bash
terraform fmt -check -recursive
terraform init
terraform validate
terraform plan -out=reviewed.tfplan
terraform show reviewed.tfplan
terraform graph
terraform apply reviewed.tfplan
terraform state list
```

**Expected:** The first plan proposes creation; state records the resulting remote ID. A second unchanged refreshed plan should normally show no changes. Provider-computed IDs appear unknown until apply. The graph shows dependencies rather than source-file ordering.

**Investigate:** Which account/project did the provider authenticate to? Which provider version and lockfile checksums were chosen? Where is state stored? Who has state access?

## Lab 2 · Stable for_each identity and moved blocks

**Objective:** Demonstrate address-preserving refactors.

1. Create two inexpensive, uniquely named test resources keyed by `for_each`.
2. Remove one key and observe the plan.
3. Rename an existing resource address in HCL *without* `moved`, but do **not** apply.
4. Add a matching `moved` block and re-run plan:

```hcl
moved {
  from = aws_s3_bucket.old_name
  to   = aws_s3_bucket.new_name
}
```

**Expected:** The naive rename would ordinarily propose removal and new resource creation. A valid `moved` mapping preserves the remote identity and avoids address-only recreation.

**Safety:** The example resource names must match the sandbox HCL; do not copy it into a production root.

## Lab 3 · Drift and refresh-only

**Objective:** Distinguish desired configuration from remotely observed drift.

1. Apply a disposable tagged resource.
2. Change a noncritical tag/label manually through the cloud UI.
3. Run:

```bash
terraform plan
terraform plan -refresh-only
terraform state show RESOURCE_ADDRESS
```

**Expected:** Normal plan proposes restoring HCL-owned configuration where appropriate. Refresh-only models accepting observed values into Terraform's recorded state; it doesn't reconcile the cloud to HCL.

**Decision exercise:** Was the console change a break-glass fix, a violation or a field owned by another system? Design an audit and handoff process instead of always reverting blindly.

## Lab 4 · State backend and lock contention

**Objective:** Understand two independent layers of concurrency.

In a sandbox state, arrange for one controlled Terraform operation to hold the backend lock and attempt a second plan with a bounded timeout:

```bash
terraform plan -lock-timeout=20s
```

**Expected:** The conflicting writer waits or reports lock failure. **Do not** use `-lock=false`. Test a clean lock release when the first process exits normally.

**Questions:** Does Atlantis also hold a project lock? Could two separate states still mutate one IAM policy? Can a cloud console user bypass Terraform locking?

**Safety:** Do not deliberately kill an active production apply or practice force-unlock on shared state.

## Lab 5 · AWS network and workload identity design review

**Objective:** Model a secure VPC foundation without deploying an expensive cluster.

Draft:

- VPC with non-overlapping public/private subnets across failure domains.
- Internet gateway and public route table.
- Multi-zone or regional NAT strategy with explicit cost/availability rationale.
- Restricted IAM OIDC trust for a specific Kubernetes ServiceAccount.
- Separate network and EKS root-state interface.

Use:

```bash
terraform fmt
terraform init -backend=false
terraform validate
terraform plan
```

A successful plan requires valid credentials/API access for any real provider reads; offline validation alone doesn't prove deployability.

**Expected review:** Account ID and issuer should come from actual authorized environment configuration, not hardcoded example identities. IAM policy attachment dependencies must be modeled. No production cluster should be created for this review-only lab.

## Lab 6 · GCP VPC-native GKE and Cloud NAT

**Objective:** Develop the equivalent model using GCP primitives.

Draft:

- Global VPC and regional primary/secondary subnet ranges.
- Cloud Router and Cloud NAT covering intended egress source ranges.
- Private-access and firewall policy.
- Standard GKE with a separately managed node pool.
- Additive project IAM membership for the node service account.
- A Workload Identity Federation design for application cloud access.

**Expected:** Explain why GCP secondary Pod IP exhaustion differs from EKS ENI/IP behavior; show how node masquerading changes Cloud NAT source identity. Understand project IAM policy versus binding versus member ownership.

**Safety:** Do not deploy managed GKE clusters merely to complete the exercise unless the environment has a budget and an explicit cleanup plan.

## Lab 7 · Testing and policy gates

**Objective:** Build a PR-level quality gate.

```bash
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform test
terraform plan -detailed-exitcode
terraform show -json reviewed.tfplan > restricted-plan.json
```

The last command requires `reviewed.tfplan` to have been created by a prior `terraform plan -out=reviewed.tfplan` in an authenticated sandbox. **The JSON can contain secrets.** Do not attach it to public CI artifacts.

Write policies that:
- Reject public databases and unrestricted network ingress.
- Require ownership labels and deletion protection.
- Explicitly fail or request review when critical plan values are unknown.
- Require elevated approval for a resource replacement.

**Expected:** A policy failure reports the exact resource and suggested remediation.

## Lab 8 · Partial apply and disaster recovery tabletop

**Objective:** Practice a safe runbook without breaking live cloud infrastructure.

Use a paper exercise or mock responses:

```text
Create route table          Success
Associate first subnet      Success
Associate second subnet     Timeout
Delete old route table      Not attempted
Runner                      Terminated
```

Work through: freeze writes, capture state backup, identify effective routes, verify which API calls succeeded, restore service with a known-good association, reconcile Terraform state/HCL, and run a full reviewed plan. Differentiate code rollback, infrastructure cutback and application-data restoration.

## Lab completion checklist

- Can explain which code, state and cloud object owns every resource.
- Can identify a replacement before it is applied.
- Can show the difference between an AWS IAM trust policy and a permissions policy.
- Can explain GCP IAM authoritative versus additive Terraform resources.
- Can recover logically from a timed-out provider call without duplicate creation.
- Can defend why Terraform and GitOps have separate ownership.

[← Terraform module](./) · [45 follow-up questions](./follow-ups)
