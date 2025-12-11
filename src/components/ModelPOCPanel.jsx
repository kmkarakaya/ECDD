import React, { useState, useRef } from 'react'

export default function ModelPOCPanel({ imageBitmap }) {
  const [status, setStatus] = useState('idle')
  const [metrics, setMetrics] = useState(null)
  const [error, setError] = useState(null)
  const workerRef = useRef(null)
  const canvasRef = useRef(null)

  const initWorker = () => {
    if (workerRef.current) return
    // Vite supports importing worker by path; use relative path
    workerRef.current = new Worker(new URL('../workers/modelWorker.js', import.meta.url))
    workerRef.current.onmessage = (ev) => {
      const msg = ev.data
      if (!msg) return
      if (msg.success && msg.payload && msg.payload.timeMs != null) {
        setMetrics({ timeMs: msg.payload.timeMs })
        setStatus('done')
        // The worker transferred an ImageBitmap back as a transferable; draw it
        // Note: some environments may not include the bitmap in payload; try to draw from event
        const transferable = ev.data && ev.data.payload && ev.data.payload.bitmap
        // Instead, draw using event.ports not used; fallback: redraw from imageBitmap
      } else if (!msg.success) {
        setError(msg.payload && msg.payload.error)
        setStatus('error')
      } else {
        setStatus('loaded')
      }
    }
  }

  const loadDummyModel = () => {
    setStatus('loading')
    setError(null)
    initWorker()
    const id = 'load-model'
    workerRef.current.postMessage({ id, type: 'loadModel', payload: { config: { framework: 'dummy' } } })
    setTimeout(() => setStatus('ready'), 200)
  }

  const run = async () => {
    if (!imageBitmap) return setError('No image loaded')
    setStatus('running')
    setError(null)
    initWorker()
    const id = 'run-1'
    // Prepare a MessageChannel to receive transferred bitmap? Simpler: request worker to run and then redraw from main thread using modelLoader locally if needed.
    workerRef.current.postMessage({ id, type: 'runInference', payload: { imageBitmap, params: { targetSize: 512 } } }, [imageBitmap])
    // Since worker may transfer back an ImageBitmap, listen for message in onmessage handler to set metrics. Meanwhile show spinner.
  }

  return (
    <div style={{ border: '1px dashed #999', padding: 12, marginTop: 20 }}>
      <h3>Model POC (dev)</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={loadDummyModel} disabled={status === 'loading' || status === 'ready'}>
          Load Dummy Model
        </button>
        <button onClick={run} disabled={!imageBitmap || status === 'running'}>
          Run Inference
        </button>
        <div>{status}</div>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {metrics && (
        <div style={{ marginTop: 8 }}>Inference time: {Math.round(metrics.timeMs)} ms</div>
      )}
      <div style={{ marginTop: 8 }}>
        <canvas ref={canvasRef} style={{ border: '1px solid #ddd' }} aria-label="POC output canvas" />
      </div>
    </div>
  )
}
