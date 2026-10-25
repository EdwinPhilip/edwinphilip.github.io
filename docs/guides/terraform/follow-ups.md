# 45 Difficult Terraform Interview Follow-ups

These questions and model answers cover every chapter, including cloud-specific failure modes. Answers reflect general Terraform principles; validate provider and CLI behavior against the versions you deploy. All service names and incidents are hypothetical.

## 1. Why does Terraform need state if HCL already describes infrastructure?

**Topic:** Core and graph

**Model answer:** HCL describes desired objects but does not uniquely identify the remote object managed by a logical address. State binds addresses to provider IDs, attributes and lifecycle metadata. Without it, Terraform would need to infer ownership from cloud APIs, often ambiguously. State is foundational, not merely a performance cache.

## 2. Does terraform plan guarantee the proposed operations will succeed at apply?

**Topic:** Core and graph

**Model answer:** No. IAM permissions, quotas, immutable API constraints and provider validation can fail later. Remote resources may change between plan and apply. A saved plan preserves the proposed operations but does not freeze the external cloud environment or make API calls atomic.

## 3. What does known after apply mean, and why can it break for_each?

**Topic:** Core and graph

**Model answer:** It means an expression depends on an attribute unavailable until a provider operation executes. Terraform can propagate unknown attribute values, but it must enumerate resource instance addresses during planning. Use stable map keys from configuration and put provider-generated IDs in values, not instance keys.

## 4. How does Terraform know which resources may execute concurrently?

**Topic:** Core and graph

**Model answer:** Core builds a directed graph from resource references, explicit depends_on, lifecycle and other graph dependencies. Nodes whose prerequisites are complete may run concurrently within the parallelism limit. The order of HCL blocks does not enforce order. Use explicit dependency only when no direct reference represents a real prerequisite.

## 5. Why is excessive depends_on a problem?

**Topic:** Core and graph

**Model answer:** It creates unnecessary edges, restricts parallelism and may defer evaluation of attributes until apply. It can also conceal the true dependency compared with a direct expression. Reserve it for real side-effect/order requirements, such as IAM policy attachments needed before provisioning a dependent resource.

## 6. Why can a failed apply leave infrastructure created?

**Topic:** Core and graph

**Model answer:** Terraform performs individual provider API operations, not a cross-cloud transaction. Successful operations may remain and be recorded while a later action fails. A cloud API may also complete a request despite a client timeout. Inspect real resources and recorded IDs before retrying or importing.

## 7. Does create_before_destroy guarantee zero downtime?

**Topic:** Core and graph

**Model answer:** No. It changes replacement ordering only where coexistence is possible. Unique names, attached volumes, incompatible endpoints and quotas may make creating a replacement first impossible. It does not shift traffic, replicate data or drain active requests. Design these steps explicitly.

## 8. Why prefer for_each over count for named infrastructure?

**Topic:** HCL

**Model answer:** for_each gives named instance addresses such as aws_subnet.private["zone-a"]. With a count-based list, deleting a middle item shifts indexes and can cause unintended replacements. Use count for ordinal/interchangeable instances and for_each with stable known keys when resources have persistent identities.

## 9. Can dynamic generate arbitrary resources or provider configurations?

**Topic:** HCL

**Model answer:** No. A dynamic block expands supported nested blocks within a resource or other schema-aware context. It does not generate root-level provider blocks or replace resource-level for_each. Prefer straightforward resources for maintainability when the API supports them.

## 10. Why might a data source be read during apply instead of plan?

**Topic:** HCL

**Model answer:** If a data source's inputs depend on unknown apply-time values or changing managed resources, its evaluation may be deferred. The plan then has unknown outputs and can fail if those outputs determine for_each instance keys. Use direct references for objects managed together and stable identifiers for separately owned resources.

## 11. Will state locking prevent conflict if separate roots own the same IAM policy?

**Topic:** State

**Model answer:** No. State locks only coordinate writers using the same backend state. Separate roots can concurrently update one remote policy and overwrite each other's changes. Fix this through exclusive ownership or a deliberately additive provider resource model, not more lock-timeout flags.

## 12. Why prefer S3 native lockfiles over DynamoDB for new backends?

**Topic:** State

**Model answer:** Recent Terraform S3 backend versions support use_lockfile=true. DynamoDB-backed locking is deprecated, although an existing implementation may require a controlled migration period. Verify Terraform version support, S3 permissions for the state object and .tflock file, and safe coordination before changing an active backend.

## 13. How do you safely remove a stale lock after a CI crash?

**Topic:** State

**Model answer:** Identify its owner and run, verify the runner and child provider processes are no longer active, and check cloud-side operations. Then use the exact reported lock ID for authorized force-unlock. Reconcile state and cloud reality before retrying, because a dead runner may have partially completed an apply.

## 14. Why can terraform_remote_state be a security problem?

**Topic:** State

**Model answer:** Although a consumer references outputs, backend read access often exposes the complete raw state snapshot, including sensitive attributes. It also couples consumers to another team's internal state layout. Publish narrowly approved identifiers through SSM, a secured catalog or an equivalent external interface where appropriate.

## 15. Why is restoring yesterday's state not the same as restoring infrastructure?

**Topic:** State

**Model answer:** Cloud objects may have been created, replaced or deleted after the snapshot. Old state may refer to obsolete IDs or omit live resources, producing dangerous create/delete plans. Freeze writes, inventory remote objects, reconcile bindings and review a full plan before applying.

## 16. Should every service have a separate Terraform state?

**Topic:** State

**Model answer:** Not automatically. One giant state causes long plans, lock contention and broad privileges, but excessive fragmentation creates brittle cross-state dependencies. Define boundaries around ownership, failure blast radius, change cadence and independently operable lifecycles. Publish stable interfaces between roots.

## 17. How are required_providers and provider configuration different?

**Topic:** Providers

**Model answer:** required_providers declares plugin source and version constraints. provider blocks configure instances of that plugin such as region, project and credentials. Child modules normally declare requirements while root modules own credentials and provider configurations. This keeps reusable modules portable and accounts explicit.

## 18. Do child modules automatically inherit aliased providers?

**Topic:** Providers

**Model answer:** Aliased provider configurations must be passed explicitly where required through the module providers map, with configuration_aliases declared in child requirements if used there. Relying on implicit account/region selection can deploy resources to the wrong target. Test aliased provider wiring in module examples.

## 19. Why can a provider upgrade cause replacement with unchanged HCL?

**Topic:** Providers

**Model answer:** A provider may change normalization, schema defaults, ForceNew/replacement semantics, API handling or state migrations. Terraform computes the plan with that provider's schema. Pin versions, review release notes and run a plan against representative state before upgrading production.

## 20. Should a reusable child module embed cloud credentials?

**Topic:** Providers

**Model answer:** No in the usual design. Roots select provider configurations and identities; children declare required providers and accept explicit provider mappings. Embedded credentials make module reuse, testing and cross-account deployments fragile and can create security boundary confusion.

## 21. Why can an EKS node group fail even after its IAM role exists?

**Topic:** AWS

**Model answer:** The role's required policy attachments may not be complete and IAM propagation can take time. Referencing role ARN guarantees role dependency but not necessarily policy attachment order. Model missing prerequisites with depends_on where justified, and inspect actual trust, permissions, subnet connectivity and capacity.

## 22. Why separate VPC, EKS and RDS into different states?

**Topic:** AWS

**Model answer:** They have different lifecycle, risk and access requirements. A node-pool update should not need permission to delete a production database or shared route table. State separation reduces blast radius and lock contention, provided stable network and identity interfaces are published.

## 23. Can Terraform and AWS Load Balancer Controller independently own the same ALB?

**Topic:** AWS

**Model answer:** Not safely if each claims authoritative control of the same resource or fields. They can repeatedly undo each other's changes. Prefer Terraform for foundational infrastructure and the controller for ALBs created from Kubernetes resources, or explicitly design one owner for each shared component.

## 24. Why does ASG desired_capacity drift after autoscaling?

**Topic:** AWS

**Model answer:** An autoscaling controller intentionally changes the runtime desired count while Terraform configuration retains a fixed value. Determine which system should own that field. A narrowly scoped ignore_changes can avoid conflict while preserving Terraform ownership of limits, launch templates and other settings.

## 25. How do you protect a production RDS instance from accidental replacement?

**Topic:** AWS

**Model answer:** Use cloud deletion protection, IAM restriction, backups/PITR, tested restores, destructive-plan checks and Terraform prevent_destroy where appropriate. Inspect the exact attribute forcing replacement and design a migration/cutover. Neither create_before_destroy nor a Git revert guarantees data preservation.

## 26. Why does GCP VPC module design differ from AWS VPC modules?

**Topic:** GCP

**Model answer:** GCP VPC networks are global and their subnets regional; AWS VPCs are regional and subnets zonal. Shared VPC, alias secondary IP ranges and project boundaries affect GKE. Modules should express these real differences rather than impose identical fields on incompatible provider models.

## 27. What is dangerous about google_project_iam_policy?

**Topic:** GCP

**Model answer:** It is authoritative over the project's IAM policy and can replace bindings maintained by other teams. google_project_iam_binding owns membership for a role binding; google_project_iam_member is additive for a particular membership. Establish clear ownership and avoid overlapping authoritative resources across states.

## 28. Why manage GKE node pools separately from cluster?

**Topic:** GCP

**Model answer:** Node pools change machine types, autoscaling, operating systems, upgrades and repair policy more frequently than the cluster control plane. Separate Terraform resources clarify lifecycle and reduce unintended coupling. Avoid managing node_count in a way that fights cluster autoscaling; verify provider/version behavior.

## 29. How can a GKE cluster create successfully but fail to scale later due to networking?

**Topic:** GCP

**Model answer:** VPC-native Pod secondary ranges allocate blocks to nodes. A range may be sufficient for initial nodes but too small for the intended maximum node/pod density. Cloud quotas, firewall and NAT settings can also limit scale. Calculate address and egress capacity for peak demand before rollout.

## 30. Why can Cloud NAT egress fail with healthy nodes and spare CPU?

**Topic:** GCP

**Model answer:** The constraint may be allocated source ports, NAT IP capacity, source-IP masquerading, subnet coverage, firewall/routing or a remote destination. Cloud NAT's allocation model differs from AWS NAT Gateway. Inspect NAT error metrics/logs, observed source IP and connection churn before increasing compute replicas.

## 31. Does Workload Identity Federation grant Kubernetes cluster-admin?

**Topic:** GCP

**Model answer:** No. Google IAM permissions to Cloud APIs and Kubernetes RBAC permissions to the API server are separate. A Pod can read Cloud Storage without being able to list or create Kubernetes Pods. Review both identity and authorization systems independently.

## 32. Explain import, moved and removed blocks.

**Topic:** Refactoring

**Model answer:** Import binds a pre-existing remote object to a Terraform address. Moved maps an old Terraform address to a new one while preserving its remote binding. Removed deliberately relinquishes management, optionally keeping the cloud object with destroy=false. They solve different lifecycle operations; review plans for every one.

## 33. Can a moved block migrate between independent backends?

**Topic:** Refactoring

**Model answer:** No. moved handles address changes within the relevant state/configuration context. A cross-state move requires coordinated state transfer or import-and-handoff, exclusive access to both roots, and proof that only the destination will own the object. Replan both roots before resuming CI.

## 34. Why can renaming a module trigger destruction?

**Topic:** Refactoring

**Model answer:** The module path is part of every nested resource address. Changing module.network to module.vpc changes addresses even when cloud attributes remain identical. Use appropriate moved declarations, keep compatibility mappings in released modules and test the upgrade on existing state.

## 35. Should you immediately revert an emergency console firewall change?

**Topic:** Drift and recovery

**Model answer:** First establish its purpose, current customer impact, security exposure and ownership. Legitimate emergency mitigation may need to remain until the incident ends and then be represented in HCL. Unauthorized exposure should be remediated promptly. Drift needs explicit review, not blind overwrite or silent acceptance.

## 36. Can you safely retry an API timeout during creation?

**Topic:** Drift and recovery

**Model answer:** Not without checking. The remote API may have created the object but the provider missed the response, leaving it untracked. Inspect cloud IDs and timestamps, determine whether state contains the object, import valid orphans and replan before attempting more creation.

## 37. Can a Git revert restore a destroyed database?

**Topic:** Drift and recovery

**Model answer:** No. A Git revert changes desired HCL and may only trigger creation of a fresh empty database. Data recovery relies on snapshots, PITR, replication and tested restore procedures. Distinguish code rollback, infrastructure rollback and restoration of application data.

## 38. Does sensitive=true prevent password storage in state?

**Topic:** Security

**Model answer:** No. It redacts certain human-readable displays, but plan and state artifacts can retain values. Protect the backend and artifacts; where provider/resource support exists use Terraform ephemeral inputs and write-only attributes. Validate these semantics for the actual Terraform and provider versions.

## 39. Why do provider plugins create supply-chain risk?

**Topic:** Security

**Model answer:** They execute with access to credentials, state and infrastructure inputs and can make API calls. A malicious provider can exfiltrate secrets or change cloud resources. Pin sources and versions, verify checksums, use approved distribution, sandbox CI and constrain permissions.

## 40. Is terraform validate enough for production approval?

**Topic:** Security

**Model answer:** No. It validates syntax and provider schema but not cloud quotas, current IAM, network exposure, cost, runtime security or product correctness. Add refreshed plan reviews, security/cost policy, appropriate integration tests and stronger approvals for destructive changes.

## 41. How should plan-time policy handle unknown public-exposure values?

**Topic:** Security

**Model answer:** Treat unknown explicitly. A policy that simply checks after.publicly_accessible == true may silently allow an unknown value. Reject, require review or enforce a separate invariant that proves safety; protect plan JSON because it can expose sensitive data.

## 42. Difference between Atlantis project lock and backend state lock?

**Topic:** Delivery

**Model answer:** Atlantis serializes relevant PR/project workflow operations; the backend controls state writers using that backend. Other automation can bypass Atlantis, so backend locking remains necessary. Neither protects against separate states or console changes to one cloud resource.

## 43. Why can an approved plan become unsafe the next day?

**Topic:** Delivery

**Model answer:** Code revision, tracked state and cloud observations can change. A saved plan may fail as stale when state changes, but doesn't catch every external race. Bind approvals to commits, shorten plan lifetime, serialize state writers and replan/reapprove if material conditions change.

## 44. How would you divide Terraform and Argo CD ownership?

**Topic:** Delivery

**Model answer:** Terraform typically owns durable cloud and cluster foundations such as VPCs, IAM and managed control planes. GitOps can own fast-changing in-cluster application objects and releases. The precise split may vary, but two independent reconcilers should not claim the same resource fields. Use explicit handoffs for bootstrapped add-ons.

## 45. How do you measure whether a Terraform platform is successful?

**Topic:** Lead architecture

**Model answer:** Track safe infrastructure lead time, failed-apply rates, drift remediation, ownership coverage, policy compliance, developer support toil, module adoption and cloud cost. High module count or large Terraform code volume is not success. The desired outcome is low-friction routine changes and visible, recoverable high-risk changes.


[← Terraform module](./)
