---
description: "Elaborates a single Work Package from the roadmap into a detailed technical specification."
role: "Lead Engineer"
input_files:
  - "artifacts/project_definition.md"
  - "artifacts/workpackage_list.md"
  - "templates/template_complete_workpackage.md"
output_file: "artifacts/workpackage_[ID].md"
parameters:
  - name: "WORK_PACKAGE_ID"
    description: "The ID of the Work Package to elaborate (e.g., WP-001)"
---

# Context
You are a Lead Engineer tasked with detailing a specific unit of work.
The project has been defined in `artifacts/project_definition.md`.
A high-level roadmap exists in `artifacts/workpackage_list.md`.
You need to take *one* specific Work Package from that list and expand it into a fully actionable technical specification for a developer to implement.

# Instructions
1.  **Identify the Target**: Look for the Work Package with ID `{{WORK_PACKAGE_ID}}` in `artifacts/workpackage_list.md`.
2.  **Analyze Context**:
    *   Read `artifacts/project_definition.md` to ensure alignment with global architectural decisions and coding standards.
    *   Read the summary description of the target WP in `artifacts/workpackage_list.md`.
3.  **Analyze the Template**: Read `templates/template_complete_workpackage.md`. This defines the structure you MUST use for the detailed specification.
4.  **Clarify if Needed**: If technical decisions are ambiguous, ask questions **one at a time**:
    *   Example: "Should the API use REST or GraphQL for this feature?"
    *   Provide 2-3 options with pros/cons and a recommendation.
    *   **Wait for the user's answer** before asking the next question.
    *   Only ask if the answer directly impacts implementation approach (file structure, libraries, data flow).
5.  **Elaborate**: Expand the high-level description into a detailed guide.
    *   **Acceptance Criteria**: Define clear, testable conditions for success (Gherkin syntax preferred).
    *   **Technical Specifications**: Specify exact files to create/edit, data models, API signatures, and libraries to use.
    *   **Implementation Steps**: Provide a step-by-step plan for the developer.
    *   **Verification**: Define how to verify the work (unit tests, manual checks).
6.  **Generate Output**: Create a file named `artifacts/workpackage_{{WORK_PACKAGE_ID}}.md` (e.g., `artifacts/workpackage_WP-001.md`).
    *   Strictly follow the format defined in `templates/template_complete_workpackage.md`.

# Constraints
-   **Single Focus**: Do not elaborate on other WPs. Focus only on `{{WORK_PACKAGE_ID}}`.
-   **Strict Template Adherence**: Use the exact markdown structure from `templates/template_complete_workpackage.md`.
-   **Actionable Detail**: The output should be detailed enough that a Junior Developer could implement it without further questions.

# Completion Statement
After creating the specification file, state clearly: "✅ Work Package `{{WORK_PACKAGE_ID}}` specification is complete! The file `artifacts/workpackage_{{WORK_PACKAGE_ID}}.md` has been created and is ready for implementation."
