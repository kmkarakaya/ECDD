// Lightweight CPU-based fallback sketch filter.
// Exports `applyFallbackFilter(canvas, options)` which mutates the canvas' pixels.

function grayscale(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const v = 0.299 * r + 0.587 * g + 0.114 * b
    data[i] = data[i + 1] = data[i + 2] = v
  }
}

function sobelEdge(data, width, height) {
  // Simple Sobel operator on grayscale data (in-place read, output new array)
  const out = new Uint8ClampedArray(data.length)
  const get = (x, y) => {
    if (x < 0) x = 0
    if (y < 0) y = 0
    if (x >= width) x = width - 1
    if (y >= height) y = height - 1
    return data[(y * width + x) * 4]
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx = -get(x - 1, y - 1) - 2 * get(x - 1, y) - get(x - 1, y + 1) + get(x + 1, y - 1) + 2 * get(x + 1, y) + get(x + 1, y + 1)
      const gy = -get(x - 1, y - 1) - 2 * get(x, y - 1) - get(x + 1, y - 1) + get(x - 1, y + 1) + 2 * get(x, y + 1) + get(x + 1, y + 1)
      const mag = Math.hypot(gx, gy)
      const v = mag > 255 ? 255 : mag
      const idx = (y * width + x) * 4
      out[idx] = out[idx + 1] = out[idx + 2] = v
      out[idx + 3] = 255
    }
  }
  return out
}

export async function applyFallbackFilter(canvas, options = {}) {
  const { threshold = 80, invert = false } = options
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  // Convert to grayscale
  grayscale(data)
  // Compute edges
  const edged = sobelEdge(data, width, height)
  // Apply threshold and composite
  for (let i = 0; i < edged.length; i += 4) {
    let v = edged[i]
    v = v > threshold ? 255 : 0
    if (invert) v = 255 - v
    data[i] = data[i + 1] = data[i + 2] = v
    data[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export default { applyFallbackFilter }
