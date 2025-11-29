# Architecture Overview

This file describes the current architecture of the project. Treat it as the single source of truth
for high-level design decisions.

## System Overview

- System type: <e.g., single-page web application with backend APIs>
- Core user flows:
  1. <Flow 1: short description>
  2. <Flow 2: short description>
  3. <Flow 3: short description>

## Component Structure

- Frontend:

  - <Component / module breakdown, e.g., "App shell", "Search page", "Details view">
  - State management approach: <e.g., React context, Redux, etc.>
- Backend / Services:

  - <List of services or functions, e.g., "tangoSearchService", "lyricsFetcher", "explanationsStore">
- Data:

  - Main entities and their relationships.
  - Where each entity is stored (DB tables / collections, external APIs).

## Constraints and Non-Functional Requirements

- Performance: <e.g., must respond within X ms for typical queries>
- Cost: <e.g., free-tier limits, avoid unnecessary external calls>
- Reliability: <e.g., retries, error handling strategy>
- Security & privacy: <e.g., no PII storage, anonymise logs>

## Architectural Guidelines for AI Assistants

When generating or modifying code:

- Respect existing component boundaries. Do not cross layers (UI, domain, data access) without clear justification.
- Prefer extending existing modules over creating parallel, overlapping ones.
- If you need a new component or module, describe how it fits into this structure.
- Keep external API usage wrapped in small, well-defined modules.

If a requested change does not fit this architecture, propose a small design adjustment and explain the trade-offs.
