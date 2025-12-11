const fs = require('fs')
const path = require('path')

function createTestImageData(w, h) {
  const len = w * h * 4
  const data = new Uint8ClampedArray(len)
  for (let i = 0; i < len; i += 4) {
    // simple pattern: gradient
    const px = (i / 4) % w
    const py = Math.floor((i / 4) / w)
    const v = ((px + py) % 256)
    data[i] = v
    data[i + 1] = v
    data[i + 2] = v
    data[i + 3] = 255
  }
  return { data, width: w, height: h }
}

function dummyTransform(imageData) {
  const { data: src, width: w, height: h } = imageData
  const out = new Uint8ClampedArray(src.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const r = src[i], g = src[i + 1], b = src[i + 2]
      const gray = (r * 0.3 + g * 0.59 + b * 0.11) | 0
      const iR = (y * w + Math.min(w - 1, x + 1)) * 4
      const r2 = src[iR], g2 = src[iR + 1], b2 = src[iR + 2]
      const gray2 = (r2 * 0.3 + g2 * 0.59 + b2 * 0.11) | 0
      let edge = Math.abs(gray - gray2) * 2
      edge = Math.max(0, Math.min(255, edge))
      const v = 255 - edge
      out[i] = out[i + 1] = out[i + 2] = v
      out[i + 3] = 255
    }
  }
  return { data: out, width: w, height: h }
}

async function measure() {
  const sizes = [256, 512, 1024]
  const results = []
  for (const s of sizes) {
    const id = createTestImageData(s, s)
    const runs = 3
    const times = []
    for (let i = 0; i < runs; i++) {
      const t0 = Date.now()
      dummyTransform(id)
      const t1 = Date.now()
      times.push(t1 - t0)
    }
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    results.push({ size: `${s}x${s}`, avgMs: avg, runs: times })
  }

  const outPath = path.join(__dirname, '..', 'model', 'metrics.md')
  const lines = []
  lines.push('# Model Metrics (POC) — measured ' + new Date().toISOString())
  lines.push('')
  for (const r of results) {
    lines.push(`- ${r.size}: avg ${r.avgMs.toFixed(1)} ms over ${r.runs.length} runs (samples: ${r.runs.join(', ')} ms)`)
  }
  lines.push('')
  fs.appendFileSync(outPath, '\n' + lines.join('\n'))
  console.log('Wrote metrics to', outPath)
}

measure().catch((err) => {
  console.error(err)
  process.exit(1)
})
