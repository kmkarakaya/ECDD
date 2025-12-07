# Execution Prompt

You are an AI coding assistant working on an existing project.

CONTEXT
-------

- Project-level instructions: see `copilot-instructions.md`, `architecture.prompt.md`,
  and `coding-standards.prompt.md` in this repository.
- The current work package is:
  - <Paste the [WP-x] entry from todo.prompt.md here.>
- The agreed plan for this change is:
  - <Paste the contents of the corresponding plan file here.>

TASK
----

Implement the plan step by step.

GUIDELINES
----------

- Follow the plan closely; do not introduce unrelated changes.
- Keep edits minimal and focused; avoid large, unrelated refactors.
- When a step requires a design decision, explain your choice briefly in comments or in a short note.
- Maintain consistency with the existing codebase and coding standards.
- Update or add tests as specified in the plan.

OUTPUT FORMAT
-------------

- Propose concrete code changes (diff-style or full file content), not pseudocode.
- For each logical change, include a short explanation (1–3 sentences) of what you did and why.
- If you encounter ambiguity or a missing piece in the plan, stop and ask for clarification instead of guessing.
