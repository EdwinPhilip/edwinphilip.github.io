# Linux Systems Hands-on Labs

These exercises reinforce the [seven Linux chapters](./) using disposable Linux hosts or isolated development containers. Never stress or trace a shared production system without explicit authorization.

## Lab 1 — CPU throttling versus utilization

Create two otherwise equivalent CPU-bound workloads: one with a single worker, another with four workers. Apply an equivalent cgroup v2 quota and compare progress, throttling, CPU pressure and latency.

```bash
cat /sys/fs/cgroup/cpu.max
cat /sys/fs/cgroup/cpu.stat
cat /proc/pressure/cpu
mpstat -P ALL 1
```

**Explain:** Why can four runnable threads exhaust a one-core aggregate quota early while the node still has idle CPUs? Why is `nr_throttled/nr_periods` not a percentage of wall time?

## Lab 2 — Virtual memory versus resident memory

In a disposable VM, run a program that reserves virtual address space, then gradually writes to pages. Compare mapped virtual size with RSS and page-fault counters.

```bash
free -h
vmstat 1
pidstat -r 1
cat /proc/pressure/memory
cat /proc/<PID>/smaps_rollup
```

**Explain:** Why isn't a large VIRT value equivalent to physical RAM consumption? Which page faults involve disk I/O, and when is page cache reclaimable?

## Lab 3 — File descriptors and TCP lifecycle

Run a simple local TCP/HTTP server. Make and close controlled test connections while monitoring descriptor limits and TCP states.

```bash
ss -s
ss -tan
cat /proc/<PID>/limits
ls /proc/<PID>/fd | wc -l
lsof -p <PID>
```

**Explain:** What is the difference between an application FD and TCP `TIME_WAIT` state? How does `CLOSE_WAIT` arise? What distinguishes `EMFILE` from `ENFILE`?

## Lab 4 — Page cache and write durability

Write a small file and inspect changes to cached/dirty pages using `/proc/meminfo`. Review `fsync(2)` and `fdatasync(2)` before making any durability claims.

```bash
grep -E 'Cached|Dirty|Writeback|MemAvailable' /proc/meminfo
iostat -xz 1
```

**Explain:** Why can `write()` return before data is durable? Why can syncing the parent directory matter for a crash-safe rename?

## Lab 5 — Resource diagnosis exercise

Given an application with high p99 and modest CPU average, collect a low-overhead snapshot:

```bash
uptime
vmstat 1 5
mpstat -P ALL 1 5
iostat -xz 1 5
ss -s
cat /proc/pressure/{cpu,memory,io}
```

Then pick a single bottleneck hypothesis and specify which focused data would falsify it. Avoid using `strace`, `perf`, or eBPF tracing without evaluating permissions, security and operational overhead.

## Quick diagnostic matrix

| Symptom | Investigate first | Avoid concluding |
|---|---|---|
| Host load high, CPU low | Blocked tasks, I/O PSI, disk queue | High load proves CPU saturation |
| Container OOM, host RAM free | `memory.max`, `memory.events` | The kernel ignored free memory |
| p99 spikes, CPU moderate | Quota throttling, runnable pressure, application waits | CPU cannot be involved |
| Disk full, `du` much smaller | Open deleted files, quotas, mounts | All space is in visible files |
| EMFILE | FD count, process limits, sockets | TIME_WAIT equals leaked FDs |

[← Module overview](./) · [35 challenging follow-ups](./follow-ups)
