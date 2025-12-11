// server/gemini-proxy.js
// Minimal Express proxy to call the Gemini /v1beta/models/{model}:predict endpoint
// Usage:
//   GEMINI_API_KEY=your_key_here GEMINI_MODEL=gemini-nano-banana node server/gemini-proxy.js
// Notes:
// - Keep your API key in env vars. Do NOT commit it.
// - Adjust GEMINI_API_URL if your deployment uses a different endpoint.

import express from 'express'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
const app = express()
const PORT = process.env.PORT || 3001

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY environment variable')
  process.exit(1)
}

// Default model id; set GEMINI_MODEL env var to the Nano Banana model id you have.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-nano-banana'

// Base URL for Gemini generative models (Imagen-style predict endpoint)
const GEMINI_API_BASE = process.env.GEMINI_API_URL || 'https://api.generativeai.googleapis.com/v1beta'

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'no image file provided' })

    const b64 = req.file.buffer.toString('base64')

    // Build payload for Imagen-style predict endpoint. The exact shape may vary
    // depending on the model. Adjust if your model expects a different input.
    const payload = {
      instances: [
        {
          // Provide both an instruction and the input image bytes
          prompt: req.body.prompt || 'Convert this image into a high-contrast sketch (black & white PNG).',
          image: { imageBytes: b64 }
        }
      ],
      parameters: {
        // sampleCount: 1,
      }
    }

    const endpoint = `${GEMINI_API_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:predict`

    const r = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!r.ok) {
      const text = await r.text()
      console.error('Gemini API error', r.status, text)
      return res.status(502).json({ error: 'Gemini API error', status: r.status, detail: text })
    }

    const json = await r.json()

    // Search common shapes for returned base64 image
    let outBase64 = null
    if (json?.generatedImages?.[0]?.image?.imageBytes) {
      outBase64 = json.generatedImages[0].image.imageBytes
    } else if (json?.output?.[0]?.image_base64) {
      outBase64 = json.output[0].image_base64
    } else if (json?.predictions?.[0]?.b64_json) {
      outBase64 = json.predictions[0].b64_json
    }

    if (outBase64) {
      const imgBuffer = Buffer.from(outBase64, 'base64')
      res.setHeader('Content-Type', 'image/png')
      res.setHeader('Content-Length', imgBuffer.length)
      return res.send(imgBuffer)
    }

    // If the API returned a URL, pass it through
    if (json?.generatedImages?.[0]?.image?.uri) {
      return res.json({ url: json.generatedImages[0].image.uri })
    }

    console.error('Unexpected Gemini response', JSON.stringify(json).slice(0, 2000))
    return res.status(502).json({ error: 'Unexpected Gemini response', raw: json })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal', detail: String(err) })
  }
})

app.listen(PORT, () => {
  console.log(`Gemini proxy running on http://localhost:${PORT} — model=${GEMINI_MODEL}`)
})
