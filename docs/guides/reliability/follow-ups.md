# Module 7 · 40 Difficult Cloud Reliability Follow-ups

Answer each aloud before reading the response. All incidents and services are hypothetical; provider-specific details must be checked against deployed versions.

## 1. Why is 99.9% availability not always equivalent to 43.2 minutes of downtime in 30 days?

*Area: SLOs*

**Model answer:** 43.2 minutes follows only a time-based model across a 30-day interval. A request-based SLO allows 0.1% bad eligible requests, so outage impact depends on demand distribution. A two-minute peak outage can burn more than the whole monthly request budget, while a longer low-traffic problem can burn little. Define numerator, denominator and time window explicitly before converting budgets.

## 2. A service returns 200 while silently dropping one in 100 queued bids. Is its availability SLO met?

*Area: SLOs*

**Model answer:** Its HTTP transport availability may appear healthy, but the business operation correctness objective is violated. Define a success event only after durable acceptance or a truthful rejection, and track the accepted operation ID through downstream completion when the API promises that outcome. Use reconciliation to detect missing events and ensure retries cannot double-apply financial side effects.

## 3. Would you page every time a service records an error?

*Area: SLOs*

**Model answer:** No. Page on actionable customer impact and meaningful error-budget burn, using multiwindow checks to separate acute from persistent problems. Low-volume services require care because one failure can create misleading percentage spikes; pair ratios with eligible volume and severity. Route nonurgent risk trends to a ticket instead of exhausting responders with noise.

## 4. What is the danger of averaging p99 latencies across Kubernetes Pods?

*Area: SLOs*

**Model answer:** Percentiles are not linearly aggregatable. Averaging per-Pod p99 values can hide a high-traffic Pod with poor tail latency and yield a number that is not the fleet's true p99. Export compatible latency histograms or distributions, aggregate observations first, then compute the desired quantile. Segment by operation and region where user experience differs.

## 5. How should an error budget affect release policy?

*Area: SLOs*

**Model answer:** Define policy with product owners: high burn may call for reducing risky changes, prioritizing remediation or requiring stronger verification. It need not mean a blanket freeze, especially when a reliability fix is the change. Analyze which changes consume the budget and whether the service objective remains aligned with customer value. Treat it as a risk-governance mechanism, not an engineer scorecard.

## 6. If two replicas each have 99.9% uptime, is their combined availability automatically 99.9999%?

*Area: High availability*

**Model answer:** Only under a simplified assumption that failures are independent and either replica alone has adequate capacity. Shared cloud control plane, DNS, database, rollout policy and zone-level dependencies create correlated failures. Inspect full dependency and traffic routing graphs, then validate with fault injection. Mathematical independence is a modeling hypothesis, not a property conferred by having two Pods.

## 7. Does distributing six Pods over three zones guarantee surviving a zone failure?

*Area: High availability*

**Model answer:** Not by itself. The database, ingress, caches and remaining two zones must still be functional and have sufficient headroom. Hard topology spread may also block recovery if capacity is missing. Measure actual user transaction success during zone isolation and verify the scheduler, node autoscaler, load balancer and database failover assumptions, not just Pod distribution.

## 8. What is the difference between a PDB and a multi-zone availability strategy?

*Area: High availability*

**Model answer:** A PodDisruptionBudget governs certain voluntary evictions using the Kubernetes Eviction API. It cannot prevent abrupt node or zone loss and does not directly enforce all Deployment rollout actions. Multi-zone design addresses fault-domain isolation and headroom; graceful Pod termination and PDBs reduce planned-maintenance impact. All are complementary, none is a complete guarantee.

## 9. Why can an aggressive load-balancer health check cause an outage?

*Area: High availability*

**Model answer:** An overly strict dependency-aware check may mark every otherwise functional application Pod unhealthy when a shared dependency blips. Traffic can be rejected or routed unexpectedly under all-unhealthy behavior. Separate local liveness, readiness and user-journey health; use hysteresis and realistic thresholds; understand fail-open/fail-closed semantics of the specific load balancer.

## 10. How would you choose between multi-zone and multi-region?

*Area: High availability*

**Model answer:** Start with quantified business RTO, RPO, geographic latency, compliance and failure-domain requirements. Multi-zone is often much simpler for regional availability, while multi-region adds replication, global routing, split-brain prevention, cost and operational complexity. Choose the least complex design meeting an explicit failure model, and demonstrate recovery with exercises.

## 11. Why are three retries at each of three service layers dangerous?

*Area: Timeouts and backpressure*

**Model answer:** Nested retries amplify attempts multiplicatively. Even modest per-hop retries can create dozens of downstream requests per original call under correlated failure, increasing saturation and preventing recovery. Prefer one well-owned retry boundary, deadline propagation, attempt caps and an overall retry budget. Measure retries per user operation, not just per proxy.

## 12. A payment POST times out after 3 seconds. Is it safe to resend?

*Area: Timeouts and backpressure*

**Model answer:** A timeout only proves the caller did not receive confirmation by its deadline. The provider may have committed the charge. Use a persisted idempotency key, query operation status or perform a provider-supported reconciliation before retry. Never equate transport failure with business failure; limit retries and keep an auditable operation state machine.

## 13. How does a circuit breaker differ from a rate limiter?

*Area: Timeouts and backpressure*

**Model answer:** A rate limiter restricts admission based on a configured budget such as requests per second or burst tokens. A circuit breaker stops or reduces calls when a dependency is judged unhealthy or resource limits are breached, often with a controlled half-open probe. A concurrency limiter instead bounds in-flight operations. Combine mechanisms thoughtfully because each protects a different bottleneck.

## 14. What failure can an unbounded queue cause even when no requests are dropped?

*Area: Timeouts and backpressure*

**Model answer:** The queue can grow until memory pressure, timeouts or unacceptable latency cause a larger outage. Retaining every request is not equivalent to serving it correctly within a deadline. Bound admission and queue age, shed work with clear overload semantics, and reserve capacity for critical requests. Prioritize oldest-item age and end-to-end success alongside queue depth.

## 15. Why can a downstream service still fail after its original outage ends?

*Area: Timeouts and backpressure*

**Model answer:** Queued work and synchronized client retries create a recovery storm. The dependency may have recovered but immediately becomes saturated again, causing repeated circuit openings and timeouts. Use jittered backoff, retry budgets, staged worker concurrency and backlog-drain monitoring. Recovery design is part of reliability, not only failure detection.

## 16. Does a transactional outbox make delivery exactly once end to end?

*Area: Transactions*

**Model answer:** No. It atomically records the business mutation and event intent, but publishing can repeat if a worker crashes between sending and recording delivery progress. The consumer needs deduplication/idempotent processing, and side effects across other systems require independent correctness controls. The outbox removes one dual-write failure window; it does not solve all distributed transaction semantics.

## 17. How do you prevent double acceptance when two requests share an idempotency key?

*Area: Transactions*

**Model answer:** Enforce a unique constraint within the authoritative transaction and associate the key with a request fingerprint and stored final outcome. Concurrent inserts must serialize or conflict safely; a duplicate with different parameters should be rejected rather than reuse an unrelated outcome. Define retention and retry semantics. An in-memory cache key alone cannot guarantee durability or race safety.

## 18. Can you decide bid winners from a stale cache?

*Area: Transactions*

**Model answer:** Not when correctness requires the current authoritative ordering and committed state. Caches or search replicas may lag, so they are useful for display or discovery but not necessarily for accepting or ordering bids. Use a single authoritative serialization point or a proven consistency model, then project committed results asynchronously to read replicas. Expose freshness semantics on read paths.

## 19. If two regions both accept writes during a partition, what breaks?

*Area: Transactions*

**Model answer:** Without a defined global ordering/consensus or conflict-resolution model, both sides can commit incompatible outcomes. Last-write-wins can discard a legitimately acknowledged financial action. Establish a single writer or proven multi-writer semantics with fencing and an explicit correctness contract. During partition, some writes may need to be rejected to preserve consistency.

## 20. Why not use two-phase commit for every cross-service operation?

*Area: Transactions*

**Model answer:** Global coordination increases coupling, lock duration and sensitivity to partial failure, and not all external services support a shared transaction coordinator. A saga with idempotent local transactions and compensations can be appropriate, but compensation is not always possible for irreversible actions. Choose based on business invariants rather than one universal distributed transaction recipe.

## 21. Why isn't a cross-region database replica a complete backup?

*Area: Disaster recovery*

**Model answer:** Logical corruption, accidental deletes and ransomware can replicate to the standby. Backups need separate recovery points, retention, access controls and proven restore procedures. Measure whether a clean-room restore can recreate the application and required keys, not only whether replication is current. RPO and recovery scope should include dependent systems and configurations.

## 22. What is the difference between RTO and detection time?

*Area: Disaster recovery*

**Model answer:** RTO is the target time from a specified disruptive event to restoration of the defined business service. Detection, decision, fencing, recovery, route convergence and validation all consume that budget. Measuring only automated failover duration understates customer recovery time. Build a recovery timeline that includes business correctness and manual dependencies.

## 23. Can low DNS TTL guarantee instant region failover?

*Area: Disaster recovery*

**Model answer:** No. Recursive/client caching, stale resolvers, connection pools, existing TCP sessions and application endpoint configuration can outlive the advertised TTL. DNS changes also do not fence the old database writer. Validate actual convergence across networks, enforce safe authority changes and design clients to reconnect appropriately.

## 24. What is a split-brain failure and how do you prevent it?

*Area: Disaster recovery*

**Model answer:** Split brain means more than one node or region believes it is authorized to mutate the same authoritative state. Prevent it through robust leader selection, quorum/fencing and write-authority controls before promoting a standby. Network partitions can make an old leader unreachable to some clients while still alive. Don't rely only on removing it from DNS.

## 25. When is active-active multi-region the wrong choice?

*Area: Disaster recovery*

**Model answer:** When the business tolerates an RTO of hours or authoritative writes require simple ordering, multi-writer active-active can impose disproportionate cost and failure modes. Evaluate latency benefit against conflict semantics, data sovereignty, change complexity and operational support. A well-tested active-passive design can deliver better real reliability than an untested sophisticated setup.

## 26. How do you distinguish request rate from concurrency?

*Area: Capacity*

**Model answer:** RPS measures arrivals per time; concurrency measures simultaneous in-flight work. Little's Law links them under stable conditions as average concurrency equals throughput times average time in system. A slow dependency can increase concurrency without higher arrival rate, filling queues and pools. Size with distributions and p99 rather than only average counts.

## 27. Why might adding application replicas make latency worse?

*Area: Capacity*

**Model answer:** New replicas multiply connection pools, retries and requests against shared databases, caches or NAT ports. They also consume node memory and can warm caches simultaneously. Identify the tightest downstream capacity bound before scaling and apply admission/concurrency limits. Additional replicas help only if some component has additional useful capacity to provide.

## 28. Does CPU-based HPA scale quickly enough for a predictable thirty-second traffic surge?

*Area: Capacity*

**Model answer:** Often not by itself: metrics, reconcile intervals, Pod scheduling, node provisioning, image pulls and readiness take time. If demand is predictable, pre-scale safely and keep node headroom. Use request/queue signals as appropriate and test the entire time-to-serving path. Reactive scaling alone cannot create instantaneous capacity.

## 29. How would you calculate safe worker concurrency for a database-limited queue?

*Area: Capacity*

**Model answer:** Start from sustainable transaction throughput, per-operation cost, database connection limits and other consumers. Bound worker inflight requests and inspect p95/p99, lock contention and queue oldest age under representative load. A backlog target divided by desired completion time gives an approximate required service rate, not proof that the database can deliver it.

## 30. What is the difference between a load test and a resilience experiment?

*Area: Capacity*

**Model answer:** A load test evaluates throughput, latency and saturation under traffic scenarios. A resilience experiment injects a specific fault while verifying business and recovery objectives, often under representative load. Combine them to expose failure behavior during peaks. Both need stop conditions, safe synthetic data, observable expected results and rollback.

## 31. How do you avoid a cache stampede after a hot key expires?

*Area: Data layer*

**Model answer:** Use TTL jitter, singleflight/coalesced refresh, selective prewarming and controlled fallback concurrency. Stale-while-revalidate is safe only for data whose freshness tolerance is explicit. Rate-limit miss storms before the database saturates, and monitor hot-key frequency and cache misses. A distributed lock can itself become an availability dependency.

## 32. Does ReadWriteOnce volume access guarantee one writer at the database level?

*Area: Data layer*

**Model answer:** No. RWO is primarily a storage attachment/access mode constraint, often scoped to a node, not a transaction or database fencing mechanism. Multiple processes may still access the filesystem, and failover may have ambiguous old-writer status. Use storage fencing, proven database replication/leadership and durable transaction protocols.

## 33. Can an application serve catalog data stale during a database outage?

*Area: Data layer*

**Model answer:** Possibly, if product owners define a freshness bound and the endpoint is not used for authoritative actions. Mark freshness/version as appropriate, cap stale exposure and fall back selectively. Never report a successful monetary transaction based only on a stale cache. Separate read-degraded capability from write correctness.

## 34. What makes a database failover create a second incident?

*Area: Data layer*

**Model answer:** Client pools may all reconnect at once, retries can amplify load, DNS or writer endpoints may converge slowly and read replicas can lag. Apply jittered reconnection, bounded pools, workload admission and correctness reconciliation. Test mixed connection states and ensure the previous writer is safely fenced before accepting new writes.

## 35. Why is a snapshot not necessarily an application-consistent backup?

*Area: Data layer*

**Model answer:** A snapshot can capture blocks without ensuring in-memory transactions, WAL checkpoints or multi-volume coordination were consistent. Coordinate application/database backup semantics, test restore and measure RPO/RTO. Validate encryption keys, retention and integrity as well as whether a restored database passes application invariants.

## 36. How do you prioritize changes during an ambiguous zone failure and bad deployment?

*Area: Incidents*

**Model answer:** Separate hypotheses and identify blast radius by release, zone, route and dependency. An incident commander assigns owners and records one change at a time where possible. Choose reversible mitigations with quantified capacity and transaction risks, then verify impact with user-facing SLIs. Avoid randomly restarting unrelated systems and losing diagnostic evidence.

## 37. Is a rollback always the right incident mitigation?

*Area: Incidents*

**Model answer:** No. If the old version is incompatible with a deployed schema or external side effect, rollback can worsen corruption or outages. Evaluate the whole state transition first: image, database, queue messages, infrastructure routes and feature flags. Sometimes a forward-compatible hotfix or traffic isolation is safer. Record the decision and recovery conditions.

## 38. What belongs in a blameless postmortem?

*Area: Incidents*

**Model answer:** Impact and affected user operations, factual timeline, contributing technical and organizational conditions, detection gaps, mitigation reasoning, verification, and prioritized preventive actions with owners. Avoid a single human-error conclusion. Test whether the actions genuinely prevent or reduce recurrence and close them when verified.

## 39. What proves a game day was successful?

*Area: Incidents*

**Model answer:** A clearly stated failure hypothesis, scoped fault injection, expected customer SLO/RTO outcome, stop condition, observed metrics, recovery timing and evidence that business state remained correct. Merely restoring all Pods or having an experiment finish is insufficient. Document surprises and update runbooks, architecture assumptions and monitoring.

## 40. How do you balance reliability spending against feature delivery?

*Area: Incidents*

**Model answer:** Use customer SLOs, error budgets, recovery requirements, incident history and marginal risk reduction to prioritize investments. Compare architecture maintenance and operational cost, not only cloud invoices. A second region might be less useful than fixing a shared database/identity failure or improving release controls. Make trade-offs explicit and review them with stakeholders.

[Return to Module 7](./) · [Practice labs](./labs)
