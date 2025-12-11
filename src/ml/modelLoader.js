// modelLoader.js
// Provides a simple abstraction to load a model and run inference.
// For WP-002 POC we include a lightweight 'dummy' runtime that performs a simple
// image-to-sketch-like transform in JS so the end-to-end flow can be tested.

export async function loadModel(config = { framework: 'dummy', path: '' }) {
  const runtime = { framework: config.framework }
  if (config.framework === 'dummy') {
    // dummy model: no external artifact required
    runtime.model = {
      run: async (imageData, params = {}) => {
        // simple edge-enhance + invert to simulate sketch
        const out = new ImageData(imageData.width, imageData.height)
        const w = imageData.width
        const h = imageData.height
        const src = imageData.data
        const dst = out.data
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4
            // grayscale
            const r = src[i], g = src[i + 1], b = src[i + 2]
            const gray = (r * 0.3 + g * 0.59 + b * 0.11) | 0
            // simple local contrast: compare with right neighbor
            const iR = (y * w + Math.min(w - 1, x + 1)) * 4
            const r2 = src[iR], g2 = src[iR + 1], b2 = src[iR + 2]
            const gray2 = (r2 * 0.3 + g2 * 0.59 + b2 * 0.11) | 0
            let edge = Math.abs(gray - gray2) * 2
            edge = Math.max(0, Math.min(255, edge))
            // invert to make sketch-like lines on white
            const v = 255 - edge
            dst[i] = dst[i + 1] = dst[i + 2] = v
            dst[i + 3] = 255
          }
        }
        return out
      },
    }
  } else {
    // Placeholder: actual loader for TFJS/ONNX would go here.
    throw new Error('Non-dummy runtimes not implemented in POC')
  }
  return runtime
}

export async function runInference(runtime, imageData, params = {}) {
  if (!runtime || !runtime.model) throw new Error('Model not loaded')
  const start = performance.now()
  const out = await runtime.model.run(imageData, params)
  const timeMs = performance.now() - start
  return { output: out, timeMs }
}
