// server/gemini-proxy-simple.js
// Minimal Node-only proxy that accepts JSON payloads with base64 image data
// and forwards them to Gemini /v1beta/models/{model}:predict. No external deps.
// Usage:
//   GEMINI_API_KEY=... GEMINI_MODEL=gemini-nano-banana node server/gemini-proxy-simple.js

import http from 'http'

const PORT = process.env.PORT || 3001
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY env var')
  process.exit(1)
}
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-nano-banana'
const GEMINI_API_BASE = process.env.GEMINI_API_URL || 'https://api.generativeai.googleapis.com/v1beta'

async function callGemini(payload) {
  const endpoint = `${GEMINI_API_BASE}/models/${encodeURIComponent(GEMINI_MODEL)}:predict`
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GEMINI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const txt = await res.text()
    const err = new Error(`Gemini error ${res.status}: ${txt}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

const server = http.createServer(async (req, res) => {
  // Status endpoint to indicate whether GEMINI_API_KEY is present
  if (req.method === 'GET' && req.url === '/api/status') {
    const hasKey = Boolean(process.env.GEMINI_API_KEY)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, hasKey }))
    return
  }

  if (req.method === 'POST' && req.url === '/api/convert') {
    try {
      // collect body
      let body = ''
      for await (const chunk of req) body += chunk
      const json = JSON.parse(body || '{}')

      // Accept either direct image_base64 or instances payload
      let b64 = json.image_base64 || null
      if (!b64 && Array.isArray(json.instances) && json.instances[0]) {
        b64 = json.instances[0].image?.imageBytes || json.instances[0].image_base64 || null
      }
      if (!b64) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'no image_base64 in request' }))
        return
      }

      const prompt = json.prompt || 'Convert this image into a sketch-style PNG (black & white).'
      const payload = {
        instances: [
          { prompt, image: { imageBytes: b64 } }
        ]
      }

      const g = await callGemini(payload)
      // extract common shapes
      let outBase64 = null
      if (g?.generatedImages?.[0]?.image?.imageBytes) outBase64 = g.generatedImages[0].image.imageBytes
      else if (g?.output?.[0]?.image_base64) outBase64 = g.output[0].image_base64
      else if (g?.predictions?.[0]?.b64_json) outBase64 = g.predictions[0].b64_json

      if (outBase64) {
        const buf = Buffer.from(outBase64, 'base64')
        res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': String(buf.length) })
        res.end(buf)
        return
      }

      // If API returned a URL, forward it
      if (g?.generatedImages?.[0]?.image?.uri) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ url: g.generatedImages[0].image.uri }))
        return
      }

      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'unexpected gemini response', raw: g }))
    } catch (err) {
      console.error(err)
      res.writeHead(err.status || 500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: String(err) }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, () => {
  console.log(`Gemini simple proxy running on http://localhost:${PORT} (model=${GEMINI_MODEL})`)
})
