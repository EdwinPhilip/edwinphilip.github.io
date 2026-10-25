# Platform Engineering · 40 Advanced Technical FAQs

Questions focus on system guarantees, threat models and production trade-offs. Answer aloud before reading the model response.

## 1. How can a green CI run deploy an untested artifact?

*Area: CI/CD*

**Explanation:** If the deploy job fetches a mutable tag, rebuilds source with different inputs or references the wrong branch, running bytes can differ from what CI tested. Bind tests, build provenance and deployment manifests to one immutable digest. Verify the deployed digest and preserve the source revision and builder identity in the release record. Green checks are evidence about particular inputs, not arbitrary later artifacts.

## 2. What is the difference between continuous delivery and continuous deployment?

*Area: CI/CD*

**Explanation:** Continuous delivery keeps changes releasable and supports controlled promotion, which can include a human authorization step. Continuous deployment automatically promotes eligible changes to production according to policy. Both require tested artifacts, observability and recovery. The decision to automate production promotion should follow risk, business SLO and change compatibility, not a simplistic team-maturity label.

## 3. Why is caching dependencies across trusted and untrusted CI jobs dangerous?

*Area: CI/CD*

**Explanation:** An untrusted PR may poison a shared writable cache with modified build outputs or dependencies later consumed by a privileged release job. Partition caches by trust boundary, validate lockfiles and avoid promoting untrusted build artifacts directly. Faster builds aren't worth compromising artifact identity. A trusted release should use verified inputs on isolated runners or safely scoped caches.

## 4. Should the CI runner hold cluster-admin credentials to run deployment commands?

*Area: CI/CD*

**Explanation:** Usually no. It increases blast radius of a compromised PR script or runner. CI should publish an immutable artifact and approved release metadata; a cluster-scoped controller or tightly constrained deploy identity handles application of desired state. If direct deployment is justified, isolate the job and enforce environment approvals, OIDC, precise RBAC and audit logs.

## 5. What are meaningful CI/CD performance metrics?

*Area: CI/CD*

**Explanation:** Measure time to first useful failure, queue wait, build/test duration, flake rate, reliable deployment lead time, change failure rate and safe recovery time. A fast pipeline that produces unreviewed releases or hides flaky failures isn't an improvement. Segment by service and test suite, then optimize bottlenecks rather than minimizing all tests indiscriminately.

## 6. Does Argo CD Synced mean users can successfully place an order?

*Area: GitOps*

**Explanation:** No. Synced means desired and live manifests agree under diff rules. It doesn't prove the gateway routes correctly, dependencies are healthy or the business operation committed. Use readiness, synthetic user journeys, transaction outcome metrics and SLOs separately. A release gate should validate both reconciler state and customer-visible behavior.

## 7. What happens when GitOps selfHeal is enabled and an SRE manually fixes production?

*Area: GitOps*

**Explanation:** The reconciler may restore the Git version of fields it owns, undoing the emergency action. Define a break-glass procedure that updates authorized desired state or pauses the correct controller owner. With ApplicationSet-managed Applications, modifying the generated Application alone may not persist. Audit the override and reconcile drift after recovery.

## 8. Is enabling prune on every application safe?

*Area: GitOps*

**Explanation:** No. Prune allows deletion of managed resources that disappear from desired manifests; accidental Git deletion or bad generator output can cascade into destructive changes. Classify critical resources, use review and admission controls, plan data retention, and evaluate prune protections. A synced controller isn't authorized to delete resources whose lifecycle is owned elsewhere.

## 9. Why might Argo CD and HPA fight over the same Deployment?

*Area: GitOps*

**Explanation:** If GitOps repeatedly writes spec.replicas to a fixed value while HPA changes it through the scale subresource, reconciliation can oscillate. Choose one owner for the field or configure a precise supported diff/field-management strategy. Also avoid blanket ignores that conceal real drift. Ownership contracts are as important as the Git layout.

## 10. How can a GitOps controller recover if its own namespace is broken?

*Area: GitOps*

**Explanation:** Document and test an independent bootstrap/recovery path with tightly controlled credentials, backups of desired configuration, and compatible CRDs/controller versions. Avoid a circular dependency where Argo CD can only restore itself if Argo CD already works. Recover the control plane and admission prerequisites before expecting application sync to resume.

## 11. What's the practical difference between blue-green and canary deployment?

*Area: Progressive delivery*

**Explanation:** Blue-green runs two stacks and switches an entry route; it offers rapid code cutback but requires spare capacity and compatibility with stateful dependencies. Canary exposes a progressively larger fraction of traffic to a candidate and can use observed metrics to abort. Both need safe schema evolution and external side-effect handling. Choose based on blast radius and routing support.

## 12. Why might a 10% canary receive far more or less than 10% of requests?

*Area: Progressive delivery*

**Explanation:** Without weighted traffic-routing integration, a controller may approximate canary exposure with replica counts. Connection-level routing, sticky sessions, long-lived streams and uneven request rates can change actual proportions. Verify ingress/service-mesh behavior and observe request/version labels before interpreting comparative metrics. Weight labels alone are not proof of user exposure.

## 13. Can you automatically rollback a database migration with the image rollback?

*Area: Progressive delivery*

**Explanation:** Not safely by default. New writes may rely on schema or data conversions incompatible with old binaries, and reversing migrations can destroy information. Design expand-contract schema transitions, mixed-version compatibility windows and explicit forward repair. Declare abort rules in advance and treat database recovery independently from the traffic switch.

## 14. How do you avoid a false-positive canary abort on low traffic?

*Area: Progressive delivery*

**Explanation:** Require a minimum eligible sample size and appropriate observation window, compare baseline and candidate cohorts, and separate critical correctness signals from noisy percentile fluctuations. A catastrophic business correctness violation may still require immediate abort despite low samples. Use uncertainty-aware policy rather than an unqualified percentage threshold applied to three requests.

## 15. What can a rollout AnalysisTemplate detect that readiness probes cannot?

*Area: Progressive delivery*

**Explanation:** It can evaluate external metrics and checks such as error ratio, p99, synthetic transaction outcomes or custom business invariants over time. Readiness mainly determines whether an individual Pod is eligible for traffic. Analysis can decide whether to continue, pause or abort fleet-level exposure, but depends on correct metrics, traffic sampling and controller behavior.

## 16. Does signing a container image guarantee it contains safe code?

*Area: Supply chain*

**Explanation:** No. It authenticates a signer/digest relationship under a trust model; a compromised or malicious trusted builder can still sign harmful code. Combine review, isolated build, dependency controls, provenance, SBOM, scanning, least-privilege identity and runtime admission. Policy must specify which signer/builder and source revision are acceptable.

## 17. What does an SBOM prove, and what does it not prove?

*Area: Supply chain*

**Explanation:** An SBOM inventories declared or discovered components and helps with vulnerability response and license review. It doesn't by itself prove the artifact was built from reviewed source, that the inventory is complete, or that no runtime exploit exists. Link the SBOM to an immutable digest and trusted build provenance, and verify important dependencies or build steps separately.

## 18. Why is pull_request_target risky when untrusted code is checked out and executed?

*Area: Supply chain*

**Explanation:** That event can run in a privileged base-repository context; if the workflow executes attacker-controlled PR content with sensitive tokens or secrets, it crosses a dangerous trust boundary. Use lower-privilege pull_request verification, avoid secret access for untrusted scripts, and isolate any approval or labeling automation from executing PR code.

## 19. Is a floating Docker image tag suitable as an immutable release identifier?

*Area: Supply chain*

**Explanation:** No. A tag can be reassigned, and replicas may pull different bytes at different times. Promote a digest tied to reviewed source, trusted provenance and an authorized release record. An emergency rollback should select a known digest, not assume an old human-readable tag still points to the same artifact.

## 20. A dependency installs a malicious script in CI. What should incident response do beyond reverting package.json?

*Area: Supply chain*

**Explanation:** Freeze release promotion, inspect build logs and artifact provenance, isolate or replace compromised runners, rotate exposed credentials, inventory affected digests and deployed runtimes, then rebuild from vetted dependencies. Reverting source alone doesn't revoke stolen tokens or replace running compromised artifacts. Track affected supply-chain scope with evidence.

## 21. Does id-token: write in GitHub Actions itself grant production cloud permissions?

*Area: Identity*

**Explanation:** No. It permits the job to request an OIDC identity token; the cloud identity provider's trust policy and IAM permissions determine what that token can access. Still, a broad cloud trust relationship can be dangerous. Constrain repository, ref, environment, audience and target role, and grant permission only to narrowly scoped jobs.

## 22. Can a Kubernetes namespace alone be a strong boundary between hostile tenants?

*Area: Identity*

**Explanation:** Not necessarily. Namespaces scope API objects and RBAC but share a Kubernetes control plane and often nodes, CNI and privileged controllers. For hostile tenants, consider dedicated clusters/accounts plus policy enforcement, workload hardening, admission, network isolation and cloud IAM boundaries. Choose isolation strength based on threat model, not organizational convenience.

## 23. Why should a normal HTTP workload disable ServiceAccount API token mounting?

*Area: Identity*

**Explanation:** If it never calls the Kubernetes API, exposing an API credential offers a compromised process an unnecessary escalation path. Disable automount or use narrowly scoped projected tokens only where needed. Cloud workload identity and Kubernetes API RBAC have separate mechanics; validate the deployed federation configuration before assuming one token does everything.

## 24. What is the difference between runtime workload identity and CI identity?

*Area: Identity*

**Explanation:** CI is a short-lived build/release principal authorized to read source, publish artifacts or request controlled promotion. Runtime workload identity is tied to a deployed service and grants only the APIs required during business execution. Reusing a production deployment role inside all app Pods expands lateral movement and undermines auditability.

## 25. What happens if a trusted admission webhook becomes unavailable?

*Area: Identity*

**Explanation:** For matching API requests, its failurePolicy determines whether the request is rejected or can proceed without that webhook's evaluation. Fail closed may protect security but block deployments; fail open may preserve availability but weaken enforcement. Scope webhooks carefully, run HA backends, use short timeouts and rehearse outage behavior. Never remove all security controls reflexively.

## 26. What distinguishes an internal developer platform from an internal developer portal?

*Area: Platform product*

**Explanation:** A portal is one possible interface. The platform includes APIs, automation, golden paths, templates, security guardrails, operations, documentation and support. A portal with manually fulfilled tickets is not effective self-service. Measure time to usable environment, self-service completion and developer pain rather than portal page views.

## 27. When is a golden path harmful?

*Area: Platform product*

**Explanation:** When the approved path cannot satisfy legitimate workload requirements and exceptions are opaque or slow, teams create shadow infrastructure. Offer reliable defaults for common cases, a documented governed escape hatch and a feedback mechanism. Reduce complexity for users without pretending unusual stateful or compliance-sensitive services are interchangeable.

## 28. How would you model provisioning as an asynchronous platform API?

*Area: Platform product*

**Explanation:** Return stable resource identity and status immediately, reconcile desired state idempotently, and expose conditions such as Ready, Blocked and Failed with observedGeneration. Use finalizers for external cleanup, bounded retries and audit trails. Never report 'environment created' as 'environment usable' until service checks pass; handle partial resource creation explicitly.

## 29. How can self-service create a cloud cost leak?

*Area: Platform product*

**Explanation:** Unbounded previews, orphaned storage or abandoned load balancers may persist after team tasks end. Enforce ownership, TTL, quotas, cost attribution, environment-class limits and cleanup reconciliation with alerts on age. A cleanup controller failure must be observable and recoverable; forcibly deleting finalizers may leave infrastructure behind.

## 30. What evidence shows the platform reduces developer toil?

*Area: Platform product*

**Explanation:** Measure time from request to first deploy, successful self-service task completion, support requests per team, repeat incidents, wait time, changes requiring manual approval and user-reported friction. Combine quantitative metrics with interviews and workflow observation. Adoption counts alone can rise even while total engineer time lost increases.

## 31. Why shouldn't you place a unique commit SHA in every Prometheus metric label?

*Area: Observability*

**Explanation:** It creates high-cardinality time series, multiplying storage, query cost and operational overhead as revisions accumulate. Use stable dimensions such as service, environment and status on metrics; keep unique IDs as trace/log attributes or exemplars when supported. Correlation remains possible without turning every deployment into a new metric universe.

## 32. Is deployment frequency a valid performance score for an individual engineer?

*Area: Observability*

**Explanation:** No. DORA-style metrics describe delivery systems and organizational bottlenecks, not individual value. Optimizing individual counts rewards splitting changes or risky deployment. Use consistent team/system definitions, pair frequency with change failure and recovery, and corroborate with developer experience and product outcomes.

## 33. What are distinct SLOs for a platform versus an application?

*Area: Observability*

**Explanation:** An application SLO measures customer outcomes, such as correct requests and latency. A platform SLO measures developer journeys, such as successful environment creation, artifact promotion or recovery time. A platform outage might block deployments while running apps remain healthy, or vice versa. Both need well-defined denominators and ownership.

## 34. Can one green trace prove the rollout is healthy?

*Area: Observability*

**Explanation:** No. Sampling might miss rare failures, and one trace represents one operation. Combine correctly aggregated request metrics, business outcome counters, event lag, synthetic checks and targeted traces to explain failures. Traces answer 'where did this request go', while SLI accounting answers 'how often do eligible requests succeed'.

## 35. What should be logged during a release incident without leaking secrets?

*Area: Observability*

**Explanation:** Record release digest, source revision, environment, workflow/run ID, gate outcome, target controller state, correlation IDs, failure reason and timestamps. Avoid raw credentials, request bodies with personal data and unbounded debug output. Establish access and retention policy. Logs should support investigation without exposing customers or deployment authority.

## 36. How would you prevent Terraform and Argo CD from fighting over the same resource?

*Area: Governance*

**Explanation:** Define an ownership graph: Terraform owns cloud networks/IAM and usually cluster foundations, Argo CD owns Kubernetes workload manifests, and operators own their custom-resource-managed children. Exchange identifiers/contracts deliberately and keep field ownership explicit. Concurrent writers can oscillate or destroy state even when each tool acts according to its own desired configuration.

## 37. What is the right rollback process after a policy change breaks every cluster?

*Area: Governance*

**Explanation:** Freeze conflicting automation, identify which Git/Terraform/admission policy owns the failure, preserve current state and find the narrowest safe reversal. Ensure the recovery identity is independent of the broken policy path. Apply the authorized fix, then reconcile emergency drift into version control and test the policy against representative workloads before rollout.

## 38. Should platform teams centralize every production deployment approval?

*Area: Governance*

**Explanation:** Not automatically. A permanent manual gate can become a bottleneck and reduce accountability. Automate low-risk well-tested changes with policy and progressive delivery, while reserving explicit risk-based approval for high-blast-radius operations or incidents. Audit who can bypass and provide a clear escalation path for exceptional deployments.

## 39. How do you decide whether to operate one shared or several dedicated clusters?

*Area: Governance*

**Explanation:** Evaluate trust requirements, failure domains, compliance, team autonomy, scale and operational overhead. A shared cluster is efficient but can concentrate privileged-controller, networking and noisy-neighbor risks. Dedicated clusters improve isolation at additional cost. Make the choice by threat model and service SLO, not solely by number of teams.

## 40. What makes a platform incident response senior-level?

*Area: Governance*

**Explanation:** Name an incident commander, determine actual affected developer/customer journeys, assign technical workstreams, constrain concurrent risky changes, make a reversible mitigation and verify business outcomes. Then reconcile Git/IaC drift, rotate emergency access, and complete a learning-focused review with tested preventive actions. Senior leadership improves the system rather than simply knowing the most kubectl commands.

[Return to Module 8](./) · [Hands-on labs](./labs)
