<!--
MVP Project Definition Template
Path: templates/project_definition.md
Purpose: A minimal, conversation-friendly project definition template for MVP development using ECDD
A coding agent will ask questions to fill this out interactively with a human.
-->

### Template Project Definition (MVP)

> **Instructions for AI Agents:**
> Ask the user short, focused questions to fill each section below.
> Start with Section 1 (Essentials), then move to Section 2 (MVP Scope), then Section 3 (Technical Basics).
> Keep questions simple and allow "skip for now" answers where appropriate.

---

## 1. Project Essentials

**Project Name:**
<PROJECT_NAME>

**What does this project do? (1-2 sentences)**
`<Brief description of the system and its main purpose>`

**Who will use it?**
`<Primary user type or persona>`

**Main Success Metric for MVP:**
<e.g., "users can complete X task" or "response time < Y ms">

---

## 2. MVP Scope

### Core Features (MVP must-haves)

1. <Feature 1 - what users must be able to do>
2. <Feature 2>
3. <Feature 3>

### Out of Scope (explicitly NOT in MVP)

- <Thing we won't build yet>
- <Thing we'll defer to v2>

### Key Use Case (the main happy path)

- Actor: `<who>`
- Trigger: `<what starts the interaction>`
- Steps: <2-4 key steps>
- Outcome: `<what the user gets>`

---

## 3. Technical Basics

### Tech Stack

- **Frontend:** <e.g., React, Vue, plain HTML/JS, or "none - CLI only">
- **Backend:** <e.g., Node.js, Python Flask, Firebase Functions, or "static site">
- **Database/Storage:** <e.g., PostgreSQL, Firestore, localStorage, or "none">
- **Deployment:** <e.g., Vercel, AWS, local dev only>

### Architecture (high-level)

- **System Type:** <e.g., SPA + REST API, static site, CLI tool>
- **Key Components:**
  - <Component 1: responsibility>
  - <Component 2: responsibility>

### Constraints & Risks

- **Performance:** <acceptable latency or "not critical for MVP">
- **Security:** <e.g., "no auth needed", "basic API key", "OAuth required">
- **Cost/Budget:** <e.g., "free tier only", "< $10/month">
- **Known Risks:** <1-2 biggest concerns, e.g., "API rate limits", "no testing strategy yet">

---

-- End of template --
