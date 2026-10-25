# Linux Internals & Production Troubleshooting

**A complete practical field guide for intermediate-to-senior Linux, SRE and platform engineers.**

Linux is the runtime foundation under containers and Kubernetes. This module explains what the kernel is doing, how resource controls behave, how performance degrades, and how to prove root causes using production evidence.

::: info Scope
Examples are hypothetical and for education. Run intrusive tracing, load tests, process signals, and sysctl changes only in environments where you have permission. Provider-specific and kernel-version-dependent behavior should be verified against the deployed environment.
:::

## Prerequisites

- Basic terminal usage, processes, files and networking.
- Familiarity with containers and Kubernetes is helpful, but not required.
- A disposable Linux VM for the hands-on exercises.

## Learning objectives

By the end, you should be able to explain the process and scheduler lifecycle; virtual memory and page faults; cgroups v2, OOM and QoS; CPU quotas and Pressure Stall Information; Linux filesystem I/O and durability; descriptors, sockets and epoll; and systematic production performance diagnosis.

## Chapters

1. [Processes, threads, signals and scheduling](./q1) — `fork`, `execve`, process states, context switching, fair scheduling.
2. [Virtual memory, page faults and reclaim](./q2) — MMU/TLB, RSS/PSS, heap/stack, page cache and memory pressure.
3. [Cgroups v2, OOM and container memory](./q3) — memory limits, hierarchical accounting, local/global OOM and Kubernetes QoS.
4. [CPU scheduling, quotas, throttling and PSI](./q4) — `cpu.max`, weights, throttling, load average and pressure.
5. [Disk I/O, filesystems and durability](./q5) — VFS, page cache, buffered/direct I/O, `fsync`, IOPS, latency.
6. [File descriptors, sockets, epoll and limits](./q6) — FD tables, `EMFILE`, `ENFILE`, TCP states and efficient event loops.
7. [Full production performance investigation](./q7) — USE/RED, evidence-first triage, resource-specific commands, reversible mitigations.

## Hands-on practice

[Five reproducible Linux systems labs](./labs) — CPU throttling, memory, sockets, durability and incident diagnosis.

## Interview challenge bank

[35 difficult follow-up questions with complete model answers](./follow-ups)

Practice explaining each kernel mechanism, its observable symptoms, the commands that prove it, and the safer mitigation. Avoid interpreting a single utilization percentage as proof of saturation.

## Suggested study workflow

Read each chapter, draw the Mermaid flow or sequence diagram from memory, run the commands on an isolated VM, and reason through a hypothetical marketplace incident. Finish with the 35-question challenge bank.

## Official references

- [Linux cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)
- [Linux scheduler: EEVDF](https://docs.kernel.org/scheduler/sched-eevdf.html)
- [Linux Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
- [Linux memory-management concepts](https://docs.kernel.org/admin-guide/mm/concepts.html)
- [fork(2)](https://man7.org/linux/man-pages/man2/fork.2.html), [execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html), [fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html)
- [Kubernetes container resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)

[← All guides](/guides/) · [Begin Chapter 1 →](./q1)
