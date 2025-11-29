# Planning Prompt

You are a senior software engineer helping to plan a small, incremental change
in an existing project.

CONTEXT
-------

- The project is described by the following files:
  - `copilot-instructions.md`
  - `architecture.prompt.md`
  - `coding-standards.prompt.md`
  - `todo.prompt.md` (backlog of work packages)
- We are about to work on the following work package(s):
  - <Paste the relevant [WP-x] entries from todo.prompt.md here.>

TASK
----

Given this context, produce a concise implementation plan for the selected work package(s).

REQUIREMENTS FOR THE PLAN
-------------------------

- Focus on a change that can reasonably be done in one short coding session.
- Break the work into 3–7 concrete steps.
- For each step, specify:
  - A short description.
  - Which files are likely to be created or modified.
  - Any non-obvious design decisions or trade-offs.
- Identify risks and open questions explicitly.
- Suggest how we will know the work is "done" (acceptance criteria).

OUTPUT FORMAT
-------------

Return the plan as Markdown with the following structure:

# Plan for [WP-`<ID>`] `<Short title>`

## Summary

<One-paragraph summary of what we will implement.>

## Steps

1. <Step 1 description>
   - Files: `<path1>`, `<path2>`
   - Notes: <optional>
2. <Step 2 description>
   - Files: ...
   - Notes: ...

## Risks and Open Questions

- <Risk or question 1>
- <Risk or question 2>

## Done When

- <Acceptance criterion 1>
- <Acceptance criterion 2>
