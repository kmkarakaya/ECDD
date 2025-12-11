// preprocess.js
// Resize ImageBitmap/Image to a target size and return ImageData
export async function imageBitmapToImageData(imageBitmap, targetWidth = 512) {
  const width = imageBitmap.width
  const height = imageBitmap.height
  const scale = Math.min(1, targetWidth / Math.max(width, height))
  const w = Math.max(1, Math.round(width * scale))
  const h = Math.max(1, Math.round(height * scale))

  // Use OffscreenCanvas if available
  let canvas
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(w, h)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imageBitmap, 0, 0, w, h)
    const imageData = ctx.getImageData(0, 0, w, h)
    return imageData
  }

  // Fallback to in-DOM canvas
  canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageBitmap, 0, 0, w, h)
  return ctx.getImageData(0, 0, w, h)
}
