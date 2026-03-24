---
name: obligacja-fbo
description: Use when working in this repository to route tasks to the right specialist skill, keep context small, and coordinate Codex agents safely.
---

# Obligacja FBO Repo Skill

Use this skill as the repo orchestrator. Start here when the task spans multiple domains, needs delegation, or requires a clean handoff between product, UX, finance, QA, and implementation work.

## Quick Start

1. Read `AGENTS.md`.
2. Read `docs/project-context.md` before loading deeper docs.
3. Define the smallest file set that can answer the request.
4. Route the task to the narrowest matching specialist skill before improvising.
5. If the task is larger than one focused workstream, delegate with explicit ownership.
6. After edits, run the narrowest useful validation for touched behavior.
7. Report changes, validation, assumptions, and remaining risks.
8. Ignore `.codex/memory/session-log.jsonl` unless the user explicitly asks for history or wrap-up.
9. Ignore `.codex/memory/session-state.json` unless the task is `/end` or session bookkeeping.
10. Ignore `kalkulatory-robocze/` unless the task is explicitly about prior prototypes or design comparison.

## Specialist Routing

- Use `product-spec-lead` for brief, PRD, scope, and acceptance criteria.
- Use `finance-logic-analyst` for bond rules, formulas, source-of-truth, and current official parameters.
- Use `nextjs-typescript-architect` for app structure, typed implementation, and refactors.
- Use `ux-flow-copy-expert` for novice-user flow, plain language, empty states, and helper text.
- Use `data-viz-expert` for tables, charts, comparison logic, and result readability.
- Use `qa-review-analyst` for findings-first reviews, edge cases, and test scenarios.
- Use `session-wrap-up` when the user types `/end` or asks to close the session with a logged summary.

## Document Routing

- Use `docs/product/brief.md` for product framing.
- Use `docs/product/prd.md` for product behavior.
- Use `docs/product/calculation-spec.md` for PoC logic.
- Use `docs/product/source-of-truth.md` when current parameters or validation sources matter.
- Use `docs/product/prototype-brief.md` for rapid prototyping.
- Use `docs/product/prototype-review-rubric.md` to evaluate generated directions.

Do not feed `docs/product/prd.md` directly into a prototype generator.

## Delegation Rules

- Use an explorer when you need a precise answer about the codebase.
- Use a worker only for bounded production work with a disjoint write scope.
- Keep the blocking step local; delegate sidecar tasks in parallel.
- Reuse an existing agent for follow-up questions on the same slice of work.
- Do not delegate ownership of the same files to multiple agents.

Read `references/collaboration.md` before spawning multiple agents or preparing a handoff.

## Validation

- Prefer targeted checks over full-suite runs unless the change is cross-cutting.
- If validation cannot run, say why and describe the highest-risk unverified path.
- When behavior is ambiguous, surface the assumption instead of baking it in silently.

Read `references/validation.md` when choosing what to run after edits.
