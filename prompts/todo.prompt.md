# Work Packages (Backlog)

<!--
SYSTEM NOTE FOR AI ASSISTANTS:

You are helping to maintain a plain-text backlog of work packages for this project.
- Do not delete existing entries without explicit user approval.
- When adding a new work package, assign a new numeric ID.
- When updating a work package, preserve its ID and history.
- Keep the list roughly sorted by priority (highest priority first).
-->

Each work package (WP) tracks a feature, fix, or refactor. Use the following format:

- [WP-`<ID>`] `<Short title>`
  - Status: <Backlog | In Progress | Blocked | Done | Dropped>
  - Owner: <Name or "Unassigned">
  - Description: <2–4 sentences describing the goal and context>
  - Acceptance criteria:
    - <Criterion 1>
    - <Criterion 2>
    - <Criterion 3>
  - Notes:
    - <Optional design notes, links to plans or issues>

## Current Work Packages

- [WP-1] <Example: Implement song search UI>

  - Status: Backlog
  - Owner: Unassigned
  - Description: Provide a text input and button so users can search for songs by title.
  - Acceptance criteria:
    - User can type a song title and submit.
    - Invalid input is handled gracefully.
    - Search action is wired to the backend or placeholder handler.
  - Notes:
    - See architecture overview for allowed UI libraries.
- [WP-2] <Example: Store explanations in database>

  - Status: Backlog
  - Owner: Unassigned
  - Description: Persist generated explanations and ratings so that repeated searches can reuse them.
  - Acceptance criteria:
    - Explanations and ratings are stored under a stable key.
    - Duplicate explanations are avoided where possible.
    - Errors are handled without crashing the UI.
  - Notes:
    - Coordinate with data model definition in `architecture.prompt.md`.
