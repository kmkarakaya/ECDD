import React, { useCallback, useRef, useState } from 'react'
import { readFileAsImage } from '../utils/imageUtils'

export default function ImageLoader({ onImage }) {
  const fileRef = useRef(null)
  const [error, setError] = useState('')

  const onFiles = useCallback(async (fileList) => {
    setError('')
    const file = fileList[0]
    if (!file) return
    try {
      const result = await readFileAsImage(file)
      onImage(result.bitmap)
    } catch (err) {
      console.error(err)
      // Show a helpful message to the user when possible
      const msg = err && err.message ? err.message : String(err)
      setError('Failed to read image file: ' + msg)
    }
  }, [onImage])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    onFiles(e.dataTransfer.files)
  }, [onFiles])

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: '2px dashed #ccc',
          padding: 20,
          borderRadius: 6,
        }}
      >
        <p>Drop an image here, or</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
