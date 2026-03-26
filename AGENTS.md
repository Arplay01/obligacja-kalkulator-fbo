# Repository Agent Guide

## Purpose

This repository is prepared for Codex-native collaboration with repo-local skills and delegated agents.

## Default Operating Mode

- Start from the user's goal; do not scan the whole repository unless the task truly requires it.
- Read only the files needed for the current task and build context incrementally.
- Keep a short plan for multi-step work.
- Prefer repo-local skills from `.codex/skills/` whenever one matches the task.
- Start human-facing context from `README.md` and thin project context from `docs/project-context.md`.

## Project Routing

- `README.md` is the human-facing landing page for the repository.
- `docs/project-context.md` is the thin canonical context for future sessions.
- `docs/product/brief.md` explains why the calculator exists and for whom.
- `docs/product/prd.md` is the source of truth for product behavior.
- `docs/process/decision-log.md` records the key product and UX/UI decisions in order.
- `docs/process/pivot.md` explains the shift from the first concept to the current product.
- `docs/process/prototyping-notes.md` is the visual history of iterations and checkpoints.
- `docs/process/process-patterns.md` captures the working patterns behind the iterations.
- `@archiwum/` contains historical documents and older assumptions. Treat it as non-canonical unless the task is explicitly about history or comparison.
- `kalkulatory-robocze/` contains historical prototype artifacts and is non-canonical by default.

## Local Skills Convention

- Store project skills in `.codex/skills/<skill-name>/`.
- Every skill must include `SKILL.md`.
- Add `agents/openai.yaml` for discoverability in agent-aware UIs and harnesses.
- Keep `SKILL.md` concise; move deeper material into `references/` only when it becomes necessary.
- Prefer one clear responsibility per skill.

## Preferred Skill Routing

- Use `obligacja-fbo` as the primary repo orchestrator.
- Use `product-spec-lead` for scope, requirements, and acceptance criteria.
- Use `finance-logic-analyst` for bond logic, formulas, and current official parameters.
- Use `nextjs-typescript-architect` for app structure and implementation.
- Use `ux-flow-copy-expert` for flow, explanations, labels, and microcopy.
- Use `data-viz-expert` for result presentation, tables, and charts.
- Use `qa-review-analyst` for review findings, test scenarios, and validation gaps.
- Use `session-wrap-up` when the user types `/end` or asks for a session summary, handoff, or worklog update.

## Session Memory

- Use `.codex/memory/session-log.jsonl` as the append-only history of completed sessions.
- Use `.codex/memory/session-state.json` as the lightweight state file for `/end` handling.
- Treat `/end` as a repo convention that triggers `session-wrap-up`.
- Do not read `.codex/memory/session-log.jsonl` during normal implementation, research, or review work.
- Do not read `.codex/memory/session-state.json` during normal work unless you are handling `/end` or session bookkeeping.
- Read the session log only when the user explicitly asks for handoff, history, retrospection, or decision analysis.
- Only the main coordinating agent writes to the session log by default.
- Subagents should return concise handoff notes to the main thread and should not append to the session log unless explicitly assigned that file.
- A repeated `/end` with no meaningful new work should produce a no-op, not another full log entry.
- If work resumes after `/end` in the same conversation, the next `/end` should append an `addendum`.
- If a new conversation starts after a closed session, the next `/end` should start a fresh session.

## Agent Delegation

- Use subagents for parallel exploration, independent review, or narrow verification.
- Give each subagent one objective, one owning skill, and the minimum context it needs.
- Consolidate findings in the main thread before editing files.

## Change Discipline

- Do not perform broad rewrites without explicit scope.
- Preserve user changes and work with the current tree as-is.
- When a workflow or rule becomes repetitive, encode it as a repo-local skill instead of repeating it in chat.
- Do not treat archived prototype prompts or older specs from `@archiwum/` as current product context unless the task is explicitly historical.
- For bug fixes explicitly reported by the user during vibe coding, add a short inline code comment after the fix is working that records what was broken and how it was fixed.
- Do not add this bugfix comment trail for the agent's own silent or automatic fixes unless a comment is independently useful for readability or maintenance.
- In user-facing copy, documentation, and UI text, never use the em dash character `U+2014`; use the plain hyphen `-` instead.
