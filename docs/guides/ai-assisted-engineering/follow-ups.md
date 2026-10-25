# Module 10. 40 Challenging Questions on ADE and Plan–Build–Review

These questions focus on responsibility, problem solving, implementation evidence and independent review. Try answering aloud before reading the full model response.

## 1. What is the difference between an AI chat assistant and an ADE with tool access?

**Model answer:** A chat assistant proposes text and code, while an agentic workspace can inspect files, change code and run commands within its permissions. That makes evidence and authorization more important, not less. The engineer must know whether the assistant is merely suggesting an operation or has actually executed it. Tool results should be checked before claiming success.

## 2. Is Plan–Build–Review a product feature or a universal standard?

**Model answer:** It is a useful working framework used in this guide, not an assertion that every editor or company uses the same named standard. Planning establishes scope and acceptance, building implements bounded changes, and reviewing challenges the result with independent evidence. Different tools may name these stages differently or omit a mode entirely. The principles remain applicable without automation.

## 3. When is Ask mode enough for a coding exercise?

**Model answer:** Ask mode is enough when the main obstacle is a syntax question, complexity clarification or edge-case brainstorm. A small task may be faster to implement directly with human-written tests than to involve file-writing agents. Avoid granting write or execution privileges just because they are available. Only delegate work whose value and risks you understand.

## 4. Why should you plan before giving an agent write access?

**Model answer:** Planning lets you clarify inputs, output, acceptable failures, affected files and tests while no code has changed. It catches wrong assumptions before they become large diffs and gives the engineer a chance to reject unnecessary dependencies. For a tiny function a short verbal plan is enough. For risky multi-file work, require explicit acceptance criteria and rollback boundaries.

## 5. What does the engineer own when AI writes most of the code?

**Model answer:** The engineer owns the interpretation of requirements, permission boundaries, correctness claims, security implications and handoff. A model's confidence or claimed test success does not transfer responsibility. You should be able to explain the algorithm and its limitations without opening the assistant conversation. If you cannot, the task is not ready for approval.

## 6. What is the risk of providing an entire repository to an assistant?

**Model answer:** More context is not automatically better. Unrelated files can distract the agent, increase the chance of leaking secrets and introduce untrusted instructions from comments or generated content. Begin with relevant entrypoints, tests and configuration; expand only when dependencies demand it. Use sanitized fixtures and tightly scoped read permissions.

## 7. What is prompt injection in a coding workspace?

**Model answer:** A comment, file or tool output may contain text instructing the agent to ignore higher-priority goals, reveal secrets or execute commands. Such content is task data, not an authorized instruction. Treat it as untrusted, enforce tool permissions and inspect commands before execution. Never assume an agent can reliably distinguish safety solely from polite prompt wording.

## 8. How do you tell a proposal from verified implementation?

**Model answer:** A proposal describes intended behavior and planned tests; verification means actual code was changed and an identified command produced observed output. Ask for file paths, diff, test command, exit code and specific results. A plan marked complete is not test evidence. Report untested assumptions separately from passing checks.

## 9. What should the first minute of a coding problem accomplish?

**Model answer:** Establish the function signature, valid input shape, exact expected output, failure policy and one hand-worked example. Identify whether duplicates, ties and sorting are important. If a constraint is absent, state a reasonable assumption instead of inventing a complex requirement. The best early work reduces ambiguity and prevents unnecessary rewrites.

## 10. Why should you restate a problem in your own words before asking for code?

**Model answer:** Restating forces you to separate transformation rules from examples and reveals missing semantics. It also gives the assistant a concrete contract to critique instead of a vague prompt. If you cannot explain what counts as a successful result, generated code cannot be meaningfully reviewed. Treat restatement as a correctness check, not a ceremonial step.

## 11. How should hidden or unseen test cases affect preparation?

**Model answer:** They are a reminder that visible examples do not cover every valid input. Derive your own tests from boundaries, invalid types, duplicates, ordering and resource limits rather than trying to guess secret inputs. Write general code that follows the contract. Never claim that passing visible examples proves correctness across every case.

## 12. What is a good edge-case test for HTTP status filtering?

**Model answer:** Use 499, 500, 599 and 600 alongside malformed strings and boolean values. These distinguish inclusive 5xx bounds from naive status >= 500 and type-coercion bugs. Define whether invalid statuses should be rejected or skipped, then assert that behavior. One boundary test often catches more than many duplicated happy-path examples.

## 13. How do you handle a requirement that does not specify duplicate semantics?

**Model answer:** Ask whether repeated records are distinct observations or duplicate deliveries and what identifies an event. If clarification is unavailable, state an assumption explicitly and write tests for that interpretation. Do not silently deduplicate by service name or entire payload without a stable identity contract. Such choices change the business meaning of the output.

## 14. What is the simplest approach to count events by service?

**Model answer:** Scan the records once, validate required fields and update a dictionary or Counter keyed by service. Sort the distinct groups only if ordering is required. Complexity is expected O(n + k log k) for n events and k distinct services, with grouping storage O(k). Avoid nested list searches or elaborate class hierarchies unless the contract requires them.

## 15. How should an assistant explain two possible algorithms?

**Model answer:** It should compare correctness, readability, asymptotic cost, memory and constraints without inventing performance claims. For small inputs a simple sorted solution is often preferable; for large streaming data, incremental aggregation may be necessary. Ask the agent to recommend one with an explicit reason. More options are not always better.

## 16. When is a written implementation plan too long?

**Model answer:** When it consumes more effort than the task and provides no additional correctness evidence. A three-line grouping function does not require a distributed design document or framework. Make plans proportional to side effects, scope, input uncertainty and test difficulty. The goal is to prevent wrong work, not produce documentation for its own sake.

## 17. What belongs in an acceptance criterion?

**Model answer:** Observable conditions on inputs, outputs and failures, ideally with examples a test can execute. Say 'same event ID counts once; conflicting payload raises ValueError; ties sort alphabetically' rather than 'robust and scalable'. Include resource/permission constraints when applicable. A vague criterion cannot determine whether implementation is done.

## 18. Why is a plan not proof that something worked?

**Model answer:** Plans describe actions that have not necessarily happened. A statement like 'run tests and confirm' is a future intention until the command runs and its output is observed. Keep completion notes separate and attach evidence such as exit codes and test counts. Do not convert speculative assumptions into reported results.

## 19. What is a bounded build step?

**Model answer:** A small change with a clear objective, explicitly permitted files and a specific verification. For example, add input validation to one parser and two tests, not refactor the whole repository. This makes failures attributable and reviewable. Agents can still iterate, but each step should preserve previous contracts.

## 20. Why should an AI-generated implementation avoid unnecessary libraries?

**Model answer:** Each dependency adds install time, version compatibility, supply-chain exposure and cognitive overhead. For basic JSON, CSV, regex, collections and HTTP operations, the standard library often suffices. Add a package only when it provides necessary capabilities or improves maintainability materially. A short coding exercise rarely needs a dependency graph.

## 21. How do you use tests during the build phase?

**Model answer:** Start with representative and edge-case expectations, implement the minimum behavior, run the tests and inspect failures before adding more code. Don't rewrite tests merely to hide an implementation bug. When the agent executes tests, require the exact command and exit status. New tests should fail meaningfully against a known broken variant where practical.

## 22. Why inspect the diff even after all tests pass?

**Model answer:** Tests cover only what they assert. The agent may have modified unrelated files, weakened security checks, changed dependencies or added accidental behavior outside coverage. A diff reveals scope and unintended changes. Check file paths, interface compatibility and whether any test fixture was altered to manufacture success.

## 23. What if the agent wants to change files beyond the approved scope?

**Model answer:** Stop and ask it to explain the necessity, impact and alternative approach. Broad edits require new authorization, especially for CI, credentials, infrastructure and public APIs. Do not approve merely because the agent asserts a large refactor is clean. Prefer targeted fixes whose behavior can be independently tested.

## 24. What is a useful code review prompt?

**Model answer:** Ask the reviewer to find concrete specification violations, each with a minimal failing input and expected-versus-actual behavior. Include validation, duplicates, boundaries, ordering, complexity and side effects. Instruct it not to edit during review and to label hypotheses separately from proven defects. Vague requests for 'improvements' tend to produce style suggestions instead of correctness evidence.

## 25. Does having two AI agents agree prove correctness?

**Model answer:** No. They may share training assumptions, misunderstand the same requirement or omit the same edge case. Independent review context can reduce confirmation bias, but executed counterexamples and a grounded contract are more decisive. The engineer should test claims rather than counting endorsements. Agreement is weak evidence without observation.

## 26. What is a metamorphic test for a counting problem?

**Model answer:** A property that should hold after a controlled transformation of input. For order-insensitive counts, shuffling records should not change output. If identical duplicate delivery must be ignored, adding a duplicate with the same ID should not change counts. These tests often expose bugs not covered by fixed examples, provided the transformations respect the specified semantics.

## 27. Why is a passing syntax check not a passing behavior test?

**Model answer:** Compilation or parsing shows the program is syntactically valid, not that it handles correct data, invalid data or expected output. Run unit tests and manually verify at least one independent example. Then inspect complexity and side effects. Treat different check types as separate pieces of evidence.

## 28. What are dangerous patterns in operational scripts generated by AI?

**Model answer:** Untrusted shell interpolation, eval, broad exception swallowing, infinite retries, unbounded downloads, secret logging and mutations without dry-run or approval. Review subprocess calls and filesystem paths especially carefully. Use injected fake clients for tests and bound time, memory and request volume. A readable short script can still be risky if its failure behavior is wrong.

## 29. What does 'complete inventory or explicit failure' mean?

**Model answer:** A script that fetches only two of three API pages should not return a normal successful count that looks complete. It must either fail or return structured partial results with an explicit completeness flag when allowed. Cursor loops, malformed pages and timeouts all affect report credibility. The definition of success includes data completeness, not just successful serialization.

## 30. What is an appropriate use of concurrency in a coding exercise?

**Model answer:** Only when the requirement or measurements justify it. For a simple aggregation over in-memory records, concurrency usually increases complexity without improving correctness. For independent blocking API calls, a bounded pool may reduce latency, but rate limits and timeouts still need control. Prove sequential correctness before optimizing.

## 31. How would you introduce a new team member to a multi-file repo using an ADE?

**Model answer:** Start with the public entrypoint, relevant modules, tests and build command. Ask the agent for a read-only map of the call path and the smallest proposed change. Verify the file paths and assumptions yourself. Then approve limited edits and inspect test results and the diff. Avoid treating a generated repository summary as complete knowledge.

## 32. What should you check when an agent repairs a paginated API client?

**Model answer:** Confirm that it follows the actual cursor contract, validates page shape, stops on null, rejects repeated cursors and marks partial failure clearly. Ensure it has finite limits and tests injected fake responses, not only a live endpoint. Review whether aggregate logic should stream rather than retain every page. Preserve the existing public CLI or API return contract.

## 33. What should a final engineering handoff say?

**Model answer:** Describe the requirement and observed bug, changed files, minimal rationale, tests that actually ran and their outputs, plus unverified risks. Avoid vague 'all good' claims. If production integration was not exercised, say so. Handoffs should let another engineer reproduce evidence and decide whether to deploy.

## 34. How do you use AI efficiently when time is limited?

**Model answer:** Use it to remove a real blocker: syntax clarification, test ideas, targeted debugging or small review. Do not spend longer prompting than implementing a trivial function yourself. Reserve time for independent tests and explanation. Prioritize a simple correct solution over elaborate automation, and adapt the planning depth to the task.

## 35. How do you maintain your own programming skill while using AI often?

**Model answer:** Regularly solve small tasks independently, predict outputs before execution, explain generated code aloud and rewrite solutions from first principles. Alternate no-AI, Ask-only and full agentic exercises with the same fixtures. Track mistakes and improve test design rather than memorizing prompts. The goal is greater judgment and capability, not dependence on generated text.

## 36. What metrics show that an ADE workflow is helping?

**Model answer:** Measure verified task completion, time to useful result, bugs caught before handoff, change scope, reviewability and permission incidents. Generated line count or prompt length are not meaningful success metrics. Compare against a manual baseline on similar tasks. A workflow is useful when it improves correctness and safe delivery without adding unnecessary maintenance burden.

## 37. What is the biggest mistake in an AI-assisted coding assessment or exercise?

**Model answer:** Treating the assistant's polished answer as proof and losing the ability to explain the algorithm, edge cases or failure policy. Clarify what assistance is allowed, own the specification and use the tool transparently within those rules. Run the code, test independently and describe trade-offs in plain language. The final solution must be yours to defend and maintain.

## 38. Why keep an evidence ledger for longer agent tasks?

**Model answer:** It separates approved scope, observations, tested behavior and unresolved assumptions. A concise record of commands, outputs, decisions and remaining risks helps future reviewers and later sessions avoid treating plans as facts. It is more useful than a raw chat transcript. Exclude secrets and unrelated sensitive data from the record.

## 39. What is the value of a separate Review stage after Build?

**Model answer:** The implementation stage naturally focuses on making code work, which can reinforce the initial design's blind spots. Review deliberately seeks counterexamples, unintended file changes and permission violations, using the specification and independent test evidence. If issues are found, return to planning for a corrected assumption or to building for a bounded fix. This closes the loop rather than ending at a green example.

## 40. When is it appropriate to prevent the coding agent from using the network?

**Model answer:** When the task can be solved from supplied fixtures or repository code, internet access may add risk without value. Restrict external calls for untrusted inputs, proprietary source, secrets, rate-limited providers and environments with unauthorized side effects. If an external dependency is genuinely necessary, approve exact destinations and purposes. Run unit tests with mocks first and record which real integrations remain unverified.

[Module 10 index](./) · [Hands-on labs](./labs)
