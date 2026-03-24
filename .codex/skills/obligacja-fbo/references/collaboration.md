# Collaboration Reference

Use this note when the task benefits from multiple agents or when you need a clean handoff.

## When To Delegate

- Delegate only sidecar work that does not block your immediate next step.
- Split work by file ownership or by a clearly separate question.
- Avoid parallel agents if they would read and rewrite the same files.
- Prefer one specialist skill per delegated task.

## What To Include In A Delegated Task

- The exact outcome you need.
- The specialist skill or role the agent should use.
- The files or directory slice the agent owns.
- A reminder that other agents may be editing nearby code.
- The expected validation for that slice, if any.

## Handoff Checklist

- What changed.
- What was validated.
- What assumptions were made.
- What remains risky or unresolved.

## Session Logging

- Subagents should return handoff notes to the main thread instead of writing `.codex/memory/session-log.jsonl` directly.
- The main coordinating agent decides what is important enough to enter the append-only session log.
- Read the session log only for handoff, retrospection, or explicit history tasks.
- Only the main coordinating agent should read or update `.codex/memory/session-state.json`.
