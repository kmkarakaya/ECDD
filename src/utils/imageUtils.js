export async function readFileAsImage(file) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    throw new Error('Unsupported file type')
  }

  // Quick sanity: limit file size to avoid locking the browser (configurable)
  const MAX_BYTES = 25 * 1024 * 1024 // 25 MB
  if (file.size && file.size > MAX_BYTES) {
    throw new Error(`File is too large (${Math.round(file.size / 1024 / 1024)} MB). Max ${MAX_BYTES / 1024 / 1024} MB.`)
  }

  const blob = file.slice()
  // Try createImageBitmap first, but fall back gracefully if it fails.
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob)
      return { width: bitmap.width, height: bitmap.height, fileType: file.type, bitmap }
    } catch (err) {
      // fall through to the Image element fallback
      console.warn('createImageBitmap failed, falling back to Image element:', err)
    }
  }

  // Fallback to Image element
  const url = URL.createObjectURL(blob)
  const img = new Image()
  await new Promise((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = (e) => reject(new Error('Image failed to load (possibly corrupted or unsupported format)'))
    img.src = url
  })
  URL.revokeObjectURL(url)
  return { width: img.naturalWidth, height: img.naturalHeight, fileType: file.type, bitmap: img }
}

export function getImageDimensions(file) {
  return readFileAsImage(file).then((r) => ({ width: r.width, height: r.height }))
}
