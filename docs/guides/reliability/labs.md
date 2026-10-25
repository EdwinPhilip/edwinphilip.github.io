# Module 7 · Reliability and Cloud Architecture Labs

All tasks use a **sandbox or explicitly authorized isolated environment**. Never send synthetic financial operations to real payment endpoints. Each lab has a hypothesis, expected observation and rollback/stop condition.

## Lab 1: Define a user-journey SLI and calculate error budget

**Hypothesis:** HTTP 2xx rate can miss incorrect business outcomes. Create toy data with `eligible`, `accepted`, `durable`, `latency_ms`, `region`, and `version` fields. Define a good bid as eligible + one correct durable outcome within 500 ms. Calculate good/eligible across a 30-day rolling window and compare against 99.9% and 99.95% targets.

```python
eligible = 100_000
good = 99_930
slo = 0.999
bad = eligible - good
allowed_bad = eligible * (1 - slo)
print({"bad": bad, "allowed_bad": allowed_bad, "budget_left": allowed_bad - bad})
```

**Expected:** 70 bad requests versus a 100-request 99.9% budget leaves 30 events. State why a 30-day request budget is not automatically a minute-based outage limit. **Safety:** synthetic data only; avoid personal identifiers in metrics.

## Lab 2: Simulate a dependency timeout and retry storm

Use a disposable HTTP service that intermittently sleeps beyond client timeout. Drive 100 original requests and record attempted upstream calls. Repeat with a maximum of two attempts, full jitter and a total request deadline.

```bash
# Illustrative from an isolated client with a running test server:
curl --connect-timeout 1 --max-time 2 -v http://127.0.0.1:8080/slow
```

**Expected:** Retry amplification can exceed client request rate, while bounded retries cap additional work. **Stop condition:** do not overwhelm a shared environment. Document how a payment side effect would require idempotency rather than blind POST retries.

## Lab 3: Validate multi-zone failure headroom

List replicas and zone placement in a sandbox cluster. Calculate whether remaining zones would accommodate the removed zone's workload based on Pod requests and node allocatable capacity.

```bash
kubectl get nodes -L topology.kubernetes.io/zone
kubectl get pods -A -o wide
kubectl get pdb -A
kubectl describe deploy catalog-api -n marketplace
```

**Expected:** Replica spread is not equivalent to guaranteed surviving-zone capacity. Don't cordon or drain production nodes. In a local sandbox, simulate an unavailable zone using test node affinity and verify Pending events.

## Lab 4: Exercise a transaction outbox with duplicate delivery

Create a toy SQL schema with a unique `idempotency_key`, a bid table and an outbox table. Within one transaction insert business outcome and outbox record; crash the relay after publishing but before recording progress.

**Expected:** Publication repeats; consumer deduplication prevents duplicate business effects. Assert exactly one durable bid record for each operation key. **Safety:** use an ephemeral database, never real transaction records.

## Lab 5: Plan regional failover with explicit fencing

Write a tabletop timeline: detect primary failure, stop/fence old writes, inspect replication lag, promote replica, move routing, warm service, reconcile ambiguous operations and verify user journeys.

```text
RTO target: 30 minutes
RPO target: 5 minutes
Measured lag before promotion: 90 seconds
Routing convergence and app warmup: 4 minutes
Question: was the old primary fenced before promotion?
```

**Expected:** Show measured worst-case RPO/RTO separately. DNS TTL alone is not fencing. **Safety:** do not fail over live databases as an educational exercise.

## Lab 6: Load-test bottleneck and backpressure

In a local test stack, vary arrival rate and record request throughput, p99, queue oldest age, downstream pool utilization and rejected requests. Add bounded queues and concurrency limits.

**Expected:** Throughput reaches a knee; unbounded queueing raises p99 and timeouts. Controlled shedding can preserve latency for admitted work. Verify error responses communicate overload truthfully rather than fake success.

## Lab 7: Run an incident game-day tabletop

Use a fictional event: database primary restart during zone loss and application rollout. Assign incident commander, application, infrastructure and communications roles. Require one hypothesis per owner, a timeline, reversible mitigation and user/transaction verification.

```bash
# Read-only observations on an approved sandbox cluster:
kubectl get pods -A -o wide
kubectl get events -A --sort-by=.lastTimestamp
kubectl rollout history deploy/catalog-api -n marketplace
kubectl get endpointslices -n marketplace
```

**Expected:** Recovery decision considers data state, zone headroom and rollback/schema compatibility. End with a learning review and measurable corrective actions.

## Lab completion criteria

For each exercise record: **fault hypothesis, measurement plan, observed evidence, impact, containment, recovery, follow-up and safety boundary**. Do not accept a green infrastructure status as proof that a user transaction is correct.

[Module 7 index](./) · [40 challenging follow-ups](./follow-ups)
