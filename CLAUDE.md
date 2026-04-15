# Obligacja Kalkulator FBO

Proof of concept kalkulatora obligacji skarbowych dla Finanse Bardzo Osobiste.

## Quick Start

1. Read `docs/project-context.md` before loading deeper docs.
2. Define the smallest file set that can answer the request.
3. Route the task to the narrowest matching domain (see Domain Knowledge below).
4. After edits, run the narrowest useful validation for touched behavior.
5. Report changes, validation, assumptions, and remaining risks.

## Project Routing

- `README.md` - human-facing landing page / case study.
- `docs/project-context.md` - thin canonical context for sessions.
- `docs/product/brief.md` - why the calculator exists and for whom.
- `docs/product/prd.md` - source of truth for product behavior.
- `docs/product/calculation-spec.md` - PoC logic.
- `docs/product/source-of-truth.md` - current parameters and validation sources.
- `docs/process/decision-log.md` - key product and UX/UI decisions in order.
- `docs/process/pivot.md` - shift from first concept to current product.
- `docs/process/prototyping-notes.md` - visual history of iterations.
- `docs/process/process-patterns.md` - working patterns behind iterations.
- `docs/process/portfolio-integration.md` - embedding contract.
- `@archiwum/` - historical documents, non-canonical unless the task is explicitly about history.
- `kalkulatory-robocze/` - historical prototype artifacts, non-canonical by default.

## Source of Truth Hierarchy

1. `app/` and `src/features/calculator/` - actual product behavior, UI, UX, and copy.
2. `docs/product/prd.md` - final flow and interaction description.
3. `docs/product/brief.md` - final product assumptions.
4. `docs/process/decision-log.md` - durable product, UX, and UI decisions.
5. Historical prototypes and `@archiwum/` - reference only.

If a historical document or prototype conflicts with the current Next.js app on UI, UX, copy, or experience order, the current implementation wins.

## Change Discipline

- Do not perform broad rewrites without explicit scope.
- Preserve user changes and work with the current tree as-is.
- Match existing repo patterns before introducing new ones.
- Prefer explicit types at domain boundaries.
- Keep calculation logic isolated from UI where practical.
- Avoid abstractions that are not justified by repeated use.
- For bug fixes reported by the user, add a short inline comment recording what was broken and how it was fixed.
- Do not add bugfix comments for silent or automatic fixes unless independently useful.
- In user-facing copy, documentation, and UI text, never use the em dash character (U+2014); use the plain hyphen `-` instead.

## Domain Knowledge

### Finance Logic

- Do not guess current financial parameters, dates, rates, margins, fees, or product rules.
- Treat model memory as untrusted for time-sensitive financial facts.
- Verify current bond parameters against official sources before using them in specs, code, or copy.
- Separate stable formula logic from time-sensitive market or product parameters.
- If the current value cannot be verified, stop and mark it as unresolved instead of inventing a placeholder.
- Show units, periods, and rounding assumptions explicitly.
- Cross-check new logic with at least one worked example before sign-off.
- Label outputs as `zweryfikowane`, `czesciowo zweryfikowane`, or `niezweryfikowane`.

#### Source Hierarchy for Financial Data

1. Official treasury bond product pages and terms for the specific bond series.
2. Ministerstwo Finansow or direct government publications for issuance rules.
3. Official statistical or central-bank sources only when the formula depends on their published values.
- Do not present stale memory as a current financial fact.
- Do not infer a current parameter from an old article, cached page, or blog summary.
- If multiple official pages disagree, flag the conflict and stop for clarification.
- Record the exact source and date used for each time-sensitive parameter.

### Product & Scope

- Prefer narrower MVP scope when impact is uncertain.
- Separate facts, assumptions, and recommendations.
- Write acceptance criteria that can be tested.
- Turn ambiguity into explicit decisions or explicit open questions.
- Do not jump into implementation details unless they affect scope or feasibility.
- Use CZSMNR(K) framework (in `docs/`) when the problem statement is fuzzy or over-specified.

### UX & Copy

- Prefer plain language over financial jargon.
- Introduce one decision at a time.
- Explain numbers where the user is most likely to hesitate.
- Make uncertainty and assumptions legible.
- Reduce cognitive load before adding persuasive or decorative copy.

### Data Visualization

- Use a chart only when it reveals a comparison or pattern better than a table.
- Prefer simple visuals over dense, decorative ones.
- Label units, periods, and assumptions explicitly.
- Keep the primary user question visible in the result view.

### QA & Review

- Present findings before summaries.
- Distinguish confirmed issues from hypotheses.
- Map issues to user impact or requirement breakage.
- Prefer targeted validation over broad, noisy checks.
- If validation could not run, say why and what remains unverified.

## Validation

- Prefer targeted checks over full-suite runs unless the change is cross-cutting.
- If validation cannot run, say why and describe the highest-risk unverified path.
- When behavior is ambiguous, surface the assumption instead of baking it in silently.

### Validation Order

1. Formatting or linting only for changed files, when relevant.
2. Targeted tests for the affected module, route, or component.
3. Broader integration or project-wide checks only when the change crosses boundaries.

## Agent Delegation

- Use subagents for parallel exploration, independent review, or narrow verification.
- Give each subagent one objective and the minimum context it needs.
- Consolidate findings in the main thread before editing files.
- Do not delegate ownership of the same files to multiple agents.
- Delegate only sidecar work that does not block the immediate next step.
