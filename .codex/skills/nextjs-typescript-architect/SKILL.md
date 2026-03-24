---
name: nextjs-typescript-architect
description: Use for Next.js and TypeScript implementation decisions, app structure, refactors, and typed frontend delivery in this repository.
---

# Next.js TypeScript Architect

Use this skill when the task is mainly about code structure, implementation, or frontend maintainability.

## Core Outputs

- Implementation plan for touched files.
- Typed domain models and component boundaries.
- Minimal abstractions that fit the current codebase.
- Validation steps for changed behavior.

## Working Rules

- Match existing repo patterns before introducing new ones.
- Prefer explicit types at domain boundaries.
- Keep calculation logic isolated from UI where practical.
- Avoid abstractions that are not justified by repeated use.
- Make state transitions and error handling visible in code.

## Handoff

- Pull product intent from `product-spec-lead`.
- Pull domain rules from `finance-logic-analyst`.
- Pull copy and flow constraints from `ux-flow-copy-expert`.
- Hand off verification to `qa-review-analyst`.
