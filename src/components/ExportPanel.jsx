import React, { useState } from 'react'
import { downloadCanvasAsPNG } from '../utils/exporter'
import { applyFallbackFilter } from '../ml/fallbackFilter'
import { readFileAsImage } from '../utils/imageUtils'

export default function ExportPanel({ canvasRef }) {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  // Immediately process an uploaded file using the in-browser fallback filter.
  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    setStatus('Reading image...')
    try {
      const result = await readFileAsImage(file)
      const { bitmap } = result

      // Build a canvas from the image (bitmap can be Image or ImageBitmap)
      const c = document.createElement('canvas')
      let w, h
      if (bitmap.width && bitmap.height) {
        w = bitmap.width
        h = bitmap.height
      } else {
        w = result.width
        h = result.height
      }
      c.width = w
      c.height = h
      const ctx = c.getContext('2d')
      ctx.drawImage(bitmap, 0, 0, w, h)

      setStatus('Applying sketch filter...')
      await applyFallbackFilter(c, { threshold: 80 })

      // Copy to preview canvas if provided
      if (canvasRef && canvasRef.current) {
        const preview = canvasRef.current
        preview.width = c.width
        preview.height = c.height
        const pctx = preview.getContext('2d')
        pctx.clearRect(0, 0, preview.width, preview.height)
        pctx.drawImage(c, 0, 0)
      }

      setStatus('Download starting...')
      await downloadCanvasAsPNG(c, `nano-banana-sketch-${file.name || 'out'}`)
      setStatus('Done')
    } catch (err) {
      console.error('ExportPanel: failed to process file', err)
      setStatus('Error: ' + (err.message || 'failed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginTop: 16, borderTop: '1px solid #eee', paddingTop: 12 }}>
      <h3>Export / Download</h3>
      <p style={{ color: '#666' }}>Simple: choose an image and it will be converted to a sketch and downloaded (uses local CPU fallback).</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files && e.target.files[0])} disabled={busy} />
        <div style={{ minWidth: 180 }}>
          <strong>{busy ? 'Processing…' : status || 'Ready'}</strong>
        </div>
      </div>
    </div>
  )
}
