// postprocess.js
// Convert model output ImageData into an ImageBitmap or data URL suitable for canvas rendering
export async function imageDataToImageBitmap(imageData) {
  // Use OffscreenCanvas if available
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(imageData.width, imageData.height)
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    return canvas.transferToImageBitmap()
  }

  // DOM canvas fallback
  const canvas = document.createElement('canvas')
  canvas.width = imageData.width
  canvas.height = imageData.height
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  // createImageBitmap works in browsers
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(canvas)
  }
  // As a last resort return data URL wrapped as image
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = canvas.toDataURL()
  })
}
