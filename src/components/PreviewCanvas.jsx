import React, { forwardRef, useEffect, useRef } from 'react'

const PreviewCanvas = forwardRef(function PreviewCanvas({ image }, ref) {
  const localRef = useRef(null)
  const canvasRef = ref || localRef

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!image) return
    const { width, height } = image
    const maxW = 800
    const scale = Math.min(1, maxW / width)
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  }, [image, canvasRef])

  return (
    <canvas
      ref={canvasRef}
      style={{ border: '1px solid #ddd', maxWidth: '100%', height: 'auto' }}
      aria-label="Image preview canvas"
    />
  )
})

export default PreviewCanvas
