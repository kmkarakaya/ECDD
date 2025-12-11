import React, { useState, useRef } from 'react'
import ImageLoader from './components/ImageLoader'
import PreviewCanvas from './components/PreviewCanvas'
import ModelPOCPanel from './components/ModelPOCPanel'
import ExportPanel from './components/ExportPanel'

export default function App() {
  const [imageBitmap, setImageBitmap] = useState(null)
  const canvasRef = useRef(null)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <h1>Nano Banana Sketcher</h1>
      <p>Load a local image to convert it into a sketch (MVP).</p>
      <ImageLoader onImage={(bitmap) => setImageBitmap(bitmap)} />
      <div style={{ marginTop: 20 }}>
        <PreviewCanvas ref={canvasRef} image={imageBitmap} />
        <ExportPanel imageBitmap={imageBitmap} canvasRef={canvasRef} />
      </div>
      {/* Dev-only POC panel for WP-002 */}
      <ModelPOCPanel imageBitmap={imageBitmap} />
    </div>
  )
}
