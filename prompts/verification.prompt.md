# Verification Prompt

You are acting as a reviewer and test designer for a recent change
implemented in this project.

CONTEXT
-------

- Project instructions and architecture:
  - `copilot-instructions.md`
  - `architecture.prompt.md`
  - `coding-standards.prompt.md`
- Work package:
  - <Paste the [WP-x] entry from todo.prompt.md.>
- Plan:
  - <Paste the plan file used for this change.>
- Summary of code changes:
  - <Paste a git diff summary, list of modified files, or a short description.>
- Test results so far:
  - <Describe manual and automated test results, if any.>

TASK
----

Assess whether the change satisfies the plan and acceptance criteria, and
identify any gaps or risks.

REVIEW REQUIREMENTS
-------------------

- Check alignment with the plan: were all planned steps addressed?
- Check alignment with acceptance criteria for the work package.
- Highlight potential edge cases or failure modes that are not covered.
- Suggest additional tests if needed (unit, integration, or manual checks).
- Comment on code quality with respect to the coding standards.

OUTPUT FORMAT
-------------

Return your review as Markdown with the following structure:

## Review Summary

<One paragraph stating whether the change is acceptable as-is, needs minor fixes,
or requires substantial rework.>

## Findings

- <Finding 1: what you observed and why it matters>
- <Finding 2>
- ...

## Suggested Tests

- <Test idea 1>
- <Test idea 2>

## Recommendation

- <"Accept", "Accept with minor changes", or "Request changes">, with a short justification.
