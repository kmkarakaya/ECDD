## Todos for WP-003 — Export + Fallback (MVP)

This work package implements the client-side export UX and a CPU-based fallback sketch filter when a converted model is unavailable.

- [x] Create `src/utils/exporter.js` with `downloadCanvasAsPNG(canvas, filename)` and helper to build a canvas from an `ImageBitmap`.
- [x] Implement `src/ml/fallbackFilter.js`: a lightweight edge-detection + stylize filter that runs on a Canvas 2D context.
- [x] Add `src/components/ExportPanel.jsx`: UI to download the current preview (filename input, fallback toggle, progress/disabled state).
- [x] Wire `ExportPanel` into `src/App.jsx`, passing `imageBitmap` and `canvasRef`.
- [ ] Add a minimal test for `src/utils/exporter.js` (if test harness supports DOM/canvas) or a smoke-check script.
- [ ] Update `README.md` and `artifacts/todos_WP-003.md` to record verification steps and how to exercise the export/fallback flow.
- [ ] Append completion entry to `artifacts/log.md` documenting files added/modified and next steps.

Verification steps:
- Run the dev server `npm run dev`.
- Load a local image, ensure preview renders.
- Toggle fallback if present, click Download, and confirm a PNG is downloaded containing the sketch/fallback result.
