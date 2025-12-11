import { describe, it, expect } from 'vitest'
import { getImageDimensions } from '../utils/imageUtils'

describe('imageUtils', () => {
  it('getImageDimensions rejects invalid file', async () => {
    const fake = new File(['foo'], 'foo.txt', { type: 'text/plain' })
    await expect(getImageDimensions(fake)).rejects.toBeTruthy()
  })
})
