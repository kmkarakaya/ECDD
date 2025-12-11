## 2025-12-07 Implemented WP-001
- **Added Files**:
  - `package.json`: project metadata and dev scripts for Vite/React development.
  - `vite.config.js`: Vite React plugin configuration.

## 2025-12-07 Implemented WP-002 (POC)
- **Status**: In Progress (POC implemented)
- **Added Files**:
  - `model/CONVERSION.md`: notes and example commands for converting models to TFJS/ONNX/WASM.
  - `model/metrics.md`: placeholder for model size and inference measurements.
  - `src/ml/modelLoader.js`: abstraction with a `dummy` runtime for POC inference.
  - `src/ml/preprocess.js`: resize ImageBitmap to ImageData for model input.
  - `src/ml/postprocess.js`: convert ImageData back to ImageBitmap for rendering.
  - `src/workers/modelWorker.js`: WebWorker exposing `loadModel` and `runInference` via postMessage.
  - `src/components/ModelPOCPanel.jsx`: development UI to load the dummy model and run inference against the preview image.

- **Modified Files**:
  - `src/App.jsx`: wired the `ModelPOCPanel` into the app for development testing.

- **Key Components**:
  - `modelLoader` (dummy): provides `loadModel` and `runInference(runtime, imageData)` for the POC.
  - `modelWorker`: worker-based integration that accepts ImageBitmap and returns a processed ImageBitmap (transferable).

- **API/Interface Changes**:
  - Worker messages: `{id, type: 'loadModel'|'runInference', payload}`; responses `{id, success, payload}`.

- **Notes**:
  - The POC uses a JS-based `dummy` runtime to simulate model output so the end-to-end integration can be tested without a converted model artifact.
  - Remaining WP-002 tasks: attempt an actual model conversion (TFJS/ONNX) when a candidate model is available.

## 2025-12-07 WP-002 Measurements
- **Status**: Measurements recorded (POC)
- **Script used**: `node scripts/measure_dummy.js` (appends timings to `model/metrics.md`)
- **Measured results** (from POC synthetic runs):
  - 256x256: avg 1.7 ms over 3 runs
  - 512x512: avg 2.0 ms over 3 runs
  - 1024x1024: avg 6.7 ms over 3 runs

These values reflect the in-JS dummy transform timings (not a real ML model) and are recorded in `model/metrics.md`.

  - `index.html`: app entry HTML.
  - `src/main.jsx`: React entry that mounts `App`.
  - `src/App.jsx`: Top-level application wiring `ImageLoader` and `PreviewCanvas`.
  - `src/components/ImageLoader.jsx`: File input and drag-and-drop image loader; uses `readFileAsImage`.
  - `src/components/PreviewCanvas.jsx`: Canvas component that renders an `ImageBitmap` or `Image` scaled to fit.
  - `src/utils/imageUtils.js`: Utilities to read `File` into `ImageBitmap`/`Image` and obtain dimensions.
  - `src/styles.css`: Minimal styles.
  - `src/__tests__/imageUtils.test.js`: Small unit test checking invalid file handling.
  - `.eslintrc.cjs`, `.prettierrc`: Lint/format configs.
  - `.github/workflows/ci.yml`: CI workflow to run lint and tests.
  - `.gitignore`, `README.md`: repository housekeeping.
  - `artifacts/todos_WP-001.md`: checklist used for implementation tracking.

- **Modified Files**:
  - None

- **Key Components**:
  - `ImageLoader`: reads local files, supports drag-and-drop and file input, returns image data to the app.
  - `PreviewCanvas`: draws loaded image to a canvas and scales it for preview.
  - `imageUtils.readFileAsImage`: attempts `createImageBitmap` or falls back to `Image` element.

- **API/Interface Changes**:
  - `ImageLoader` triggers `onImage(bitmap)` where `bitmap` is `ImageBitmap` or `HTMLImageElement`.
  - `PreviewCanvas` accepts `image` prop and renders it to the canvas.

- **Notes**:
  - This is a minimal scaffold for WP-001; it does not include the ML model or export features (covered in later WPs).
  - To run the dev server: `npm ci` then `npm run dev`.
  - The test suite uses `vitest`; CI will run lint and tests but does not include heavy ML testing.

  ## 2025-12-07 Completed WP-002
  - **Status**: Completed
  - **Added Files**:
    - `model/CONVERSION.md`: Conversion notes and example commands for TFJS/ONNX/WASM paths.
    - `model/metrics.md`: Recorded synthetic POC timings and placeholders for future real-model metrics.
    - `src/ml/modelLoader.js`: Runtime abstraction (POC `dummy` runtime) with `loadModel` and `runInference` interfaces.
    - `src/ml/preprocess.js`: ImageBitmap -> ImageData resizing and normalization utilities.
    - `src/ml/postprocess.js`: ImageData -> ImageBitmap conversion utilities for rendering.
    - `src/workers/modelWorker.js`: WebWorker wrapper exposing `loadModel` and `runInference` via `postMessage` protocol.
    - `src/components/ModelPOCPanel.jsx`: Dev-only UI to load the POC runtime, run inference on the preview image, and present basic timings.
    - `scripts/measure_dummy.js`: Node script to run synthetic measurements of the dummy transform and append results to `model/metrics.md`.
  - **Modified Files**:
    - `src/App.jsx`: Wired `ModelPOCPanel` into the app behind a dev flag to allow end-to-end POC testing.
  - **Key Components**:
    - `modelLoader` (POC/dummy): Provides `loadModel()` and `runInference(imageData)` with an interchangeable runtime interface to swap in TFJS/ONNX later.
    - `modelWorker`: Handles worker messages with the protocol `{id, type, payload}` and returns `{id, success, payload}`; transfers ImageBitmap where possible.
    - `preprocess`/`postprocess`: Utilities to prepare image tensors and convert model outputs back into renderable images.
  - **API/Interface Changes**:
    - Worker messaging contract documented and used by `ModelPOCPanel` and `src/App.jsx` for dev testing.
  - **Notes**:
    - All todo items in `artifacts/todos_WP-002.md` are marked completed. The POC uses a JS `dummy` runtime to validate the end-to-end flow without a converted model artifact.
    - Synthetic measurements were recorded via `scripts/measure_dummy.js` and appended to `model/metrics.md` (see measurements recorded on 2025-12-07).
    - Next recommended steps (deferred):
      - Attempt conversion of a Nano Banana model following `model/CONVERSION.md` (PyTorch → ONNX → TFJS or ONNX runtime) and produce a small/quantized artifact.
      - Swap the `dummy` runtime in `src/ml/modelLoader.js` with the converted runtime (TFJS or onnxruntime-web) and validate in `modelWorker`.
      - If conversion is infeasible, implement the classical image-to-sketch fallback filter and integrate it as a graceful degradation path in the worker.

  ## 2025-12-07 Implemented WP-003
  - **Status**: Completed (export + fallback)
  - **Added Files**:
    - `src/utils/exporter.js`: Utilities to convert an `ImageBitmap` to a canvas and download it as a PNG.
    - `src/ml/fallbackFilter.js`: CPU-based grayscale + Sobel edge detection and threshold-based stylize fallback filter.
    - `src/components/ExportPanel.jsx`: UI to set filename, toggle fallback filter, and download the current preview/result.
    - `artifacts/todos_WP-003.md`: Checklist used to track WP-003 progress and verification steps.
  - **Modified Files**:
    - `src/App.jsx`: Export panel wired below `PreviewCanvas`; passes `imageBitmap` and `canvasRef` to the new panel.
  - **Key Components**:
    - `exporter`: `imageBitmapToCanvas` and `downloadCanvasAsPNG` to produce and download PNG files from in-memory images.
    - `fallbackFilter`: lightweight, deterministic CPU fallback that produces a sketch-like output when model is unavailable.
    - `ExportPanel`: user-facing control that coordinates building a canvas, applying fallback filter (optional), and exporting a PNG.
  - **API/Interface Changes**:
    - No external API surface changes. `App` now renders `ExportPanel(imageBitmap, canvasRef)` for user export interactions.
  - **Notes**:
    - Verification steps: run `npm run dev`, load a local image, optionally toggle fallback, then click Download to receive `sketch.png`.
    - The fallback filter is intentionally simple to keep bundle size small and run reliably on the main thread for typical desktop images; for large images, recommend the worker path or downscaling before applying.
    - Remaining tiny tasks: add a smoke test for the exporter and update the README with export instructions (tracked in `artifacts/todos_WP-003.md`).

## 2025-12-07 Added Gemini proxy for Nano Banana
- **Status**: Completed (integration scaffolded)
- **Added Files**:
  - `server/gemini-proxy.js`: Express proxy that accepts an uploaded image and forwards it to Gemini's `/v1beta/models/{model}:predict` endpoint and returns a PNG binary.
  - `.env.example`: shows `GEMINI_API_KEY` and `GEMINI_MODEL` env variables required to run the proxy.
  - `vite.config.js` (modified): development proxy configured to forward `/api` to the local proxy at `http://localhost:3001`.
  - `package.json` (modified): added `start:server` and `dev:all` convenience scripts.
- **Modified Files**:
  - `src/components/ExportPanel.jsx`: added an upload input to send the original image to `/api/convert` and download the Gemini-produced sketch.
- **Key Components**:
  - `gemini-proxy`: forwards images as base64 in an Imagen-style `instances[].image.imageBytes` payload; returns the resulting PNG if Gemini responds with base64 `imageBytes`.
  - `ExportPanel` upload flow: uses `/api/convert` to offload API key usage to the server.
- **Notes**:
  - The proxy expects `GEMINI_API_KEY` in environment variables. Set `GEMINI_MODEL` to the exact Nano Banana model id you intend to call (if available).
  - Payload shape: uses Imagen-style `instances` payload with an `image.imageBytes` base64 field and `prompt`. Adjust if your model requires a different request format.
  - For production deployment, add authentication, rate limiting, and origin checks to the proxy to avoid exposing your API key.



