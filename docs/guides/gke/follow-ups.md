# GKE Architecture and Operations: 40 Difficult Follow-ups

This interview bank accompanies all eight chapters of Module 6. Each answer emphasizes the actual Kubernetes/GKE guarantee, where the guarantee ends, how the mechanism works and what evidence would establish a production root cause.

::: info Version scope
GKE APIs, release channels, ComputeClass support, load-balancer behavior and storage/networking features change over time. Answers reflect general platform principles and documented product behavior. Verify your deployed GKE version and cluster settings before operational use.
:::

## 1. If the GKE API server is unavailable, do already running Pods immediately stop serving?

**Topic:** Architecture

**Model answer:** Not automatically. Processes and previously programmed data-plane routing can continue if nodes and dependencies remain healthy. New scheduling, controller reconciliation and status updates can fail while the API is unavailable; API-dependent applications may also be affected. Prolonged control-plane unavailability weakens recovery as nodes or Pods fail. I'd test real user requests and monitor node/control-plane connectivity rather than conflate API health with immediate application health.

## 2. Why does successful kubectl apply not imply successful application delivery?

**Topic:** Architecture

**Model answer:** Apply success establishes that the API accepted the desired object, after appropriate authentication, authorization and admission. Deployment/ReplicaSet controllers must still create Pods, scheduler must bind them, kubelet must pull images and start containers, and readiness plus cloud backend health must converge. I'd check status/conditions at each stage and then execute a synthetic request through the real load balancer.

## 3. Can you run Autopilot-managed workloads inside a Standard GKE cluster?

**Topic:** Architecture

**Model answer:** In supported GKE versions, yes: ComputeClasses can select Autopilot mode workloads in Standard clusters, with GKE-managed node pools for those workloads alongside Standard-managed capacity. The exact supported version and workload constraints matter. I would not describe Standard versus Autopilot as a rigid workload-level binary and would check the feature matrix before assuming privileged/node-specific apps are supported.

## 4. Does a regional GKE cluster automatically put each Deployment replica in a different zone?

**Topic:** Architecture

**Model answer:** No. A regional control-plane configuration and node placement do not themselves guarantee a particular Deployment's zone spread. Scheduler behavior depends on eligible nodes, topology spread constraints, affinity, taints and available capacity. For critical replicas I'd inspect actual Pod zone labels, configure an appropriate spread policy and verify behavior when one zone is unavailable, while acknowledging a hard spread can block recovery.

## 5. How do GKE DNS-based control-plane endpoints differ from IP-based endpoints?

**Topic:** Architecture

**Model answer:** The DNS-based endpoint is a GKE API access mode integrated with Google Cloud IAM and supported service perimeter controls, while IP-based endpoints expose separate private/public reachability and authorized-network settings. A private-node cluster may still have a public API endpoint depending on configuration. I'd inspect cluster network isolation settings and current client authentication before claiming the API can only be accessed from within a VPC.

## 6. Pods remain Pending on nodes with 30% CPU utilization. How can that be correct?

**Topic:** Node pools

**Model answer:** The scheduler primarily uses requested resources against node allocatable capacity, not current CPU utilization. Existing requests, DaemonSet overhead and reservations may consume schedulable CPU despite idle cores. Hard taints, node affinity, topology and volume zones can also block placement. I'd inspect FailedScheduling events, node Allocated resources and the workload's requests before changing the HPA.

## 7. Does a toleration direct a workload toward a tainted node pool?

**Topic:** Node pools

**Model answer:** No. A toleration allows a Pod to be scheduled despite a matching taint; it does not make that node preferable. A positive selector or node affinity directs placement. Without one, the Pod could land on any other feasible eligible node. For specialized pools I'd combine taints/tolerations with appropriate affinity and document autoscaler implications.

## 8. Can hard topology spread reduce availability during a zone outage?

**Topic:** Node pools

**Model answer:** Yes. With DoNotSchedule and strict maxSkew, Pods may remain Pending if eligible topology domains lack capacity or a zone is unavailable. That can preserve distribution at the cost of scaling/rollout availability. I'd evaluate ScheduleAnyway, capacity headroom and failure-domain design based on SLO; a schedule constraint should not be blindly tightened without a zone-loss test.

## 9. Why does GKE node autoscaling fail even when HPA adds replicas?

**Topic:** Node pools

**Model answer:** HPA controls Pod desired count, not physical nodes. GKE must find a provisionable node shape meeting CPU, memory, taints, affinity, volumes and topology within node pool bounds, quotas, node IP/Pod IP space and actual zonal capacity. I would inspect autoscaler events and Compute Engine operations to identify the first unsatisfied constraint, not simply raise max node count.

## 10. Will a PodDisruptionBudget prevent a Spot VM reclamation?

**Topic:** Node pools

**Model answer:** No. A PDB governs relevant voluntary evictions via the Eviction API. Spot capacity loss and sudden node failure are involuntary disruptions that can still remove Pods. For Spot workloads I'd use replication, backpressure, retry/idempotency, safe checkpoints and sufficient non-Spot baseline capacity as appropriate, while testing interruption recovery.

## 11. Why can a /16 Pod range be exhausted long before 65,536 Pods are running?

**Topic:** Networking

**Model answer:** GKE VPC-native clusters allocate blocks of Pod IP addresses to nodes according to configured max Pods per node. For example, a common /24 allocation per node turns a /16 into at most 256 such node allocations, not a free pool assigned one IP at a time. Primary subnet capacity and GKE limits can reduce capacity further. I'd calculate using deployed max-pods settings and inspect subnet allocations.

## 12. In GKE Dataplane V2, why might you not find kube-proxy iptables rules?

**Topic:** Networking

**Model answer:** Dataplane V2 uses a Cilium-based eBPF network data path, with anetd programming service routing and NetworkPolicy. kube-proxy is not used for Service routing there. Troubleshooting should inspect the enabled dataplane, Kubernetes Service/EndpointSlice state, relevant anetd health/logging and supported network-policy telemetry rather than conclude missing kube-proxy rules are the fault.

## 13. Does a node query EndpointSlices on every packet sent to a ClusterIP?

**Topic:** Networking

**Model answer:** No. Controllers/agents observe API objects and program a local service endpoint mapping or kernel data-plane state ahead of packet arrival. A connection to ClusterIP is translated/forwarded to a selected Pod backend according to the node dataplane. The API server is not synchronously consulted for every SYN. If routing fails, inspect endpoint selection and dataplane convergence.

## 14. Why can a Pod-to-Pod connection fail despite an allowed VPC firewall rule?

**Topic:** Networking

**Model answer:** Kubernetes NetworkPolicy can deny the traffic, the destination app might not listen, DNS can resolve an unexpected target, or CNI/eBPF routing can be broken. Conversely an allowed NetworkPolicy doesn't override a blocking VPC firewall. I'd check source/destination Pod IP, routing, both policy layers and app listener, correlating network-policy logs and packet evidence where permitted.

## 15. A Pod can call Cloud Storage but not a third-party HTTPS API. What does that suggest?

**Topic:** Networking

**Model answer:** Supported Google API access can work through Private Google Access or another private endpoint path without providing general public internet egress. The third-party call may require eligible Cloud NAT, default route and egress firewall permission. I'd check actual Pod or node SNAT source, NAT subnet coverage/port metrics, destination DNS and TCP/TLS stage before blaming the Google IAM credential.

## 16. Why do GKE-managed L7 NEG backends differ from a traditional NodePort load-balancing path?

**Topic:** Ingress and LB

**Model answer:** GCE_VM_IP_PORT NEGs can register Pod IP:port endpoints directly in Cloud backend services, so the Google L7 load balancer can target Pods without necessarily sending each request through node NodePort and kube-proxy. The GKE controller configures LB resources from Kubernetes objects. A Service type LoadBalancer uses a different Network LB model and should not be assumed to share that same data path.

## 17. What does cloud.google.com/load-balancer-neg-ready represent?

**Topic:** Ingress and LB

**Model answer:** For supported GKE Ingress with container-native load balancing, the controller adds a readiness gate so Pod readiness can consider backend load-balancer endpoint health, not just the kubelet's application probe. A locally healthy Pod can remain not Ready if the LB health check fails. This can intentionally stall a rollout and avoid routing new traffic to unhealthy endpoints. Support differs by controller/configuration.

## 18. A Pod returns 200 on localhost /ready but the global HTTPS LB reports 502. What next?

**Topic:** Ingress and LB

**Model answer:** I'd inspect the URL map/backend service chosen by host and path, NEG membership and endpoint IP:port, health-check path/port/protocol, firewall for health-check sources and backend TLS behavior. A localhost probe does not prove a remote listener or correct LB routing. I would compare Google backend health with Pod conditions and examine actual request logs before changing probes.

## 19. How do Gateway and HTTPRoute differ from Ingress?

**Topic:** Ingress and LB

**Model answer:** Ingress is an older HTTP(S) host/path abstraction with controller-specific annotations. Gateway API separates an infrastructure listener/Gateway from application routes and route-attachment permissions, with GatewayClass selecting an implementation such as a particular GKE LB family. Cross-namespace references may require ReferenceGrant. I'd choose based on controller support, security ownership, LB capabilities and migration constraints rather than YAML length.

## 20. Why doesn't terminationGracePeriodSeconds alone guarantee zero dropped connections?

**Topic:** Ingress and LB

**Model answer:** Pod termination hooks, readiness changes, EndpointSlice/NEG removal and LB backend draining propagate asynchronously. The app must stop accepting work and finish in-flight requests, and cloud LB connection-draining/timeout settings must match protocol needs. preStop consumes the grace period and SIGKILL can still end unfinished work. I'd test rolling replacements with live connections and measure actual error rates.

## 21. Is a Kubernetes ServiceAccount a Google IAM service account?

**Topic:** Security

**Model answer:** No. A KSA is a Kubernetes workload identity for Kubernetes API/auth and federation integration. A Google IAM service account is a principal authorized for Google Cloud services. GKE Workload Identity Federation can grant access directly to the KSA principal or allow it to impersonate a Google service account. They remain distinct identities with different RBAC/IAM control planes.

## 22. When is GKE Workload Identity Federation direct principal access preferable to GSA impersonation?

**Topic:** Security

**Model answer:** Direct resource IAM grants to the workload principal avoid an additional Google service account identity and can be simpler when the target service supports them. GSA impersonation may be needed for APIs or integrations that have limitations with direct federated principals. Both require narrow IAM on the intended resource; impersonation requires the correct workload identity user binding and KSA annotation.

## 23. A GKE Pod gets 403 from Cloud Storage after migration to another node pool. What is your first investigation?

**Topic:** Security

**Model answer:** Identify the actual Pod KSA and runtime principal, confirm the new node/pool supports the configured GKE metadata server and workload identity path, inspect bucket IAM on the exact object permission and check IAM conditions/VPC Service Controls. For impersonation verify both IAM binding and KSA annotation. Do not grant Project Owner merely because the Pod moved.

## 24. Why is namespace-admin a potentially sensitive permission even with narrow IAM on Kubernetes API resources?

**Topic:** Security

**Model answer:** A namespace administrator may create Pods, mount Secrets, exec into workloads or select a privileged KSA in the same namespace, yielding effective access beyond read-only object permissions. Admission constraints, ServiceAccount ownership, Pod security, secrets access and cloud identity bindings must be analyzed together. Namespace isolation is not automatically a strong multi-tenant trust boundary.

## 25. How can a validating admission webhook become a production outage?

**Topic:** Security

**Model answer:** If an admission webhook is unavailable and its failurePolicy is Fail, matching API operations can be rejected or timed out, preventing new Pods or deployments even while existing workloads continue to run. I'd restore webhook backend health first, inspect matching rules/timeouts and use narrowly scoped emergency policy changes only with security approval. Testing fail-open/fail-closed behavior is part of platform reliability.

## 26. Why does ReadWriteOnce not guarantee single-Pod access?

**Topic:** Storage

**Model answer:** RWO is generally a one-node read-write access-mode constraint; under compatible driver behavior, more than one Pod on that node may use the same volume. ReadWriteOncePod provides stronger single-Pod use where CSI support exists, but database-level fencing and transaction correctness remain separate. Choosing an access mode isn't equivalent to distributed consensus.

## 27. Why is WaitForFirstConsumer useful for zonal Persistent Disks?

**Topic:** Storage

**Model answer:** Immediate binding can create a disk in a zone before the Pod's scheduler has considered all node affinity, spread and resource constraints. WaitForFirstConsumer allows volume provisioning to account for a consuming Pod's placement. It reduces stranded volumes and unschedulable Pods but still depends on available nodes, quota and CSI operations.

## 28. Does a regional Persistent Disk allow simultaneous writers in two zones?

**Topic:** Storage

**Model answer:** Not generally. Regional PD replicates disk data across selected zones for availability, but attachment and writer safety must follow supported semantics. It doesn't implement active-active database transactions or automatically elect a safe writer after failure. Use fencing and database recovery, and treat regional replication as distinct from independent backups.

## 29. A PVC says Bound yet a Pod is stuck ContainerCreating with Multi-Attach. What does Bound tell you?

**Topic:** Storage

**Model answer:** Only that the PVC is bound to a PV/backing volume, not that the volume has successfully attached and mounted to the selected node. Inspect VolumeAttachment, Pod events, disk zone, CSI controller/node logs and old node attachment. Do not force-detach until you know the old writer cannot resume. Otherwise you risk filesystem/database corruption.

## 30. Are CSI snapshots sufficient for an application-consistent database restore?

**Topic:** Storage

**Model answer:** Not automatically. A snapshot may be crash-consistent and omit unflushed application buffers or transactions. A robust database backup includes coordination with WAL/checkpoints or database-aware tooling, encryption/retention, access to keys and tested restoration. A snapshot that exists but cannot be restored within RTO is not adequate disaster recovery.

## 31. Ten replicas at 80% CPU utilization with HPA target 50% imply what basic count?

**Topic:** Autoscaling

**Model answer:** The simplified HPA formula is ceil(current replicas times current metric divided by target metric), so ceil(10×80/50)=16. Actual HPA behavior can adjust for missing metrics, not-yet-ready Pods, tolerance and stabilization policies. I'd verify HPA conditions and reported current/desired values rather than insist every cycle must produce exactly 16.

## 32. Why can doubling CPU requests make HPA scale down even when traffic is unchanged?

**Topic:** Autoscaling

**Model answer:** CPU utilization is usage divided by requests. A Pod using 400m has 80% utilization when requesting 500m but 40% when requesting 1000m. HPA may recommend fewer replicas despite unchanged demand. That is why tuning requests and HPA utilization signals must be coordinated; for some services traffic/concurrency metrics are more appropriate.

## 33. How can CPU throttling create high p99 with low node CPU utilization?

**Topic:** Autoscaling

**Model answer:** A CPU limit typically maps to a cgroup quota. Multi-threaded work can consume its quota early during a scheduling period and then be throttled even while the host has spare cores. Inspect cgroup cpu.stat nr_throttled/throttled_usec and service latency by revision, then benchmark changes to quotas/requests. Adding replicas may help or may amplify dependent service pressure.

## 34. Can VPA and HPA fight each other?

**Topic:** Autoscaling

**Model answer:** Yes. VPA can alter CPU requests and HPA CPU utilization is relative to those requests, so each controller changes the other's feedback signal. GitOps also can fight HPA if it continually restores a fixed replicas field. Define ownership and use VPA recommendation-only or complementary scaling signals where appropriate, then load-test stability.

## 35. Why can application scale-out worsen Cloud SQL latency?

**Topic:** Autoscaling

**Model answer:** More replicas may create more DB connections, concurrent queries and lock contention. The bottleneck can move from application CPU to shared database capacity, worsening p99 despite more Pods. I'd cap per-Pod connections and concurrency, use backpressure, monitor successful transactions and tune scaling against end-to-end dependency capacity.

## 36. What does enrolling in a GKE release channel change?

**Topic:** Upgrades and recovery

**Model answer:** A channel controls the version rollout availability/maturity track and maintenance-related options, but it doesn't provide indefinite version pinning. GKE automatically upgrades clusters under lifecycle/security policy, and available channels/targets vary over time. I'd select based on compatibility and support, configure appropriate maintenance windows/exclusions and test deprecations ahead of production.

## 37. Can PDB prevent a Deployment rollout from violating its minimum available count?

**Topic:** Upgrades and recovery

**Model answer:** A PDB primarily controls certain voluntary Eviction API operations, such as node drains. Deployment rolling updates follow their own strategy and can make Pods unavailable independently of PDB enforcement. PDB also can't prevent sudden node failures. Safe availability needs rollout settings, readiness, capacity, topology and app draining in addition to PDBs.

## 38. Existing Pods serve after a GKE upgrade, but new Pods fail admission. What is the likely boundary?

**Topic:** Upgrades and recovery

**Model answer:** The API and runtime can be healthy while a webhook, policy, CRD schema or removed Kubernetes API version rejects new objects. Inspect API/admission errors, webhook configurations/backends, CRDs and release deprecations before restarting healthy Pods. If Pods were admitted but fail sandbox/container startup, move to kubelet, runtime, image, CNI and CSI.

## 39. Does a regional GKE cluster guarantee regional disaster recovery?

**Topic:** Upgrades and recovery

**Model answer:** No. A regional GKE cluster improves resilience across zones in one region. Multi-region recovery requires separate deployment/cluster capacity, image/secret/identity availability, network routing, data replication/restore and transaction-writer fencing. A global LB can't make a single-region database writable in another region. Test actual RTO/RPO under failure.

## 40. How would you triage a service outage immediately after node-pool upgrade?

**Topic:** Upgrades and recovery

**Model answer:** Start with business SLI, freeze further disruptive changes and compare old/new nodes. Identify first broken stage: admission, scheduling, runtime, image pull, CNI, CSI, probes, NEG/backend health or app dependency. Inspect Pod events, node conditions, GKE operations, workload logs and LB health. Mitigate only the failing boundary, validate real transactions, and document regression checks before resuming rollout.


## Practicing effectively

For each question, try a 60-to-90-second answer, then identify the exact Kubernetes condition, Cloud API object or metric you'd inspect first. Distinguish diagnosis from mitigation and predict the cost or failure mode of your proposed fix.

[← Module 6](./) · [Hands-on labs](./labs)
