# Source Policy

Use this reference when the task touches current bond parameters, dates, rates, margins, or officially published product rules.

## Source Hierarchy

1. Official treasury bond product pages and official terms for the specific bond series.
2. Ministerstwo Finansow or other direct government publications for issuance rules and announcements.
3. Official statistical or central-bank sources only when the formula depends on their published values.

## Non-Negotiable Rules

- Do not present stale memory as a current financial fact.
- Do not infer a current parameter from an old article, cached page, or blog summary.
- If multiple official pages disagree, flag the conflict and stop for clarification.
- Record the exact source and date used for each time-sensitive parameter.
- Keep a hard boundary between verified facts, derived calculations, and assumptions.
- If the user did not provide a required input, ask for it instead of silently assuming a default.

## Calculation Discipline

- Show the steps that materially affect the result: rate basis, margin, capitalization, tax, fees, and net result when relevant.
- Make units explicit: percent vs percentage points, gross vs net, annual vs monthly, one bond vs total package.
- Cross-check at least one simple reference case before treating the logic as ready.

## Reporting

- Label results as `zweryfikowane`, `częściowo zweryfikowane`, or `niezweryfikowane`.
- If a PoC simplification changes the outcome, name it and state the likely impact.
- Present outputs as calculations under stated assumptions, not as investment advice.
