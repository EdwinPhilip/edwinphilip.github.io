# Jenkins Hands-on Labs and Failure Drills

The exercises build operational confidence, not just Pipeline syntax familiarity. Use a **disposable Jenkins controller and isolated agents**. Do not connect to production SCM, registries, cloud accounts or customer databases. Pin tested plugin versions and keep a snapshot of the sandbox controller before experimenting.

## Lab 1: Controller, queue and executor lifecycle

**Goal:** Trace a job from scheduling through executor allocation to workspace and build record.

Set built-in-node executors to zero. Create one isolated agent with a `linux-small` label. Submit two jobs requesting that label when only one executor is available.

```groovy
pipeline {
  agent { label 'linux-small' }
  options { timestamps(); timeout(time: 5, unit: 'MINUTES') }
  stages {
    stage('Hold') { steps { sh 'sleep 15' } }
  }
}
```

**Expected:** one task runs and the other waits with a clear queue reason, even if other label pools are idle. Observe agent registration and build record timestamps. **Safety:** keep hold time small; do not intentionally saturate shared production agents.

## Lab 2: Declarative stages, errors and bounded retries

Create a test repository with `scripts/test.sh`. Build a Declarative Pipeline using stage-level agents, `post`, `timeout`, and parallel independent tests. Inject a deterministic failure in one branch; compare result with and without explicit fail-fast policy.

```groovy
pipeline {
  agent none
  stages {
    stage('Check') {
      agent { label 'linux-small' }
      steps { checkout scm; sh './scripts/test.sh' }
    }
  }
  post { always { echo 'Record the result' } }
}
```

**Expected:** a required failed check causes an unsuccessful pipeline; the finalization step still runs. Record which agent/workspace each stage used. **Do not** paper over genuine failures with `catchError`.

## Lab 3: Multibranch and untrusted pull request threat model

Create a local/training repository and Multibranch Pipeline. Compare indexing, webhook delivery, PR build behavior and SCM credential access with a read-only identity.

Exercise a change request that modifies a test script, and answer: What would that script be able to read if the agent used a release role? Which protections come from trusted Jenkinsfile retrieval, and which require isolated compute/credentials?

**Expected:** no production credentials or host privileges exist in the test agent. Document which source refs are actually checked out and the branch trust configuration. **Safety:** do not add real secrets to prove exfiltration.

## Lab 4: Ephemeral Kubernetes agent troubleshooting

In a sandbox Kubernetes cluster with the Jenkins Kubernetes plugin installed, define a small agent Pod. Observe each state transition and time to executor.

```bash
kubectl get pods -n ci -o wide -w
kubectl get events -n ci --sort-by=.lastTimestamp
kubectl get resourcequotas -n ci
kubectl logs -n ci AGENT_POD -c jnlp --tail=100
```

Inject a *sandbox-only* label mismatch or overly restrictive quota. Compare queue errors from plugin provisioning with scheduler `FailedScheduling` events and inbound remoting connection errors.

**Expected:** clearly distinguish Pod creation failure, Pending scheduling, failed image pull and healthy Pod without agent connection. **Safety:** never use production CI namespaces.

## Lab 5: Shared Library version pinning and test boundaries

Create a training library with `vars/runChecks.groovy`, then two tagged versions that print different permitted build messages. Pin a consumer Jenkinsfile to version one while advancing the default library branch.

```groovy
@Library('training-ci@v1') _
pipeline {
  agent { label 'linux-small' }
  stages {
    stage('Test') {
      steps { runChecks() }
    }
  }
}
```

**Expected:** the pinned consumer retains version-one behavior. Explain why trusted global libraries demand administrator-level SCM review, and why a library step accepting arbitrary shell commands is a risky public API. Test only untrusted sandbox library permissions.

## Lab 6: Controller backup and isolated restore

Create a non-production Jenkins controller with a demo Pipeline and non-sensitive test credential. Record core/plugin/Java versions, then take a consistent home snapshot and store key material separately according to the security design. Restore into a **network-isolated** second controller.

**Expected:** Jenkins starts, jobs and build history are present, and test credentials are readable only after authorized key restoration. Record measured RTO and the latest restorable point. If key material is absent, explain why the encrypted credential state may not be recoverable. **Safety:** never copy real production `master.key` into an unsecured sandbox.

## Lab 7: Controller 502 and queue incident tabletop

Use a hypothetical situation: users report 502s, agent CPU is idle, the queue grows and a plugin update was deployed an hour ago.

Construct an evidence-first timeline: reverse-proxy upstream errors, Jenkins uptime, JVM heap/GC, disk/inodes, job queue reasons, cloud agent errors, and recent plugin changes.

```bash
df -h
df -i
free -h
vmstat 1 5
# JVM inspection only with explicit authorized process PID:
jcmd PID GC.heap_info
jcmd PID Thread.print
```

**Expected:** list at least three distinct root causes and how to disprove each. Define safe mitigation, not a reflexive restart or random heap increase.

## Lab 8: Build once, promote immutable artifact

Implement a sandbox test/build job that records a Git commit SHA, test results and a local container image identity. Sketch a second controlled promotion stage that consumes an *approved digest*, not a mutable tag.

```bash
git rev-parse HEAD
docker image inspect IMAGE_ID --format '{{json .RepoDigests}}'
```

**Expected:** explain source-to-digest traceability and why publishing secrets cannot be exposed to PR agents. For multi-architecture output, distinguish image index from target-specific digest. **Safety:** local registry or mock upload only; use no real cloud deploy credentials.

## Lab completion rubric

For every exercise record **hypothesis, input contract, expected result, actual evidence, failure mode, containment, recovery and access boundaries**. When a live environment is unavailable, do the exercise as a written tabletop and explicitly label unverified behavior. A green Jenkins UI or test job is not proof that an application deployment succeeded.

[Module overview](./) · [47 advanced technical FAQs](./follow-ups)
