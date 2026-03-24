#!/usr/bin/env python3

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4


def clean_items(values):
    return [value.strip() for value in values if value and value.strip()]


def unique_preserve_order(values):
    seen = set()
    result = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


def utc_timestamp():
    return (
        datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z")
    )


def load_state(path):
    if not path.exists():
        return {
            "current_session_id": None,
            "status": "idle",
            "entry_count": 0,
            "last_entry_type": None,
            "last_logged_at": None,
            "last_updated_at": None,
        }

    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)

    return {
        "current_session_id": data.get("current_session_id"),
        "status": data.get("status", "idle"),
        "entry_count": int(data.get("entry_count", 0)),
        "last_entry_type": data.get("last_entry_type"),
        "last_logged_at": data.get("last_logged_at"),
        "last_updated_at": data.get("last_updated_at"),
    }


def save_state(path, state):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as handle:
        json.dump(state, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def new_session_id(timestamp):
    return f"session-{timestamp}-{uuid4().hex[:8]}"


parser = argparse.ArgumentParser(
    description="Append a concise session entry to the append-only JSONL log."
)
parser.add_argument(
    "--log",
    default=".codex/memory/session-log.jsonl",
    help="Path to the JSONL session log.",
)
parser.add_argument(
    "--state",
    default=".codex/memory/session-state.json",
    help="Path to the lightweight JSON session state file.",
)
parser.add_argument(
    "--timestamp",
    default=utc_timestamp(),
    help="ISO 8601 timestamp for the session entry.",
)
parser.add_argument(
    "--actor",
    default="main_agent",
    help="Who is writing the entry. Defaults to main_agent.",
)
parser.add_argument(
    "--session-goal",
    default="",
    help="Short description of the session goal.",
)
parser.add_argument(
    "--work-completed",
    action="append",
    default=[],
    help="Repeat for each completed work item.",
)
parser.add_argument(
    "--decision",
    action="append",
    default=[],
    help="Repeat for each explicit decision made in the session.",
)
parser.add_argument(
    "--file-touched",
    action="append",
    default=[],
    help="Repeat for each changed or materially reviewed file.",
)
parser.add_argument(
    "--validation",
    action="append",
    default=[],
    help="Repeat for each validation action or status note.",
)
parser.add_argument(
    "--open-question",
    action="append",
    default=[],
    help="Repeat for each unresolved point.",
)
parser.add_argument(
    "--next-step",
    default="",
    help="Short statement of the most sensible next step.",
)
parser.add_argument(
    "--agent-involved",
    action="append",
    default=[],
    help="Repeat for each subagent or specialist role involved.",
)
parser.add_argument(
    "--print-entry",
    action="store_true",
    help="Print the appended entry or noop result to stdout.",
)
parser.add_argument(
    "--new-session",
    action="store_true",
    help="Start a fresh session before appending the wrap-up entry.",
)
parser.add_argument(
    "--resume-session",
    action="store_true",
    help="Resume the last closed session and append an addendum entry.",
)
args = parser.parse_args()

if args.new_session and args.resume_session:
    parser.error("Use only one of --new-session or --resume-session.")

log_path = Path(args.log)
state_path = Path(args.state)
timestamp = args.timestamp.strip()
state = load_state(state_path)

if args.new_session or not state["current_session_id"]:
    state = {
        "current_session_id": new_session_id(timestamp),
        "status": "open",
        "entry_count": 0,
        "last_entry_type": None,
        "last_logged_at": None,
        "last_updated_at": timestamp,
    }
elif args.resume_session:
    state["status"] = "open"
    state["last_updated_at"] = timestamp
elif state["status"] == "closed":
    result = {
        "status": "noop",
        "reason": "session_already_closed",
        "session_id": state["current_session_id"],
        "last_entry_type": state["last_entry_type"],
        "last_logged_at": state["last_logged_at"],
    }
    if args.print_entry:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0)

log_path.parent.mkdir(parents=True, exist_ok=True)
state_path.parent.mkdir(parents=True, exist_ok=True)

entry_type = "wrap_up" if state["entry_count"] == 0 else "addendum"
entry = {
    "timestamp": timestamp,
    "session_id": state["current_session_id"],
    "entry_type": entry_type,
    "actor": args.actor.strip(),
    "session_goal": args.session_goal.strip(),
    "work_completed": clean_items(args.work_completed),
    "decisions": clean_items(args.decision),
    "files_touched": unique_preserve_order(clean_items(args.file_touched)),
    "validation": clean_items(args.validation),
    "open_questions": clean_items(args.open_question),
    "next_step": args.next_step.strip(),
    "agents_involved": unique_preserve_order(clean_items(args.agent_involved)),
}

if not entry["session_goal"]:
    parser.error("--session-goal cannot be empty when writing a log entry.")

if not (
    entry["work_completed"]
    or entry["decisions"]
    or entry["files_touched"]
    or entry["open_questions"]
):
    parser.error(
        "Provide at least one of --work-completed, --decision, --file-touched, or --open-question."
    )

with log_path.open("a", encoding="utf-8") as handle:
    handle.write(json.dumps(entry, ensure_ascii=False) + "\n")

state["status"] = "closed"
state["entry_count"] += 1
state["last_entry_type"] = entry_type
state["last_logged_at"] = timestamp
state["last_updated_at"] = timestamp
save_state(state_path, state)

if args.print_entry:
    print(json.dumps(entry, ensure_ascii=False, indent=2))
