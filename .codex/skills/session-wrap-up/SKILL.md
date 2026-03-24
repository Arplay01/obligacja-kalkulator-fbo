---
name: session-wrap-up
description: Use when the user types /end or asks for a wrap-up, handoff note, session summary, or append-only worklog update in this repository.
---

# Session Wrap Up

Use this skill to close the current session and append one concise entry to `.codex/memory/session-log.jsonl`, using `.codex/memory/session-state.json` to avoid duplicate wrap-ups.

## Trigger

- The user types `/end`.
- The user asks for a wrap-up, handoff note, session summary, worklog update, or end-of-session log entry.

## Working Rules

- The main coordinating agent writes the log entry by default.
- Subagents should contribute concise handoff notes but should not append to the log unless explicitly assigned that file.
- Do not read `.codex/memory/session-log.jsonl` while preparing a normal task.
- Read `.codex/memory/session-state.json` only when handling `/end` or explicit session bookkeeping.
- Do not reopen the log during wrap-up unless the user explicitly asks for a history-aware synthesis.
- Log distilled outcomes, not raw transcripts, long reasoning, or full diffs.
- If `/end` is repeated with no new work, return a no-op instead of appending noise.
- If meaningful work resumes after `/end` in the same conversation, append an `addendum` instead of a second full wrap-up.
- If the current conversation is a fresh work session, start a new `session_id`.

## Required Fields

- `session_goal`
- `work_completed`
- `decisions`
- `files_touched`
- `validation`
- `open_questions`
- `next_step`

## Procedure

1. Gather outcomes from the current session and any delegated handoff notes.
2. Decide whether this `/end` is a new wrap-up, an addendum, or a no-op.
3. Reduce the outcomes to concise bullets.
4. Append one JSONL entry with `scripts/append_session_log.py`.
5. Confirm what was written and call out anything still unresolved.

## Script

Run `python3 .codex/skills/session-wrap-up/scripts/append_session_log.py`.

Mode flags:

- `--new-session` for the first `/end` of a fresh conversation or work session.
- `--resume-session` when more work happened after a previous `/end` in the same conversation and the next entry should be an `addendum`.

Repeated list flags:

- `--work-completed`
- `--decision`
- `--file-touched`
- `--validation`
- `--open-question`
- `--agent-involved`
