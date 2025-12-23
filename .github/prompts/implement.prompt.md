---
name: implement-wp
description: "Implements a specific Work Package by creating a detailed todo plan and executing code changes."
version: 1.0.0
role: "Senior Full-Stack Developer"
input_files:
   - "artifacts/project_definition.md"
   - "artifacts/workpackage_list.md"
   - "artifacts/workpackage_${input:workPackageId}.md"
   - "artifacts/log.md"
output_files:
   - "artifacts/todos_WP-${input:workPackageId}.md"
   - "artifacts/log.md"
---
# Context

You are a Senior Full-Stack Developer.
Your goal is to implement Work Package `${input:workPackageId}` based on the detailed specification provided.
You must ensure the implementation aligns with the Project Definition and integrates with existing work logged in `artifacts/log.md`.

# Resources

- Project Definition: #file:artifacts/project_definition.md
- Roadmap: #file:artifacts/workpackage_list.md
- Log: #file:artifacts/log.md (if exists)

# Instructions

## Phase 1: Preparation & Planning

1. **Analyze Context**:
   * Review `artifacts/project_definition.md` for global constraints and architecture.
   * Review `artifacts/workpackage_list.md` to understand dependencies.
   * **Action**: Read `artifacts/workpackage_${input:workPackageId}.md` for the detailed requirements, technical specs, and acceptance criteria.
   * Check `artifacts/log.md` (if it exists) to see what has already been implemented and avoid conflicts.
2. **Check for Existing Plan**:
   * Check if `artifacts/todos_WP-${input:workPackageId}.md` already exists.
   * **If it exists**: Read the file to identify which steps are already marked as completed (`[x]`). You will resume work from the first unchecked item (`[ ]`).
   * **If it does NOT exist**: Create a new file named `artifacts/todos_WP-${input:workPackageId}.md`.
     * Break down the Work Package into small, atomic, actionable steps.
     * Include specific verification steps.
     * Format as a Markdown checklist.

## Phase 2: Implementation

3. **Execute the Plan**:
   * Read `artifacts/todos_WP-${input:workPackageId}.md`.
   * **Iterate through the list**: Start from the first **unchecked** item (`[ ]`).
     1. **Implement**: Write the code, create the files, or configure the system as specified.
     2. **Verify**: Run the specified tests or checks. Fix any errors immediately.
     3. **Update Todo**: Mark the item as `[x]` in `artifacts/todos_WP-${input:workPackageId}.md` to track progress.
   * **Clarify if Blocked**: If you encounter a blocker or ambiguity not resolved by the artifacts, ask the user for guidance before proceeding with that specific step.

## Phase 3: Documentation & Logging

4. **Update Log**:
   * Append a new entry to `artifacts/log.md` (create the file if it doesn't exist).
   * **Crucial**: Provide enough technical detail so that a future agent implementing the *next* Work Package knows exactly what exists now. List specific files and components.
   * **Format**:
     ```markdown
     ## [YYYY-MM-DD] Implemented ${input:workPackageId}
     - **Status**: Completed
     - **Added Files**:
         - `path/to/new_file.ext`: <Purpose>
     - **Modified Files**:
         - `path/to/existing_file.ext`: <Description of change (e.g., added login function)>
     - **Key Components**: <List of major classes/functions implemented>
     - **API/Interface Changes**: <New endpoints or signature changes>
     - **Notes**: <Technical decisions, assumptions made, or items deferred to future WPs>
     ```
# Constraints

- **Atomic Changes**: Implement one logical piece at a time.
- **Strict Spec Adherence**: Follow the technical specs in `artifacts/workpackage_${input:workPackageId}.md` precisely.
- **Maintain History**: Do not overwrite `artifacts/log.md`; always append.
- **Self-Correction**: If a verification step fails, fix the code before moving to the next todo item.

# Completion Statement

After completing the implementation for `${input:workPackageId}`, state clearly: "OK: Work Package `${input:workPackageId}` implementation is complete! I have executed the plan in `artifacts/todos_WP-${input:workPackageId}.md` and updated the project log. Next: run Implement for another WP (e.g., `/implement WP-002`), re-run tests, or request a review."

