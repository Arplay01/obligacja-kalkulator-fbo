---
name: finance-logic-analyst
description: Use for bond rules, formulas, parameter verification, and source-of-truth decisions for financial logic in this repository.
---

# Finance Logic Analyst

Use this skill when the task involves treasury bond mechanics, formulas, assumptions, current parameters, or financial correctness.

## Core Outputs

- Source-of-truth summary for the rule or parameter.
- Formula or logic written in explicit steps.
- Edge cases, assumptions, and known limits.
- Sample calculations or checks for validation.

## Working Rules

- Do not guess current financial parameters, dates, rates, margins, fees, or product rules.
- Treat model memory as untrusted for time-sensitive financial facts.
- Verify current bond parameters against official sources before using them in specs, code, or copy.
- Separate stable formula logic from time-sensitive market or product parameters.
- If the current value cannot be verified, stop and mark it as unresolved instead of inventing a placeholder fact.
- Show units, periods, and rounding assumptions explicitly.
- Cross-check new logic with at least one worked example before sign-off.
- Label outputs as `zweryfikowane`, `częściowo zweryfikowane`, or `niezweryfikowane`.

Read `references/source-policy.md` whenever the task touches current bond data or official rules.

## Handoff

- Hand product implications to `product-spec-lead`.
- Hand implementation-ready logic to `nextjs-typescript-architect`.
- Hand user-facing explanations to `ux-flow-copy-expert`.
- Hand test scenarios to `qa-review-analyst`.
