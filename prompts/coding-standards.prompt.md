# Coding Standards

These standards apply to all code in this repository. AI assistants should follow them by default.

## General Principles

- Optimise for readability and maintainability.
- Keep functions small and focused.
- Avoid unnecessary cleverness; prefer explicit, straightforward solutions.
- Write self-documenting code; add comments only where intent is non-obvious.

## Language- and Stack-Specific Rules

- Language: <e.g., TypeScript>

  - Use strict typing; avoid `any` unless absolutely necessary and documented.
  - Use async/await instead of raw Promises where possible.
  - Prefer pure functions for business logic.
- Framework: <e.g., React>

  - Use functional components and hooks.
  - Keep components focused; extract reusable pieces.
  - Do not mutate props or state directly.

## Naming and Structure

- Use descriptive names for variables, functions, and components.
- Follow existing naming conventions in this codebase.
- Group related files together; avoid large "god" modules.

## Testing

- For non-trivial logic, add or update tests when behaviour changes.
- Prefer small, focused tests that assert behaviour, not implementation details.
- When generating tests, explain what is being tested and why.

## Code Review Expectations

When suggesting changes:

- Include a short summary of the intent and scope.
- Highlight potential risks (breaking changes, performance, security).
- If you touch multiple areas, clearly separate the changes into logical commits or sections.

If you are unsure whether a suggestion fits these standards, ask the user to confirm before making large edits.
