# Hands-on Kubernetes Labs

These exercises accompany the [12-chapter Kubernetes module](./). Run them only in a disposable or explicitly authorized cluster. Do not perform fault injection or storage force-detach in production.

## Lab A: Trace resource creation

**Goal:** Observe the separate Deployment, ReplicaSet, Pod, scheduler and endpoint stages.

1. Apply a three-replica Deployment from [Chapter 2](./q2).
2. Observe Deployment, ReplicaSet and Pod objects independently.
3. Record creation, scheduling, startup, readiness and endpoint timestamps.
4. Deliberately break the readiness endpoint in a test deployment. Compare `Running` with `Ready` and EndpointSlice membership.
5. Change only the Pod template; observe the new ReplicaSet and rollout revision.

```bash
kubectl apply -f catalog.yaml
kubectl get deploy,rs,pod -n marketplace -w
kubectl get endpointslices -n marketplace
kubectl rollout history deploy/catalog-api -n marketplace
kubectl get events -n marketplace --sort-by=.lastTimestamp
```

**Expected:** API creation completes before Pod scheduling and readiness; EndpointSlices converge asynchronously.

## Lab B: Reproduce scheduler rejection

Create a test Pod with a `nodeSelector` that cannot match any node. Read `FailedScheduling` events before fixing the selector. On a disposable node, repeat with an untolerated taint.

```bash
kubectl describe pod test-unschedulable -n marketplace
kubectl get nodes --show-labels
kubectl describe node NODE
```

**Expected:** Free CPU does not override hard placement constraints. Never remove production node taints merely to make a lab Pod run.

## Lab C: Compute an HPA recommendation

Inspect a test workload's CPU request and current CPU usage. Compute the raw recommendation by hand:

```text
desiredReplicas = ceil(currentReplicas * currentMetric / targetMetric)
```

```bash
kubectl describe hpa catalog-api -n marketplace
kubectl top pods -n marketplace
```

Alter the requested CPU in a test workload and explain why percentage utilization can change even when raw CPU usage does not. Compare your calculation to the controller's observed result, accounting for tolerance, missing metrics and stabilization.

## Lab D: Termination, draining and PDB

Deploy several replicas with a SIGTERM handler that logs its shutdown stages. In a disposable cluster, drain a test node with and without a suitable PDB and observe Pod exit, endpoint removal and replacement readiness.

```bash
kubectl get pdb -n marketplace
kubectl cordon TEST_NODE
kubectl drain TEST_NODE --ignore-daemonsets --delete-emptydir-data
kubectl get endpointslices -n marketplace -w
kubectl uncordon TEST_NODE
```

**Safety:** `--delete-emptydir-data` permits loss of Pod-local temporary data. Do not run on nodes containing important unmanaged or stateful workloads. A fixed preStop delay cannot guarantee no dropped requests.

## Lab E: CSI binding, topology and mounts

Using a test StorageClass with `WaitForFirstConsumer`, create a PVC and a consuming Pod. Observe chosen node, volume zone, binding, attach and mount stages.

```bash
kubectl get sc,pvc,pv -A
kubectl describe pvc TEST_PVC -n marketplace
kubectl get volumeattachments
kubectl describe pod TEST_POD -n marketplace
```

**Expected:** Bound does not guarantee mounted. Document what evidence would establish that an old database writer is safely fenced before a multi-attach recovery. Never force-detach a live writer in this exercise.

## Lab F: RBAC and admission policy

Create a least-privilege Role/RoleBinding for a dedicated ServiceAccount. Test allowed and denied permissions.

```bash
kubectl auth can-i get configmaps -n marketplace \
  --as=system:serviceaccount:marketplace:catalog-reader
kubectl auth can-i delete secrets -n marketplace \
  --as=system:serviceaccount:marketplace:catalog-reader
```

The invoking identity requires impersonation permission for this test. In a sandbox, test the Restricted Pod Security profile and read the admission rejection. For webhook experiments, use a noncritical policy scope and deliberately test how `failurePolicy` affects availability.

## Lab review

For every exercise, capture the intended state, observed state, relevant events, supporting command output and a safe recovery step. Explain which component owns the failure boundary. Avoid publishing real hostnames, tokens, Secrets or sensitive logs.

[Return to module index](./) · [42 difficult follow-ups](./follow-ups)
