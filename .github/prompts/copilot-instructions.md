<!-- This file should be kept in sync with project artifacts and updated as the project evolves. -->

# Nano Banana Sketcher — Copilot Instructions

## Section 1: Project Overview

- Elevator pitch: Nano Banana Sketcher is a lightweight web app that lets users load a local image file, converts the image into a sketch-style rendering using a Nano Banana model running in the browser, and lets users download the resulting sketch as an image. It targets designers, artists and hobbyists who want a privacy-first, client-side image-to-sketch tool.

## Section 2: Tech Stack

- **Frontend:** React + Vite (recommended). Use modern ES modules and React functional components.
- **Backend:** None for MVP — static site. All image processing runs client-side (TFJS/ONNX/WASM or CPU fallback).
- **ML Runtimes:** Candidate runtimes: `@tensorflow/tfjs` (with WebGL/WASM backends) or `onnxruntime-web`. Use whichever conversion path produces acceptable size/performance.
- **Testing:** `vitest` (preferred) or `jest` for unit tests; `@testing-library/react` for component tests.
- **Lint/Format:** `eslint` + `prettier`.
- **Deployment:** Static hosting (Vercel, Netlify, GitHub Pages).

## Section 3: Coding Guidelines

- JavaScript/React conventions
  - Use ES modules and modern syntax (async/await, const/let). Prefer React functional components and hooks.
  - Keep components small and composable; place reusable logic in `src/utils` or `src/ml`.
- Files & style
  - Use 2-space indentation and single quotes for JS strings (enforced by Prettier/ESLint config).
  - Keep public assets in `public/` and non-source artifacts (models) under `model/`.
- Testing
  - Unit tests required for utility modules (image utils, preprocess/postprocess, exporter, fallback filter).
  - Name tests `*.test.{js,ts}` and place alongside modules in `src/__tests__` or `src/*/__tests__`.
  - Aim for focused tests that verify shapes, outputs, and failure modes (no heavy ML tests in unit suite).
- CI
  - CI should run `npm ci`, `npm run lint`, and `npm test` on PRs.
- Security & privacy
  - Do not upload user images to any remote service in the MVP. If a server/API is later added, require explicit opt-in and document storage/retention.
  - Validate file types and enforce max dimensions (default: 2048 px longest side) to avoid excessive memory usage.
- Performance & UX
  - Lazy-load model assets and use a WebWorker for inference when possible to keep UI responsive.
  - Show progress/spinner for long-running inference and provide a CPU fallback option.

## Section 4: Project Structure

- `artifacts/`: Generated project definition and workpackage specs (source of truth for planning).
- `templates/`: Markdown templates used by prompts and spec generation.
- `model/`: Converted model artifacts and conversion docs (`model/CONVERSION.md`, `model/metrics.md`).
- `public/`: Static assets served by the app (index.html if not built via Vite entry).
- `src/`: Application source code
  - `src/components/`: React components (ImageLoader, PreviewCanvas, ModelPOCPanel, ExportPanel, FallbackToggle).
  - `src/ml/`: ML loader, preprocess, postprocess utilities, and model abstraction.
  - `src/workers/`: WebWorker scripts (e.g., `modelWorker.js`).
  - `src/utils/`: generic helpers (exporter, image utils, perf).
- `tests/` or `src/__tests__/`: unit and integration tests.
- `.github/`: CI workflows and prompt templates (this file lives under `.github/prompts/`).

## Section 5: Available Resources

- Project definition: `artifacts/project_definition.md` — read first for goals, constraints, and MVP scope.
- Work packages: `artifacts/workpackage_list.md` and `artifacts/workpackage_WP-*.md` — use these to scope changes and pick tasks.
- Templates: `templates/` — use when creating new workpackage artifacts or specifications.
- Model conversion: `model/CONVERSION.md` and `model/metrics.md` (created during WP-002) — documents conversion steps and performance metrics.
- Common npm scripts (expected to exist in `package.json`):
  - `dev`: start dev server (`vite`)
  - `build`: production build
  - `preview`: preview production build
  - `lint`: run ESLint
  - `test`: run unit tests
- CI: `.github/workflows/ci.yml` should run lint and tests on PRs; optional `.github/workflows/deploy.yml` may automate deploys.

## Notes and Assumptions

- This file is intentionally concise — update it when architecture or tool choices change.
- Assumption: using React + Vite for MVP. If you prefer plain HTML/JS, adjust `src/` layout accordingly.

<!-- End of copilot-instructions.md --
