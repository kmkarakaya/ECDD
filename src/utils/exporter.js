// Utilities to export canvas/ImageBitmap to downloadable PNG
export function imageBitmapToCanvas(imageBitmap) {
  const canvas = document.createElement('canvas')
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imageBitmap, 0, 0)
  return canvas
}

export function downloadCanvasAsPNG(canvas, filename = 'sketch.png') {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(false)
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      resolve(true)
    }, 'image/png')
  })
}

export default { imageBitmapToCanvas, downloadCanvasAsPNG }
