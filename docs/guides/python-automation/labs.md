# Module 9. Python and Shell Automation Labs

Use local synthetic fixtures and a disposable working directory. Never run destructive commands or upload private logs as part of a learning exercise.

## Lab 1: Group and deduplicate service events

**Goal:** Given records with `event_id`, `service` and `status`, count 5xx by service while ignoring identical duplicate event IDs. Reject conflicting records sharing an ID.

**Expected:** A dictionary/set prevents double counting; a Counter collects counts; deterministic sort breaks ties by service name. Test `499`, `500`, `599`, `600`, empty input and a boolean status.

## Lab 2: Parse nested JSON with meaningful errors

Use a JSON object containing an `items` list of workloads with desired and ready replica counts. Report unready workloads, handle missing readiness explicitly and reject malformed types.

```bash
python3 -m json.tool workloads.json >/dev/null
```

**Expected:** Syntax validity does not replace schema validation. Confirm whether a missing `readyReplicas` means zero in the exercise contract; don't assume that applies to all Kubernetes workload conditions.

## Lab 3: Stream access logs

Given 100,000 synthetic fixed-format request lines, count 5xx records by service using Python streaming and a shell pipeline. Compare results against a hand-checked small fixture.

```bash
wc -l access.log
LC_ALL=C sort access.log | head -n 3
```

**Expected:** A line-wise parser does not load the entire log. Document malformed-row handling and why `grep` cannot parse arbitrary JSON.

## Lab 4: CSV aggregation and UTC windows

From CSV `service,status,latency_ms`, calculate counts, 5xx errors and average latency per service using `csv.DictReader`. In a separate timestamped JSON Lines fixture, count errors inside `[start, end)` using UTC-aware datetimes.

**Expected:** Quoted commas are handled, invalid numeric fields are reported, and an event exactly at the end timestamp is excluded. Mixed timezone offsets compare correctly after normalization.

## Lab 5: Mock a paginated API

Use a fake function returning three pages with `items` and `next_cursor`. Test a repeated cursor, malformed page and timeout on the second page. Aggregate by page rather than collecting all objects where possible.

**Expected:** Incomplete retrieval is reported as failure, not a success-shaped partial inventory. Retries are finite, error-specific and independently testable.

## Lab 6: Build and test a small CLI

Use [Chapter 5](./q5) to create a command-line NDJSON error summarizer. Validate stdout as JSON, errors on stderr, nonzero exit codes, strict versus lenient modes and stdin handling.

```bash
python3 -m unittest discover -s tests -v
python3 event_report.py events.ndjson \
  --start 2026-01-01T10:00:00Z \
  --end 2026-01-01T11:00:00Z
```

Compare its result with a documented `jq` or `awk` approach on a simple fixture. Explain when shell is enough and when a proper parser is necessary.

## Evaluation checklist

For every lab note the input contract, expected outputs, error policy, complexity, commands executed and one hidden edge case. A readable correct solution with sensible validation is better than an impressive but opaque implementation.

[Module 9 index](./) · [36 challenging follow-ups](./follow-ups)
