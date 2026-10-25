# Senior Linux Interview Follow-ups — 35 Model Answers

Practice these after completing the seven chapters. Revealable questions from the original workbook are presented here as complete, readable model answers. These are generic engineering exercises, not employer-specific interview questions.

## 1. Does fork() immediately copy the parent&#x27;s entire memory into the child?

No. Modern Linux generally uses copy-on-write for inherited private mappings. The processes initially reference shared physical pages with protective permissions. A write can trigger a copy and private allocation. fork still costs page-table and process setup work, and a very large address space can make it expensive even without duplicating every data page.

## 2. Does execve() create a new process?

No. execve replaces the current process&#x27;s program image while generally retaining its PID. It loads a new executable and initial execution context, and it changes some process attributes and descriptor state. Shells commonly spawn a child before exec, which is why new processes appear in that common workflow—but exec itself does not allocate a new PID.

## 3. Why might a task remain in D state even after kill -9?

SIGKILL cannot be caught, but termination may be delayed while a task is stuck in certain uninterruptible kernel operations. Persistent D state can involve storage, filesystems, network filesystems or drivers. Inspect kernel wait channels, I/O health and journal messages. Do not promise that sending SIGKILL will immediately free the PID.

## 4. How can a process be alive and listening while real requests time out?

A live PID and listening socket establish minimal liveness, not request progress. Workers might be blocked on locks or a database, the event loop may be wedged, or the accept queue may be saturated. Inspect thread states, worker queues, application traces, downstream timing and relevant socket backlogs; improve readiness checks so they capture useful processing capacity.

## 5. What&#x27;s the difference between zombie and orphan processes?

A zombie has exited and retains exit-status metadata until a parent or reaper waits for it. An orphan is a child whose parent exited; it is reparented to an appropriate reaper and can still be running normally. Zombie accumulation may consume process-table/PID capacity, whereas orphan status alone is not an application failure.

## 6. Why is PID 1 important inside containers?

PID 1 is the namespace&#x27;s init task and plays a special role in child reaping and signal lifecycle. If an application or wrapper neglects those responsibilities, shutdown and zombie collection may misbehave. Use direct exec-form process launch or a small init helper as appropriate; verify how SIGTERM is delivered and descendants are reaped.

## 7. Is a high context-switch rate necessarily bad?

No. High I/O concurrency can produce frequent, healthy sleep/wakeup transitions. It matters when excessive wakeups, contention or preemption correlate with lower throughput and higher latency. Compare voluntary/involuntary switches, scheduler pressure, lock profiles and request performance rather than optimizing a count in isolation.

## 8. Does 16 GiB of VIRT mean a process consumes 16 GiB of RAM?

No. VIRT/VSZ describes mapped or reserved virtual address space. Untouched pages, large file mappings and shared libraries can inflate it without equivalent resident physical pages. Inspect RSS, PSS, anonymous memory, mappings and actual cgroup charges before sizing a container or diagnosing a leak.

## 9. What do RSS, PSS and memory.current measure differently?

RSS counts resident physical pages mapped by a process and counts shared pages in every mapping process. PSS proportionally attributes shared resident pages. cgroup memory.current accounts memory charged to a group under the kernel controller, including cache and some kernel objects beyond the application heap. These cannot be treated as interchangeable values.

## 10. Why is high page-cache usage often healthy?

Linux uses spare memory for cached filesystem data. Clean cached pages are reclaimable and can substantially reduce future I/O latency. High used RAM without reclaim stalls is not a problem by itself. Examine MemAvailable, dirty/writeback amounts, major faults, memory PSI and the application&#x27;s latency to distinguish cache usefulness from harmful pressure.

## 11. Does every page fault cause a disk read?

No. Minor faults can resolve mappings, anonymous-page allocation or copy-on-write without fetching data from disk. Major faults involve an I/O path to fetch required contents. Invalid memory accesses can instead raise SIGSEGV. Inspect fault types and their correlation with reclaim, I/O and request latency.

## 12. Can memory pressure cause high latency before an OOM kill?

Yes. Background/direct reclaim, writeback, swap and memory compaction can delay allocation and execution. Crossing cgroup memory.high can force reclaim and throttling without directly killing a task. Memory PSI and cgroup memory.events can surface stalls well before a hard-limit OOM event.

## 13. Why does a container OOM with 20 GiB free on the host?

Its memory cgroup can reach memory.max independently of the available host RAM. The kernel attempts eligible reclaim within the effective constraints; if the charge cannot be satisfied, a local cgroup OOM may occur. Verify memory.current/max/events, the termination reason and node logs to distinguish local from global OOM.

## 14. Does Guaranteed Kubernetes QoS prevent all OOM kills?

No. It influences resource guarantees and OOM/eviction behavior, but a Guaranteed container that exceeds its own memory limit can still be OOMKilled. QoS is not an exemption from memory.max or parent cgroup constraints. Verify the actual OOM scope and resource configuration.

## 15. Does container exit code 137 prove OOM?

No. 137 conventionally indicates SIGKILL (128+9), which may come from cgroup OOM, global OOM, forced termination after a grace deadline or other actions. Confirm Kubernetes terminated reason, kernel logs and cgroup memory events; use the timeline to establish cause.

## 16. How can a 600 MiB Java heap coexist with 1.4 GiB container memory usage?

The cgroup may include direct/off-heap buffers, native allocations, thread stacks, runtime metadata, memory-mapped files, charged page cache and socket/kernel buffers. Heap profiling alone isn&#x27;t complete. Compare native-memory/runtime diagnostics with cgroup memory.stat and process mappings.

## 17. How do memory.high and memory.max differ?

memory.high is primarily a reclaim/throttling threshold; crossing it causes pressure but not an OOM simply from being above it. memory.max is a hard charge ceiling. If enough memory cannot be reclaimed at that ceiling, a cgroup OOM path may be invoked. Monitor high/max/oom events as distinct signals.

## 18. How can p99 spike at 40% host CPU utilization?

An individual workload can hit a cgroup CPU quota, CPU affinity restrictions, lock contention or a brief parallel burst even when aggregate host CPU is moderate. CPU averages also hide short spikes. Inspect per-core counters, runnable threads, cpu.stat throttling, PSI and request spans before ruling out CPU-related stalls.

## 19. What does cpu.max = 50000 100000 mean?

The cgroup has roughly 50,000 microseconds of combined CPU runtime per 100,000-microsecond quota period: 0.5 CPU on average. Parallel threads can consume that budget quickly and then be throttled. It doesn&#x27;t mean every thread individually receives 50 ms or that 50% of every request is CPU time.

## 20. Is nr_throttled / nr_periods the percentage of time an application was throttled?

No. It is the fraction of quota periods in which throttling occurred, not wall-clock waiting time or fraction of requests impacted. The time accounting and multiple runnable threads complicate interpretation. Correlate delta counters and throttled_usec with p99, workload bursts and scheduling pressure.

## 21. Does a Kubernetes CPU request reserve one exclusive physical core?

Not normally. Requests guide pod scheduling and relative CPU weighting. Exclusive CPU placement requires specific CPU Manager policies and eligible workloads. A container may share cores and use spare capacity up to its limits; requests and CPU affinity are separate controls.

## 22. What is cpu.weight versus cpu.max?

cpu.weight controls relative CPU entitlement among competing cgroups. cpu.max imposes a bandwidth quota ceiling even if the host has idle CPUs. A high-weight cgroup with a tight max can still throttle. Design both for tenancy and latency requirements rather than viewing them as equivalent priorities.

## 23. Why can load average be 40 while CPU is 70% idle?

Linux load average includes runnable tasks and tasks in uninterruptible sleep. Many D-state tasks blocked on storage can inflate load while CPUs remain idle. Inspect vmstat r/b, thread states, I/O PSI, disk latency and kernel wait channels; don&#x27;t equate load with CPU utilization.

## 24. What is CPU steal time, and is it the same as throttling?

Steal is time a guest vCPU was not scheduled by its hypervisor because physical CPU time was used elsewhere. Cgroup CPU throttling is imposed within the guest kernel by quota enforcement. They have different causes and counters; measure %steal separately from cpu.stat throttling.

## 25. What does PSI add beyond utilization metrics?

PSI quantifies time work is stalled because of CPU, memory or I/O contention. Utilization measures consumption; pressure measures inability to make progress. PSI can reveal harmful reclaim or scheduling waits when averages look harmless. Interpret some/full correctly and correlate with application SLIs.

## 26. Does successful write() mean the data survives a crash?

Usually not for normal buffered filesystem I/O. Data may exist only in dirty page cache. Appropriate fsync/fdatasync and application/database transaction semantics are needed for durability. For crash-safe file creation/rename, syncing the parent directory may also matter. Storage and filesystem guarantees must be understood.

## 27. When would direct I/O be preferable to buffered I/O?

It can be useful for applications such as database engines that manage their own page cache and want to avoid duplicate buffering, subject to alignment and filesystem semantics. It isn&#x27;t universally faster: buffered I/O benefits from cache and readahead. Benchmark representative access patterns and latency.

## 28. Why can df -h show free blocks while writes fail?

Inodes (on applicable filesystems), filesystem quotas, read-only remount, file-size limits, permissions, or errors can block writes even with free bytes. Capture the actual errno, examine df -i, mount state, quotas and filesystem logs. Free capacity alone doesn&#x27;t establish writeability.

## 29. Why does df show full while du finds little visible data?

Deleted files can remain open in a process, retaining blocks until all references close. Inspect lsof +L1 and identify the process and file. Other contributors include snapshots, mount visibility and accounting differences. Prefer safe log rotation or controlled process actions over blind truncation.

## 30. Does iostat %util=100 guarantee the device is at max IOPS?

No. On parallel NVMe and virtualized/network-backed block storage, %util is not a universal maximum-capacity signal. Inspect read/write await, queue depth, IOPS, throughput and provider constraints. A device can perform many overlapping operations while appearing fully busy.

## 31. How does a file descriptor differ from an open file description?

A file descriptor is a process-local integer reference. The open file description is a kernel object containing relevant state such as file status flags and offsets. dup/fork can yield multiple FDs referencing the same description, which share applicable state. Closing one descriptor doesn&#x27;t release an object still referenced elsewhere.

## 32. What is EMFILE versus ENFILE?

EMFILE means the process-level FD limit was reached; ENFILE means a system-wide open-file allocation limit was reached. Inspect /proc/PID/limits and FD count for the former, file-nr and file-max plus the broader system for the latter. Raising a process limit cannot fix every system-wide ceiling.

## 33. Do tens of thousands of TIME_WAIT sockets necessarily cause EMFILE?

No. TIME_WAIT is TCP protocol state and often doesn&#x27;t retain an application file descriptor. Persistent CLOSE_WAIT can better indicate a process not closing sockets. Check actual FD counts, connection states and the error source rather than equating all TCP sockets with process FDs.

## 34. What&#x27;s the difference between level-triggered and edge-triggered epoll?

Level-triggered mode keeps reporting readiness while the condition persists. Edge-triggered mode reports changes; nonblocking handlers must drain operations until EAGAIN to avoid losing progress opportunities. An incorrect edge-triggered read loop can create apparent hangs even with buffered input available.

## 35. What should you do before using perf, strace or eBPF in production?

First define the user impact and resource boundary with low-overhead metrics, form a hypothesis, then select focused tracing that can resolve it. Assess authorization, runtime/kernel support, overhead, symbols and sensitive data exposure. Heavy untargeted tracing can worsen an incident and produce inconclusive data.

