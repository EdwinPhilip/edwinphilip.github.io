# Module 8 · CI/CD, GitOps and Platform Engineering Labs

These exercises should be run in a **disposable repository and Kubernetes sandbox**, not with production credentials. For risky scenarios, use a tabletop simulation instead of a live failure.

## Lab 1: Design a trust-separated CI and CD pipeline

Create a repository with a pull-request workflow running lint/unit tests, a protected-main workflow building an immutable artifact, and a separate promotion PR updating a manifest digest.

```bash
git rev-parse HEAD
npm ci
npm test
docker build -t catalog-test:local .
docker image inspect catalog-test:local --format '{{.Id}}'
```

**Expected:** the test job cannot deploy, source revision and artifact digest are traceable, and the production update requires an approved change. **Safety:** no real cloud secrets in a PR job.

## Lab 2: Show GitOps drift and reconcile behavior

Install Argo CD only in a sandbox. Apply a sample Application with automated sync and explicit `prune: false`. Make an authorized manual change to a managed field, then compare behavior with self-heal disabled and enabled.

```bash
argocd app get catalog-preview
argocd app diff catalog-preview
argocd app history catalog-preview
kubectl get application catalog-preview -n argocd -o yaml
```

**Expected:** Synced and Healthy are different concepts; drift correction follows sync policy and owner behavior. Record how to suspend the right ApplicationSet owner during an emergency. **Safety:** do not experiment with automatic prune on shared namespaces.

## Lab 3: Progressive canary with rollback criteria

In a sandbox with Argo Rollouts installed, create an AnalysisTemplate that checks an instrumented error or success counter and pauses at 10% traffic. Inject failures only into the canary version. Verify that the controller stops or aborts according to the template.

```bash
kubectl argo rollouts get rollout catalog -n marketplace --watch
kubectl argo rollouts history catalog -n marketplace
```

**Expected:** candidate error signal produces an observable gate result. Verify actual traffic split and sample size, not just a configured `setWeight`. **Safety:** use test data and test routing only.

## Lab 4: Test OIDC trust boundaries on paper and in a sandbox

Draft two federated trust policies: one incorrectly accepts all repository branches; the other limits deployment to one repository and protected production environment. Evaluate whether a fork PR, arbitrary branch and approved main environment can assume the role.

**Expected:** untrusted runs are denied. Cloud role permissions remain least privilege even after the identity is authenticated. Do not issue or persist real long-lived production keys to prove the concept.

## Lab 5: Track SBOM, provenance and digest identity

Build a toy container using pinned dependencies. Generate an SBOM with an approved local tool, capture the image digest and create a mock provenance statement linking builder/source/digest. Change one build input and compare identity.

```bash
git rev-parse HEAD
docker image inspect catalog-test:local --format '{{json .RepoDigests}}'
```

**Expected:** a tag label alone cannot prove immutable content; signature and provenance verification require trusted signer/builder policy. A green scanner does not guarantee safe source. **Safety:** no secret environment variables in provenance/logs.

## Lab 6: Model an internal platform API with honest status

Define a fictional `ServiceEnvironment` contract with owner, TTL, resource class and exposure. In a design exercise, enumerate reconcile outcomes: Pending, Ready, Blocked, Deleting and Failed. Describe finalizer handling when DNS creation succeeds but volume provisioning fails.

```yaml
apiVersion: platform.example.com/v1alpha1
kind: ServiceEnvironment
metadata: {name: test-preview}
spec:
  owner: catalog-team
  class: ephemeral
  ttlHours: 8
  exposure: internal
```

**Expected:** stable identity, idempotent reconcile, useful status conditions and safe cleanup. This API is hypothetical and won't work without a CRD/controller.

## Lab 7: Build a platform user-journey SLI

Create synthetic event records for environment-request start, validation, reconciliation, readiness and user-access verification. Compute the fraction of eligible environments usable within ten minutes. Compare that with controller uptime.

**Expected:** the user-journey SLI can be poor when controller health is green; identify step latency with traces. Avoid high-cardinality request IDs as always-on Prometheus labels.

## Lab 8: Multi-cluster recovery tabletop

Simulate a bad organization-wide policy that breaks new Pod admission while existing workloads run. Identify which controller owns the change, separate production from nonproduction, preserve audit logs and choose a narrowly scoped recovery.

```bash
kubectl get validatingwebhookconfigurations
kubectl get pods -A -o wide
kubectl get events -A --sort-by=.lastTimestamp
kubectl auth can-i create deployments -n marketplace
```

**Expected:** a documented independent break-glass path, controlled rollback or forward-fix, recovery of developer workflows and reconciliation into Git/IaC. Never disable all security admission in production as a lab.

## Lab completion criteria

For every lab write down the trust boundary, desired behavior, observables, failure mode, stop condition and recovery procedure. Distinguish **pipeline success**, **GitOps reconciliation** and **correct customer/developer outcome**.

[Module 8 index](./) · [40 advanced technical FAQs](./follow-ups)
