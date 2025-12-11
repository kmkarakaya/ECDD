import { loadModel, runInference } from '../ml/modelLoader'
import { imageBitmapToImageData } from '../ml/preprocess'
import { imageDataToImageBitmap } from '../ml/postprocess'

let runtime = null

self.onmessage = async (ev) => {
  const msg = ev.data
  const { id, type, payload } = msg
  try {
    if (type === 'loadModel') {
      runtime = await loadModel(payload.config)
      self.postMessage({ id, success: true })
      return
    }
    if (type === 'runInference') {
      if (!runtime) throw new Error('Model not loaded')
      const imageBitmap = payload.imageBitmap
      const params = payload.params || {}
      const imageData = await imageBitmapToImageData(imageBitmap, params.targetSize || 512)
      const { output, timeMs } = await runInference(runtime, imageData, params)
      const outBitmap = await imageDataToImageBitmap(output)
      // Transfer an ImageBitmap back
      self.postMessage({ id, success: true, payload: { timeMs } }, [outBitmap])
      return
    }
    self.postMessage({ id, success: false, payload: { error: 'unknown message type' } })
  } catch (err) {
    self.postMessage({ id, success: false, payload: { error: err.message || String(err) } })
  }
}
