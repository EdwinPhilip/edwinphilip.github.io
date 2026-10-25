# Module 10. AI-Assisted Engineering: ADE and Plan–Build–Review

**A practical, vendor-neutral field guide to solving coding problems and working with agentic coding tools without surrendering engineering judgment.**

AI can accelerate exploration, planning, boilerplate, debugging and code review. It cannot replace a clearly understood requirement, bounded tool permissions or independently observed test evidence. This module teaches a repeatable **Plan–Build–Review (PBR)** practice and explains how to use an **Agentic Development Environment (ADE)** responsibly.

::: info Scope
All examples use synthetic JSON, services and repositories. Product and assessment environments differ in their execution and assistance capabilities; the methods here are not instructions for any particular interview or platform. Always follow the applicable rules and only use assistance or tools that are explicitly allowed in the environment.
:::

## Prerequisites

- Basic Python collections, JSON parsing and file handling, covered in [Module 9](/guides/python-automation/).
- Comfort running small tests and reading an exception trace.
- Familiarity with Git status/diff for repository-based tasks.
- No previous coding-agent experience is required.

## Outcomes

Learn to translate a request into an input/output contract, derive tests, compare simple algorithms, decide when to use Ask/Plan/Edit modes, authorize scoped workspace actions, independently review changes, handle untrusted context and communicate verified outcomes and remaining uncertainty.

## Chapters

1. [What an ADE is: agent loop, capabilities and permission boundaries](./q1)
2. [Approaching a coding question: contracts, edge cases and complexity](./q2)
3. [Plan: problem decomposition and test-first acceptance criteria](./q3)
4. [Build: bounded edits and small verified implementation steps](./q4)
5. [Review: adversarial tests, correctness and change inspection](./q5)
6. [Worked example: complete Plan–Build–Review of a parsing task](./q6)
7. [Multi-file engineering: repository navigation, ownership and PR review](./q7)
8. [Failure patterns, safety, time management and deliberate practice](./q8)

## Exercises

- [Eight hands-on exercises and review checklists](./labs)
- [40 difficult questions with model answers](./follow-ups)

## Recommended path

Start with Q1–Q2 to establish the tool boundary and the problem-solving contract. Practice planning and implementation in Q3–Q4, then learn to challenge a result in Q5. Complete the worked example independently in Q6, expand to repository work in Q7 and finish by designing your personal operating discipline in Q8. Use the challenge bank to explain trade-offs aloud.

**This framework is a working method, not an assertion that all engineering tools use the same terminology.** For very small exercises a single clear function and tests may be preferable to a full multi-step agent process.

[← Knowledge base](/guides/) · [Start chapter 1](./q1)
