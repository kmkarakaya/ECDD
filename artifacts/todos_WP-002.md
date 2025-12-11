## Todos for WP-002 — Model Feasibility & In-Browser POC

- [x] Create `model/CONVERSION.md` with instructions and choices for TFJS/ONNX/WASM conversion.
- [x] Add `model/metrics.md` placeholder for recording model size and timings.
- [x] Implement `src/ml/modelLoader.js` abstraction with a small built-in `dummy` runtime for POC.
- [x] Implement `src/ml/preprocess.js` and `src/ml/postprocess.js` to resize and prepare ImageBitmap for inference.
- [x] Implement WebWorker `src/workers/modelWorker.js` that exposes `loadModel` and `runInference` via postMessage.
- [x] Add `src/components/ModelPOCPanel.jsx` to load the POC model, run inference on the current preview image, and show metrics/errors.
- [x] Wire the POC panel into `src/App.jsx` behind a dev-only flag.
- [x] Record findings and metrics in `model/metrics.md` and update `model/CONVERSION.md` if any changes.
- [x] Manual test: run dev server, load sample image, load dummy model, run inference, and confirm result renders.  
	- Note: automated synthetic measurement executed via `node scripts/measure_dummy.js` and results appended to `model/metrics.md`.

