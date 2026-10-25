# Module 9. Python and Shell Automation for Platform Engineers

Practical, intermediate-level coding skills for working with API responses, logs, CSV exports, timestamps and infrastructure inventories. The focus is straightforward, reliable **data processing and automation**, not framework development or competitive algorithm tricks.

::: info Public educational guide
All services, endpoints, inputs and incidents are synthetic. Commands and snippets must be adapted and tested before real operational use. No exercise assumes access to private systems or a particular coding platform.
:::

## Prerequisites

Basic Python syntax and functions, shell execution, Linux files/pipes and simple HTTP concepts. You do not need advanced algorithms or application framework experience.

## Learning objectives

- Choose lists, dictionaries, sets and Counters appropriately, with basic complexity awareness.
- Validate nested JSON, parse text logs and aggregate CSV safely.
- Handle UTC-aware timestamp windows and deduplicate by meaningful record identity.
- Fetch paginated APIs with clear error, timeout and retry semantics.
- Build small CLI utilities with useful tests and nonzero failure exit codes.
- Use Bash, `jq`, `awk`, `grep`, `sort` and `uniq` effectively, and know when Python is a better fit.

## Six consolidated chapters

1. [Core Python: data structures, sorting and deduplication](./q1)
2. [Parsing JSON, logs and CSV](./q2)
3. [Timestamps, generators, batching and concurrency](./q3)
4. [HTTP APIs, cursors, error handling and retries](./q4)
5. [Complete CLI automation: validation, testing and results](./q5)
6. [Linux shell processing: Bash, jq, awk, sed and pipelines](./q6)

## Practice

- [Six practical data-processing labs](./labs)
- [36 challenging questions with full model answers](./follow-ups)

## Study sequence

Begin with Python structures and parsing, then handle time and remote APIs. Use the CLI chapter to combine those fundamentals into a maintainable tool. Compare the same processing tasks with shell in the final chapter, and complete the labs with small fixtures and independent expected outputs. Use [Module 10](/guides/ai-assisted-engineering/) for a separate, deeper discussion of AI-assisted problem solving and Plan–Build–Review.

## Language and tool references

- [Python standard library](https://docs.python.org/3/library/)
- [Python collections](https://docs.python.org/3/library/collections.html)
- [Python json](https://docs.python.org/3/library/json.html)
- [Python csv](https://docs.python.org/3/library/csv.html)
- [Bash manual](https://www.gnu.org/software/bash/manual/)
- [jq manual](https://jqlang.github.io/jq/manual/)

[← All guides](/guides/) · [Start chapter 1](./q1)
