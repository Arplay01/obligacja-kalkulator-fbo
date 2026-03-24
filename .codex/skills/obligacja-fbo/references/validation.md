# Validation Reference

Choose the smallest validation that meaningfully exercises the touched behavior.

## Validation Order

1. Formatting or linting only for changed files, when relevant.
2. Targeted tests for the affected module, route, command, or component.
3. Broader integration or project-wide checks only when the change crosses boundaries.

## Reporting

- Name the command you ran.
- State whether it passed, failed, or could not run.
- If you skip validation, explain the reason and the highest-risk gap.
