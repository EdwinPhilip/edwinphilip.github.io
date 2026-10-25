# Kubernetes · 42 Advanced Technical FAQs

These questions cover the complete module. Consider each before reading the explanation before reading the model answer. Examples are generic and hypothetical.

## 1. If every kube-apiserver replica is unavailable, do existing Pods stop running?

*Area: Control plane*

**Explanation:** No, not automatically. Existing processes and already-programmed networking can continue operating. But control-plane operations cannot proceed normally: controllers and schedulers cannot reliably read or persist changes, new Pods may not be scheduled, and kubelets cannot report status. Applications that directly depend on the Kubernetes API may also fail. A prolonged outage weakens recovery from node and Pod failures even when data-plane traffic initially continues.

## 2. Why can a Kubernetes object be successfully created while no container starts?

*Area: Control plane*

**Explanation:** API creation success means the object passed applicable API/admission stages and was persisted. Controllers must create dependent resources, the scheduler must select a node, and kubelet must configure runtime, networking, volumes and containers. Any later stage can fail independently. Inspect Deployment conditions, ReplicaSets, Pod events, scheduling state and kubelet/runtime evidence rather than equating API response with application readiness.

## 3. Does kube-scheduler create Pods or start containers?

*Area: Control plane*

**Explanation:** Neither in the normal flow. Workload controllers cause Pod API objects to be created. The scheduler selects a suitable node and records the binding. Kubelet on that node then works with runtime, CNI and CSI to start the Pod. This division helps identify whether a failure occurred in desired-state reconciliation, placement or node execution.

## 4. Five etcd members exist and two fail. What happens? What if a third fails?

*Area: etcd*

**Explanation:** Five members require quorum of three. With two failed, three remain, allowing consensus progress if they communicate and operate correctly. A third failure leaves two and prevents commits requiring quorum. Existing application Pods may continue, but control-plane state updates are impaired. Recovery must preserve cluster identity and consistency.

## 5. Why doesn&#x27;t adding a sixth etcd member improve failure tolerance compared with five?

*Area: etcd*

**Explanation:** Six voting members need quorum of four and tolerate only two failures; five need quorum of three and also tolerate two. The sixth adds replication/operational overhead without increasing tolerable member failures. Membership design should reflect failure domains, network latency and quorum guarantees.

## 6. What is a Kubernetes resourceVersion, and why shouldn&#x27;t a controller compare it as a timestamp?

*Area: etcd*

**Explanation:** resourceVersion is an opaque API concurrency/version token for reads, watches and conditional operations. Though etcd-backed implementations relate changes to revisions, clients should not assume it is wall-clock time or rely on numerical comparisons outside documented APIs. Use version-aware updates/watches and recover from expired history through re-listing.

## 7. A watch returns HTTP 410 Gone. Has Kubernetes lost the Deployment?

*Area: etcd*

**Explanation:** Not necessarily. The requested watch history may have been compacted. A controller should re-list the current objects, rebuild its cache and resume from a valid resourceVersion. A watch is not a forever-complete event log. Expired history is a resynchronization event, not proof that the Deployment was deleted.

## 8. Why isn&#x27;t an etcd snapshot sufficient for a complete disaster recovery plan?

*Area: etcd*

**Explanation:** etcd stores Kubernetes API state, not external workload data. Application databases, cloud disks, object storage and external secrets need separate recovery plans. Old cluster metadata may conflict with cloud resources created since the snapshot. Define recovery consistency points, encryption keys, credentials and actually rehearse application restoration.

## 9. Why must a Kubernetes controller be idempotent?

*Area: Controllers*

**Explanation:** Reconcile may run repeatedly because watches reconnect, caches refresh and errors cause retries. Duplicate observations must not trigger duplicate unintended side effects. For cloud APIs use stable resource identities, idempotency tokens where supported, status tracking and controlled retries; reconciliation should converge despite duplicate events and partial failures.

## 10. What is the difference between an informer cache and etcd state?

*Area: Controllers*

**Explanation:** etcd is the authoritative backing store for API state. An informer maintains an asynchronously updated local view from API list/watch. It reduces load but can be stale. Controllers must tolerate conflicts, missing resources, watch expiration and races, rather than assume one observed event means every other controller has converged.

## 11. A resource is stuck Terminating because of a finalizer. Would you remove it manually?

*Area: Controllers*

**Explanation:** Only after identifying the finalizer&#x27;s intended cleanup. The responsible controller might need to remove a load balancer, DNS record or disk. Removing the finalizer can orphan infrastructure or threaten data. Inspect controller logs, credentials and external operations; only bypass cleanup with deliberate acceptance of consequences.

## 12. How would you prevent two replicas of a custom operator from performing conflicting writes?

*Area: Controllers*

**Explanation:** Use controller-runtime leader election or another explicit coordination model when exclusive active reconciliation is needed. Still make operations idempotent and use optimistic concurrency: leadership may switch while external effects are in flight. Use stable identities, bounded retries and compensating actions for partially completed operations.

## 13. Ten nodes have low CPU utilization, but a Pod is Pending. How can that happen?

*Area: Scheduling*

**Explanation:** Scheduling uses allocatable resources and declared requests, not live CPU percentages. Hard constraints may exclude nodes: taints, affinity, topology spread, host ports, device resources, volume topology. Inspect FailedScheduling events and requested-versus-allocatable resources to identify the actual blocking condition.

## 14. Does adding a toleration make the scheduler prefer the tainted node?

*Area: Scheduling*

**Explanation:** No. A toleration permits placement despite a matching taint; it does not attract the Pod. Use node affinity or selectors to require/prefer the node. A Pod tolerating a GPU taint might still schedule on other eligible nodes without a positive placement requirement.

## 15. Can topologySpreadConstraints cause an availability incident?

*Area: Scheduling*

**Explanation:** Yes. A hard DoNotSchedule spread rule can block rollout when one zone lacks capacity. It improves failure-domain distribution but reduces flexibility. Evaluate maxSkew, eligible domains, affinity, node supply and application objectives; choose hard or soft constraints intentionally and maintain zone headroom.

## 16. Will high-priority Pod preemption always make a Pending Pod schedulable?

*Area: Scheduling*

**Explanation:** No. Preemption only helps if freeing lower-priority Pod resources makes a feasible node. It cannot create an unavailable GPU, fix impossible affinity or relocate an incompatible zonal PV. Inspect filter/PostFilter reasons and infrastructure capacity rather than assume priority overrides hard constraints.

## 17. What is the difference between the scheduler and a node autoscaler?

*Area: Scheduling*

**Explanation:** Scheduler assigns Pods to existing feasible nodes. Node autoscaler changes cloud node capacity to satisfy schedulable demand subject to quotas, instance availability and pool requirements. Adding a node does not guarantee binding if the Pod&#x27;s constraints are impossible. Observe both scheduling events and provisioning events.

## 18. Does maxUnavailable: 0 guarantee that no request fails during a Deployment rollout?

*Area: Workloads*

**Explanation:** No. It constrains Deployment availability accounting, not end-to-end responses. Faulty readiness, LB propagation, schema incompatibility, shared dependencies or exhausted surge capacity can still fail requests. Combine strategy with actual readiness, drain behavior, zone headroom and user-level SLOs.

## 19. Why might visible Pods briefly exceed replicas plus maxSurge?

*Area: Workloads*

**Explanation:** Terminating Pods can remain visible and consume resources while being excluded from some rollout replica accounting. New Pods may start before old termination fully completes. Account for grace periods, proxy drains, additional resource consumption and scheduler capacity during rollout.

## 20. Why is a StatefulSet not enough to guarantee database consistency?

*Area: Workloads*

**Explanation:** StatefulSet provides stable identities and storage association, not database replication, leader election, durability or quorum. The database or operator owns transaction semantics and fencing. Kubernetes may restart a member but cannot decide whether an uncommitted transaction should be replayed.

## 21. A StatefulSet update becomes stuck because a new Pod never becomes Ready. Is reverting the image always enough?

*Area: Workloads*

**Explanation:** No. With OrderedReady, a known failure mode can leave the controller waiting for a failed revision Pod even after the template was reverted. Follow documented recovery steps, potentially deleting Pods from the failed revision after assessing quorum and data safety; never blindly delete a critical database member.

## 22. A Job has completions=1 and parallelism=1. Is business execution exactly once?

*Area: Workloads*

**Explanation:** No. Kubernetes Job completion semantics permit duplicate program execution in some failure/race cases. Protect business operations using durable checkpoints, idempotency keys, unique constraints or transactional writes. Particularly important for billing, payment settlement and imports.

## 23. Does CronJob concurrencyPolicy: Forbid create a global reconciliation lock?

*Area: Workloads*

**Explanation:** No. It governs active Jobs from that CronJob and doesn&#x27;t coordinate separate clusters, CronJobs or external workers. Scheduling may be delayed or duplicated. Critical reconciliation needs a durable application-level coordination or idempotency mechanism and records of processed intervals.

## 24. How can a Guaranteed Pod still be OOMKilled?

*Area: Resources*

**Explanation:** Guaranteed QoS doesn&#x27;t remove configured memory.max. A container exceeding its cgroup hard limit can be killed even while the node has spare RAM. Inspect memory.current, memory.events, memory.stat and process native/runtime allocations; distinguish local cgroup OOM from node pressure.

## 25. Why can changing CPU requests affect HPA without changing actual CPU usage?

*Area: Resources*

**Explanation:** Resource-utilization HPA CPU metrics are measured relative to CPU requests. 400m usage on a 500m request is 80%; on a 1000m request it is 40%. Changing requests changes the scaling signal with identical demand. Reevaluate HPA behavior whenever tuning requests.

## 26. What&#x27;s the difference between OOMKilled and Evicted?

*Area: Resources*

**Explanation:** OOMKilled usually reports a container terminated through the kernel/cgroup OOM path. Evicted means kubelet removed a Pod in response to node pressure or applicable eviction policy. Use Pod termination reason, kubelet events, node conditions and cgroup OOM counters rather than infer from an exit code alone.

## 27. Why can checking the database from every liveness probe cause cascading failure?

*Area: Probes*

**Explanation:** A brief DB outage makes every service instance fail liveness, causing fleet-wide restarts. As the DB recovers, simultaneous startup and pool reconnects amplify load. Use liveness for unrecoverable local failure; design readiness/dependency SLOs separately so one shared outage doesn&#x27;t unnecessarily remove every backend.

## 28. Does Pod Ready=True prove the cloud load balancer can send requests successfully?

*Area: Probes*

**Explanation:** No. Local readiness and cloud target health/NEG membership may differ, and endpoint propagation is asynchronous. Inspect readiness gates, cloud backend service health, target path/port and load balancer logs. A passed probe isn&#x27;t equivalent to a successful customer request.

## 29. Does preStop run after SIGTERM, with an unlimited grace period?

*Area: Probes*

**Explanation:** No. During normal termination, preStop runs before the runtime sends the normal stop signal and uses part of the same grace period. Excessive hook time leaves less room for application shutdown; a deadline can trigger forced kill. Coordinate endpoint drain and app cleanup inside the total window.

## 30. Does a PodDisruptionBudget prevent Deployment rollouts from making too many Pods unavailable?

*Area: Probes*

**Explanation:** No. PDBs govern relevant voluntary evictions through the Eviction API, such as controlled drains. Deployment controllers implement their own rolling strategies. PDBs also can&#x27;t prevent crashes or hard node failures. Use PDBs plus rollout parameters, headroom and app draining.

## 31. A PVC is Bound but its Pod reports FailedMount. What should you investigate?

*Area: Storage*

**Explanation:** PVC/PV binding doesn&#x27;t prove attachment or mounting. Inspect PV zone/topology, VolumeAttachment, CSI controller/node logs, cloud disk state and Pod events. Never force-detach a database volume until the former writer is known to be stopped or fenced.

## 32. Why can Immediate binding create problems for zonal disks?

*Area: Storage*

**Explanation:** Immediate provisioning can create a disk before the scheduler accounts for the consumer Pod&#x27;s full topology constraints, possibly in an incompatible zone. WaitForFirstConsumer delays provisioning/binding so scheduling can influence location. Inspect StorageClass and node/volume affinity.

## 33. Does ReadWriteOnce guarantee that only one Pod can write to the volume?

*Area: Storage*

**Explanation:** Not necessarily; RWO is typically one-node read-write and multiple Pods on that node may share it with some drivers. ReadWriteOncePod is more specifically one-Pod access where supported. Neither guarantees database transaction correctness or prevents every split-brain scenario without fencing.

## 34. Is VolumeSnapshot automatically an application-consistent backup?

*Area: Storage*

**Explanation:** No. Storage snapshots can be crash-consistent but may not capture in-memory transactions or unsynced writes. Use application-aware backups/quiescing/checkpoints/WAL where needed. Verify restore, region coverage, keys, retention, RPO and RTO.

## 35. Four replicas use 80% CPU against a 50% HPA target. How many does the basic formula suggest?

*Area: Autoscaling*

**Explanation:** ceil(4 × 80 / 50) = ceil(6.4) = 7 replicas. Actual HPA can adjust for tolerance, missing metrics, startup/ready state, stabilization and min/max. Distinguish the formula from controller-reported desired replicas and conditions.

## 36. Why might HPA refuse to scale down when one metric is unavailable?

*Area: Autoscaling*

**Explanation:** With multiple metrics, missing or invalid input can conservatively block downscale even if a valid metric recommends fewer Pods. Inspect HPA conditions, currentMetrics and adapter health. This is designed to avoid removing capacity without sufficient signal.

## 37. How can HPA, VPA and GitOps fight each other?

*Area: Autoscaling*

**Explanation:** HPA owns replicas, VPA can change requests, CPU-utilization HPA uses requests in its denominator, and GitOps may continually restore a fixed replicas value. Define field ownership and compatible control signals; test stability during load, rescheduling and resource recommendation changes.

## 38. Why isn&#x27;t a namespace-scoped RoleBinding automatically harmless?

*Area: Security*

**Explanation:** A namespaced permission can still enable reading Secrets, exec into containers or creating Pods using privileged ServiceAccounts. A RoleBinding can reference ClusterRole rules for namespaced resources. Analyze effective privilege/escalation paths, service identity and admission protections, not just object scope.

## 39. A validating webhook is down and every Deployment fails. What&#x27;s the safe response?

*Area: Security*

**Explanation:** Identify the matching webhook, failurePolicy, timeouts and failed backend first. Restore the service/cert/endpoint when possible. If emergency changes are necessary, narrowly modify rules/policy under security review rather than disabling all admission. Reestablish enforcement and test webhook failure resilience afterward.

## 40. Does an application need a mounted generic Kubernetes API token to use cloud workload identity?

*Area: Security*

**Explanation:** It depends on the federation mechanism. Projected workload identity tokens, cloud credential exchange and Kubernetes API access are distinct concerns. Provide only the identity material required for the configured integration, with correct audience, rotation and permissions. Don&#x27;t assume broad API tokens are necessary for cloud-resource access.

## 41. Can you assume a Kubernetes control-plane upgrade has an easy rollback command?

*Area: Upgrades*

**Explanation:** No. Downgrade can be unsupported or unsafe because storage formats, API versions, CRD fields and controller behavior change. Managed services may prohibit it. Prioritize preflight checks, target-version testing, canary node pools, backups and forward-recovery plans; distinguish app rollback from cluster downgrade.

## 42. Existing Pods work after an upgrade, but new Pods cannot start. Which layer would you investigate first?

*Area: Upgrades*

**Explanation:** Locate the first incomplete transition. API rejects objects: admission/removed APIs/CRDs. Pod is Pending: scheduler/resources/affinity/PVC. Assigned but sandbox fails: kubelet/CRI/CNI. ContainerCreating with mount errors: CSI. Ready but failing traffic: Service, LB or app dependencies. The failure stage determines the diagnostic action.

