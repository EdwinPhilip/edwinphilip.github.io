# GCP · 40 Advanced Technical FAQs

These questions extend the eight main chapters. Answers are designed for a senior platform/cloud engineer and explain mechanisms, debugging evidence and trade-offs, not just definitions.

::: info Context
Examples are hypothetical. Verify exact APIs, features and CLI commands against the deployed Google Cloud configuration and current official documentation.
:::

## 1. How does IAM inheritance work across organization, folder and project?

**Topic:** Resource hierarchy

**Explanation:** An allow binding on an ancestor can grant effective permissions on eligible descendants. A narrower project policy does not automatically remove an ancestor allow. Deny policies, IAM Conditions and Organization Policy constraints can further limit access. Inspect the complete resource ancestry and effective permissions, not only the project IAM policy. This is why folder-level Editor and Owner grants are particularly dangerous and should be avoided. Use groups, scoped predefined/custom roles and least privilege.

## 2. Is a Google Cloud project equivalent to an AWS account?

**Topic:** Resource hierarchy

**Explanation:** Not exactly. Both support administrative boundaries, IAM, quota and billing attribution, but GCP projects live in a hierarchy under an organization/folder, and can share global VPC networks through Shared VPC host and service project attachments. AWS account and VPC models differ significantly. I wouldn't apply an AWS Organizations landing zone layout to GCP without considering policy inheritance, host-network ownership and service-specific resource scopes.

## 3. A project has billing enabled and IAM permissions, but VM creation fails. What else could block it?

**Topic:** Resource hierarchy

**Explanation:** Compute Engine API enablement, regional or machine-family quota, zonal capacity exhaustion, organization policy denying an external IP or machine configuration, request validation, or a disabled/restricted service could block creation. Inspect the exact Compute Engine operation error first. Quota and physical capacity are different: an approved quota increase does not guarantee VMs are available in a specific zone.

## 4. Does a global VPC make all infrastructure globally available?

**Topic:** Resource hierarchy

**Explanation:** No. The VPC network resource is global, but its subnets are regional and VM instances zonal. A regional database or a node pool can still fail with its location. Interregional data movement still incurs latency and possible charges. A globally scoped network is an administrative/routing design, not automatic multi-region replication, data durability or application failover.

## 5. What happens if the organization deletes a project by mistake?

**Topic:** Resource hierarchy

**Explanation:** Project deletion can disable resources and initiate a recovery-limited deletion lifecycle. The precise restoration window and resource effects are subject to current Google policies. Immediately stop other automation, contact authorized project administrators, check project recovery procedures and retain audit evidence. A project restoration may not be sufficient to recover every application dependency or independently removed dataset; backups and recovery drills remain essential.

## 6. What is the difference between Google IAM roles and a service account?

**Topic:** IAM and identity

**Explanation:** A service account is a principal identity, while a role is a set of permissions. IAM policy bindings associate roles with principals at a resource or ancestor scope. Creating a service account does not grant it storage access or Kubernetes RBAC. Create a dedicated principal for each relevant workload trust boundary and assign only the permissions needed on the narrowest resource.

## 7. Explain ADC versus gcloud auth login.

**Topic:** IAM and identity

**Explanation:** gcloud auth login configures credentials for gcloud CLI operations; Application Default Credentials are discovered by Google client libraries through their documented lookup mechanism, including local ADC files or metadata credentials. The identities can differ on a developer laptop. In production, prefer metadata-based short-lived credentials or federation, rather than downloading long-lived JSON keys. A 403 investigation must identify the actual runtime principal, not assume the active gcloud account is used by the application.

## 8. Why can a GKE Pod access Cloud Storage while it lacks Kubernetes API access?

**Topic:** IAM and identity

**Explanation:** Workload Identity Federation or service-account impersonation can give its Google principal bucket-level IAM rights, while Kubernetes RBAC separately controls verbs against the Kubernetes API server. Neither grants the other automatically. The Pod may call storage.objects.get yet receive Forbidden when listing Pods. Review Google IAM principal bindings and KSA Kubernetes RBAC independently, including who can create Pods with the KSA.

## 9. A valid OIDC assertion from CI fails to impersonate a Google service account. Where do you look?

**Topic:** IAM and identity

**Explanation:** Check the configured workload identity pool/provider, issuer, audience, token subject/attributes and attribute conditions. Verify the external principal matches the trust binding on the intended service account and has the appropriate workload identity user permission. Check the project number in qualified principal identifiers. Test the resulting principal without exposing token contents. A valid signed OIDC token alone doesn't imply authorization to impersonate arbitrary Google service accounts.

## 10. A workload receives 403 even after Storage Object Viewer was assigned. Why?

**Topic:** IAM and identity

**Explanation:** The request might originate from a different principal, target a different bucket/project, require an additional permission such as list instead of get, hit an IAM condition or deny, or be blocked by VPC Service Controls or other storage policies. Also allow for IAM propagation. Inspect a single failed method/resource, actual token principal, bucket IAM and audit logs/Policy Troubleshooter. Granting Owner to silence the error hides the cause and creates a security risk.

## 11. What is the scope of a VPC versus a subnet in Google Cloud?

**Topic:** VPC and Shared VPC

**Explanation:** A VPC network and its associated global routing/firewall configuration are global resources. Subnets are regional and supply IP ranges to eligible instances in zones of that region. Secondary alias-IP ranges can serve GKE Pods. This differs from AWS regional VPC plus zonal subnets. Location scope affects CIDR planning, resource ownership, troubleshooting and failure domains.

## 12. Does a service project own the Shared VPC subnet used by its VMs?

**Topic:** VPC and Shared VPC

**Explanation:** No. The Shared VPC host project owns the network and subnets. An attached service project hosts eligible consumer resources, subject to subnet-use grants and other IAM permissions. This centralizes network governance but creates cross-project dependencies. Diagnose a creation failure by checking host/service attachment, host subnet permissions, service project IAM, org constraints, subnet region and remaining address capacity.

## 13. How can two VMs on the same VPC fail to communicate?

**Topic:** VPC and Shared VPC

**Explanation:** The destination may not be listening, ingress/egress firewall or hierarchical policy may deny, the source/destination may have unexpected addresses, a route or policy path may be incompatible, or guest OS firewall/security may block. Even same-VPC location doesn't override policy. Inspect actual NIC/IP, routes, both directions of policy, guest listener and Connectivity Tests; sampled Flow Logs alone are not conclusive.

## 14. Is Private Google Access equivalent to public Cloud NAT?

**Topic:** VPC and Shared VPC

**Explanation:** No. Private Google Access enables eligible resources without external IPv4 addresses to reach supported Google APIs/services through configured access paths. Public NAT translates eligible outbound flows to external destinations. Neither automatically exposes an inbound public service. A VM reading Cloud Storage may work with Private Google Access while HTTPS to a third-party API fails without an appropriate egress path.

## 15. A VPN tunnel is up but applications cannot reach on-premises. What do you test?

**Topic:** VPC and Shared VPC

**Explanation:** Tunnel state is only one layer. Check Cloud Router BGP session, advertised/imported prefixes, dynamic route priorities, VPC/guest firewall, overlapping CIDRs, return routes, MTU/fragmentation and DNS. Cloud Router exchanges routing information but isn't in the packet path as a traditional transit VM. Use packet/source-destination evidence and Connectivity Tests, not treat a green tunnel as end-to-end success.

## 16. Why can Cloud NAT run out of connections even with idle CPUs?

**Topic:** NAT DNS load balancing

**Explanation:** Cloud NAT depends on available translated IP/port mappings and allocation policy, not just compute resources. Many short-lived flows, concentrated remote IP:port destinations, insufficient NAT addresses or too little allocated port capacity can cause new connections to fail. Measure NAT drop/port metrics, number of source VMs, SNAT behavior and connection churn. Connection reuse and bounded concurrency can reduce pressure; increasing replicas may worsen it.

## 17. Does Cloud NAT accept unsolicited inbound requests from the public internet?

**Topic:** NAT DNS load balancing

**Explanation:** No. Public NAT is primarily outbound source translation for eligible instances and their return traffic. It doesn't by itself create a public listener on a VM without external IP. To expose a service, configure the appropriate external load balancer, proxy or other supported ingress endpoint, plus DNS, certificates, backend health and security controls.

## 18. A public DNS answer works, but a VM resolves an internal address. Is this necessarily a bug?

**Topic:** NAT DNS load balancing

**Explanation:** Not necessarily. Cloud DNS private zones, response policies or forwarding can implement split-horizon resolution for associated VPCs, while public authoritative zones answer external clients. Validate which resolver the VM uses, zone visibility, DNS policy and query name. A private NXDOMAIN doesn't guarantee fallback to public records, and negative caching can preserve old failures until TTL expiry.

## 19. Why can an HTTPS load balancer return 502 while the Pod reports Ready?

**Topic:** NAT DNS load balancing

**Explanation:** GKE Pod readiness and the Google Cloud backend service's health can be different states. Consider missing NEG membership, wrong backend port/protocol, failed external health checks, backend TLS mismatch, firewall denial, application crash or timeout. Inspect the exact LB type, backend health and logs, NEG membership and app traces. Pod readiness alone is insufficient evidence that the full client path works.

## 20. When should you use an Application LB versus a Network LB?

**Topic:** NAT DNS load balancing

**Explanation:** Use Application Load Balancers for HTTP(S) semantics such as hostname/path routing and managed L7 proxying. Network Load Balancers serve transport-level needs including TCP/UDP variants, passthrough or proxy behavior depending on product. Check external/internal reachability, global versus regional support, client-IP preservation, TLS termination, backend type and connection characteristics. The word 'load balancer' does not define one universal packet path.

## 21. A managed instance group is configured for nine replicas but only six are created. Why?

**Topic:** Compute Engine

**Explanation:** Investigate MIG operation errors and autoscaler recommendation versus actual target count, regional/zonal quota, machine availability, instance template correctness, subnetwork IP exhaustion, permission failures and distribution policies. A regional MIG spreads replicas but isn't a guarantee of machine availability in each zone. Examine the exact Compute Engine operation, not just utilization on existing instances.

## 22. What is the difference between MIG autoscaling and autohealing?

**Topic:** Compute Engine

**Explanation:** Autoscaling changes desired instance count based on demand signals. Autohealing replaces instances judged unhealthy by a configured health check. Bad health check design can cause restart storms when a shared dependency fails. Both need appropriate initialization/warmup and frontend health integration; a newly created VM isn't automatically ready to serve real customer traffic.

## 23. Why use instance templates rather than manually modifying running VMs?

**Topic:** Compute Engine

**Explanation:** Templates capture versioned, repeatable machine configuration. A MIG can roll a new template across replicas with controlled disruption and health checks. Manually editing each VM creates configuration drift and uncertain recovery. The template must still be secured: startup metadata should not contain long-lived secrets, images should be trusted, and changes should be canaried with rollback planning.

## 24. Should every production VM run as Spot?

**Topic:** Compute Engine

**Explanation:** No. Spot VMs provide lower-cost interruptible capacity and can be reclaimed. They're suitable for fault-tolerant batch or stateless capacity backed by resilient baseline infrastructure. A lone transaction leader or only copy of durable state is inappropriate. Plan for preemption, graceful checkpointing, possible inability to reacquire capacity and workload-specific cost/availability trade-offs.

## 25. A MIG rollout completes but API requests still fail. What did the rollout actually prove?

**Topic:** Compute Engine

**Explanation:** It mainly proves that the managed group performed its configured instance lifecycle actions and health assessments. It may not prove application business correctness, load-balancer backend health, dependency compatibility or TLS routing. Verify application-level synthetic transactions, p99/errors, backend health, database schema compatibility and connection draining across the rollout.

## 26. Is Cloud Storage equivalent to a mounted POSIX filesystem?

**Topic:** Storage and data

**Explanation:** No. It is object storage with bucket/object semantics and well-defined strong-consistency operations, not ordinary arbitrary in-place POSIX file modification. Object naming and generation matter, and multi-object atomic transactions are not automatically available. For databases use an appropriate transactional data store or block device; for images, exports and immutable blobs, Cloud Storage is often suitable.

## 27. How are Cloud Storage versioning, soft delete and retention different?

**Topic:** Storage and data

**Explanation:** Object Versioning preserves noncurrent versions under its configured behavior, soft delete allows recovery of recently deleted/overwritten objects for a retention interval, and retention policies enforce minimum preservation periods subject to lock/configuration. They solve different recovery/compliance needs and incur different costs. None replaces tested application-consistent backups or controls against credential/KMS loss. Always inspect actual bucket policy.

## 28. Why can moving every object to Archive cost more than using Standard?

**Topic:** Storage and data

**Explanation:** Archive has minimum duration and retrieval/operation economics. Frequently read or rapidly deleted objects can incur early deletion and retrieval fees that outweigh lower storage GB price. Evaluate access rate, retention period, restore urgency and lifecycle transitions. Autoclass can help in suitable buckets, but pricing must be modeled with real workload behavior.

## 29. Does Cloud SQL HA mean you can restore a deleted table to yesterday automatically?

**Topic:** Storage and data

**Explanation:** No. HA aims to restore service availability after instance/zone failure. It does not undo logical deletes or bad migrations; those changes can propagate. Backup and point-in-time recovery are separate capabilities requiring configuration and testing. Determine RPO/RTO, storage scope, backup retention and application reconciliation before asserting recoverability.

## 30. Does Pub/Sub exactly-once delivery ensure an external payment runs exactly once?

**Topic:** Storage and data

**Explanation:** No. Delivery guarantees do not make a database commit and external side effect atomic. A worker can commit the payment record then crash before ack and receive the message again. Use idempotency keys/unique constraints and an outbox or equivalent reliable event pattern. Acknowledge after durable processing, implement bounded retry/dead-letter behavior and measure redelivery.

## 31. A VM shows low CPU but p99 latency is high. What telemetry helps?

**Topic:** Observability

**Explanation:** Start from a customer-facing request SLI and traces to locate waiting time. Inspect application queues, DB connection pools, network/NAT errors and dependent service latency alongside CPU, memory and I/O pressure. A CPU graph says how much CPU was consumed, not where blocked requests wait. Check per-revision and per-region distributions and avoid averaging p99s.

## 32. Why don't log absence and zero Cloud NAT log entries prove no traffic happened?

**Topic:** Observability

**Explanation:** Logs may be disabled, excluded, sampled, aggregated, delayed, retained in another project or unavailable for the specific event. VPC Flow Logs and some service logs do not guarantee every packet is individually visible. Inspect log settings and sink routing, and corroborate with API metrics, Connectivity Tests, packet captures where allowed and service responses.

## 33. Why are high-cardinality metric labels dangerous?

**Topic:** Observability

**Explanation:** Labels like request ID, customer ID or unique URL can create huge time-series cardinality, memory/query load and observability billing. Keep dimensions such as service, region, status class and revision bounded. Use trace IDs and request IDs in logs/traces rather than metrics labels. Monitor telemetry costs and cardinality growth as part of platform operations.

## 34. What is an error budget for a 99.9% SLO?

**Topic:** Observability

**Explanation:** For an event-based SLI, an objective of 99.9% allows 0.1% of eligible events to be noncompliant during the window. Error budget is not automatically downtime minutes unless the SLI specifically measures time-based availability. Burn rate compares observed noncompliance fraction to the allowed fraction; a 1.44% error fraction represents 14.4x burn relative to a 0.1% allowance.

## 35. What is the difference between Cloud Logging and Cloud Audit Logs?

**Topic:** Observability

**Explanation:** Cloud Logging is the platform for logs, including application/VM logs and routed sinks. Cloud Audit Logs provide service-generated records of API and administrative activity under category-specific coverage and policy. Data Access logs are not universally enabled/visible in the same way as Admin Activity. Forensics need correct logging policy, retention, secure sinks and access to the right project.

## 36. Does a second application region guarantee regional disaster recovery?

**Topic:** Architecture and cost

**Explanation:** No. The application may have a single-region transactional database, regional secrets, a dependent service, unrecoverable data or insufficient warm capacity. Define RPO/RTO, replication/restore design, service identity, failover trigger and split-brain controls. A global HTTPS frontend is not a substitute for application/data-plane recovery tests.

## 37. Why is changing to a smaller VM type not automatically a cost optimization?

**Topic:** Architecture and cost

**Explanation:** Savings can be offset by throughput loss, added replicas, higher p99, retry traffic, cross-zone transfers and increased incident risk. Evaluate cost per successful business transaction, peak headroom, committed-use terms and SLO impact. Workload-based right-sizing with controlled benchmarks is preferable to lowering compute spend in isolation.

## 38. Should a company hide AWS and GCP behind one universal platform module?

**Topic:** Architecture and cost

**Explanation:** Only for stable outcomes. Provider resource hierarchies, subnet scopes, IAM and workload federation, NAT and load-balancer behavior differ. A universal lowest-common-denominator module can conceal important reliability and security trade-offs. Provide consistent developer-facing capabilities where useful, but preserve provider-specific implementations and operational documentation.

## 39. An incident affects 30% of users. When is failover to another region safe?

**Topic:** Architecture and cost

**Explanation:** First identify whether the secondary region is healthy, authorized, sufficiently provisioned and has compatible application code, dependencies and current data. Assess transaction writes and split-brain risk. Perform controlled routing changes only after verifying RPO/RTO and safety conditions; then monitor user-facing errors, latency and data correctness. Blindly shifting requests to a stale read-only replica can turn an availability incident into a data integrity incident.

## 40. How would you evaluate a GCP landing zone six months after rollout?

**Topic:** Architecture and cost

**Explanation:** Measure time to provision approved workloads, IAM/policy violations, incidents caused by shared networking, quota/capacity failures, trace/SLO coverage, cost attribution and developer toil. Review how many resources remain outside IaC, whether backup/region recovery drills succeed and whether teams can self-serve safely. A high number of projects or policy checks isn't success by itself.


## Further practice

For each question, explain a counterexample, identify the first command or evidence source you would check, and distinguish a root cause from a short-term mitigation. Reproduce only safe exercises in a disposable project.

[← Module 5 index](./) · [Hands-on labs](./labs)
