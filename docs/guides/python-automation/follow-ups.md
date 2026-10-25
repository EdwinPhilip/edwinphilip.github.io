# 36 Advanced Technical FAQs: Python and Shell Automation

Each answer explains the contract, trade-off and failure mode. Attempt the question independently before reading the model answer.

## 1. Why choose a dictionary rather than searching a list for every event?

**Model answer:** A dictionary gives expected constant-time key lookup, which is appropriate for counting or grouping by service. Repeated list scans can turn a one-pass aggregation into quadratic work as the dataset grows. I would use a list when order or repeated values are the primary requirement, not for frequent membership checks.

## 2. Does a set preserve original record order?

**Model answer:** No, a set is intended for membership and uniqueness, not stable input order. If output order matters, use a dictionary keyed by identity or keep an output list alongside a seen set. An explicit sort should be applied when the requirement defines ranking or deterministic order.

## 3. What is the difference between duplicate events and repeated failures?

**Model answer:** Two identical-looking failures might be separate real events. Deduplication needs a stable event ID or a clearly defined time/content key, not simply equal service names. I would ask whether the task counts observations, unique incidents or latest states before deciding how to deduplicate.

## 4. Why is Counter useful but not sufficient for every aggregation?

**Model answer:** Counter handles integer counts per key cleanly, but it does not automatically validate records, model unique IDs, track averages or decide output ordering. For mean latency, track both sum and count; for unique hosts, maintain sets. Choose a collection based on semantics rather than treating one type as universal.

## 5. How do you rank a Counter with deterministic ties?

**Model answer:** Sort pairs with a key such as (-count, service), which makes the count descending and the service alphabetically ascending. Depending only on insertion order or most_common tie ordering may expose the input sequence instead of the required ranking. Test with equal counts in a shuffled input.

## 6. Why is boolean a possible trap for integer fields in Python?

**Model answer:** In Python, bool is a subclass of int, so isinstance(True, int) returns True. If a JSON status or replica count must be a true integer, use type(value) is int or an explicit schema validator. Otherwise the script may accept true as status 1 and hide malformed data.

## 7. Why does successful json.loads not prove a useful API response?

**Model answer:** A syntactically valid JSON value may be a string, null or object missing the required items array. After decoding, validate container types, required fields, field types and allowed ranges. Treat transport success, syntax success and semantic validation as separate checks.

## 8. Should missing readyReplicas always be treated as zero?

**Model answer:** For a deliberately simplified workload report, zero may be an explicit conservative default. In actual Kubernetes troubleshooting, readiness, observed generation, conditions and rollout state matter, and a missing field can have special meaning. Document the simplified model rather than asserting that one integer fully measures workload health.

## 9. How would you handle malformed rows in a large log?

**Model answer:** Choose a policy according to the report's purpose. A best-effort investigation can count and report skipped lines; an audit or security decision may need to fail entirely. Never silently swallow all exceptions and report a healthy zero count when the input was actually corrupt.

## 10. Why use fullmatch instead of search for structured log records?

**Model answer:** fullmatch requires the complete line to conform to the supported record format. search may match a valid-looking substring while ignoring garbage before or after it. It is useful when rejecting malformed records matters; for exploratory text search, regular search or grep may be more appropriate.

## 11. When would splitting on whitespace be safer than regex?

**Model answer:** For a simple trusted format with fixed whitespace-delimited tokens, split can be easier to understand and maintain. Use regex when the input contract includes optional groups or named captures that benefit from validation. Neither is safe for arbitrary quoted structured data without a format-aware parser.

## 12. Can you use a regex to parse JSON?

**Model answer:** Not reliably for general JSON because escaping, nesting, strings and whitespace have structural rules a simple pattern won't honor. Use Python json or jq to get typed objects. A regex is appropriate only for a deliberately restricted text format, not as a substitute for a JSON parser.

## 13. Why use csv.DictReader rather than line.split(',')?

**Model answer:** CSV fields may contain quoted commas, escaped quotes or even embedded newlines. DictReader follows CSV parsing rules and exposes header-based fields, reducing positional mistakes. Validate header names and types afterward because parsing a CSV structure doesn't validate business values.

## 14. How can a CSV aggregation avoid holding millions of rows?

**Model answer:** Use a streaming DictReader and update per-service sums/counters as each row arrives. The memory footprint then scales with distinct grouping keys rather than total rows. Exact percentiles may need an additional histogram/sketch or external sorting, so describe the trade-off if they are requested.

## 15. What is wrong with treating a missing numeric field as zero?

**Model answer:** Zero is a valid measurement and not the same as unknown or malformed. Substituting zero can understate error counts, costs or latency and make a broken report appear healthy. Use a documented default only when domain semantics explicitly justify it; otherwise reject or record the invalid row.

## 16. Why can float be unsuitable for monetary calculations?

**Model answer:** Binary floating point cannot represent many decimal fractions exactly, so repeated operations can introduce rounding differences. Use integer minor units or Decimal for financial values and define rounding policy. For operational latency averages, float is often acceptable when approximate output is intended.

## 17. Why insist on timezone-aware datetimes?

**Model answer:** A timestamp without offset is ambiguous across environments and daylight saving changes. Normalize aware instants to UTC and compare within an explicitly defined interval. Reject or explicitly interpret naive times according to the input contract rather than silently assuming a timezone.

## 18. Why use a half-open [start,end) interval?

**Model answer:** Adjacent time windows then do not double-count events at the boundary. It is also easy to reason about exact start inclusion and end exclusion in tests. This works only when event timestamps are parsed to comparable instants instead of naively mixed-zone text strings.

## 19. Can ISO timestamps always be sorted as strings?

**Model answer:** Only if they share a normalized timezone and comparable precision and format. Different offsets can make lexicographic order differ from chronological order. For mixed offsets parse with a real date/time library and normalize to UTC first.

## 20. What is the difference between event time and processing time?

**Model answer:** Event time is when the operation occurred; processing time is when the collector observed or ingested it. Delayed delivery can place events into different windows under these definitions. Incident reports should document which clock they use and whether late-arriving records revise prior totals.

## 21. What happens if an API returns the same pagination cursor forever?

**Model answer:** Without a cursor-loop check, the client can repeatedly fetch pages, consume rate limits and never finish. Track cursors already seen and enforce a maximum-page/deadline guard. Surface an explicit incomplete-result error rather than silently returning a partial count.

## 22. What if records change while offset-based pages are fetched?

**Model answer:** Inserts or deletes can shift offsets, causing duplication or omission between requests. A snapshot token or cursor defined by the provider can improve consistency, but guarantees vary by API. State what the endpoint promises and implement deduplication if necessary rather than assuming pages are a stable snapshot.

## 23. Why should HTTP calls have both timeout and retry limits?

**Model answer:** Without timeouts, one stalled call can block the whole script indefinitely; without bounded retries, a failing provider can create an endless loop. Use a total deadline and classify transient failures, with backoff and jitter. A timeout does not prove a side-effecting operation failed, so POST retries require idempotency.

## 24. Would you retry every 4xx error?

**Model answer:** No. Many 4xx errors represent invalid requests or authorization failures that won't improve with retries. Rate limiting (429) can be retryable under provider guidance, while a malformed schema generally needs correction. Decide per API contract and respect Retry-After when applicable.

## 25. What does partial inventory success mean?

**Model answer:** If only the first two of three pages were fetched, reporting their counts as complete can mislead operators. Either fail with a clear incomplete status or return structured partial results with an explicit completeness field if the task permits that. The caller should never have to infer completeness from an apparently normal dictionary.

## 26. How can you test API parsing without network access?

**Model answer:** Inject a fetch function that returns controlled fake pages or raises specific errors. Tests can then cover pagination, timeouts, malformed bodies and repeated cursors deterministically. Keep HTTP transport separate from transformation logic to avoid brittle integration-only tests.

## 27. When should you use a generator instead of a list?

**Model answer:** When the caller can consume items incrementally and the dataset is large or generated lazily. A generator avoids storing every intermediate element, but downstream operations like sorted or list still materialize data. Explain which phase of the pipeline consumes memory rather than calling every generator pipeline constant-memory.

## 28. Why is a thread pool useful for API calls but not always for CPU-heavy work?

**Model answer:** Independent blocking I/O can overlap, reducing elapsed waiting time. Python threading overhead and the interpreter execution model limit improvement for pure CPU-heavy Python loops; processes may suit some CPU tasks. Start sequentially, measure, and only add the simplest concurrency that meets the requirement.

## 29. Does a thread pool of four workers guarantee fewer than sixty requests per minute?

**Model answer:** No. It caps simultaneous work, not request rate. Four very fast workers can issue hundreds of calls per minute. Add a separate rate limiter and honor provider throttling; concurrency and rate are different controls.

## 30. What is a key risk of Executor.map in input order?

**Model answer:** A slow first operation can delay yielding later completed results, even if other workers finish. The underlying calls also need timeouts; worker count alone does not bound total run duration. For modest tasks this trade-off may be acceptable because the code is simpler and output order remains stable.

## 31. What should a small CLI write to stdout versus stderr?

**Model answer:** Put structured results on stdout so another program can parse them. Put diagnostics and errors on stderr and return a nonzero exit code when a required operation fails. Mixing debug prints into JSON stdout can break downstream processing even if the data was otherwise correct.

## 32. Why is except Exception: pass dangerous?

**Model answer:** It hides programming bugs, invalid credentials, malformed data and network failures by converting them into missing output. Catch only expected failure classes and decide whether to reject the record, retry or abort. Always communicate lost or skipped work when completeness matters.

## 33. How do you make a script idempotent?

**Model answer:** Define repeat-run behavior and side effects. For read-and-report scripts, deterministic output may suffice; for writes, use stable operation IDs, check existing state and design safe replacement or retries. An idempotent report calculation doesn't imply a file overwrite or API mutation is automatically safe.

## 34. Why doesn't set -euo pipefail solve every Bash error?

**Model answer:** Bash errexit has documented exceptions; some grep no-match statuses may be expected; pipelines can fail after writing partial output. Explicitly handle expected nonzero codes, quote arguments, validate inputs and use a temporary output file for critical reports. Test failure paths rather than trusting a one-line shell option.

## 35. When is awk better than Python for parsing?

**Model answer:** For a stable line-oriented format with simple fields and arithmetic, a small awk pipeline may be faster to write, read and deploy. For nested JSON, general CSV, timezone-aware dates, nuanced schema validation or reusable tests, Python is usually easier to maintain. Choose by input complexity and operational safety, not line count.

## 36. Why isn't uniq -c enough to count arbitrary duplicates?

**Model answer:** uniq counts only adjacent equal lines, so input ordering matters. Sort first or use a dictionary/awk counter when order cannot be assumed. A deduplication decision also needs to clarify whether identical-looking records represent real repeated events or duplicate delivery.

[Module 9 index](./) · [Hands-on labs](./labs)
