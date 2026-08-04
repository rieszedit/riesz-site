import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const root = path.resolve(import.meta.dirname, '..')
const socialImagePath = path.join(root, 'public', 'media', 'riesz-social-card.jpg')

function readJpegDimensions(buffer: Buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, 'social image must be a JPEG')

  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    const marker = buffer[offset + 1]
    offset += 2

    if (marker === 0xd8 || marker === 0xd9) {
      continue
    }

    const segmentLength = buffer.readUInt16BE(offset)
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }

    offset += segmentLength
  }

  throw new Error('JPEG dimensions were not found')
}

test('uses the dedicated 1200 by 630 social card on every public page', () => {
  assert.equal(existsSync(socialImagePath), true, 'dedicated social card is missing')
  assert.deepEqual(readJpegDimensions(readFileSync(socialImagePath)), {
    width: 1200,
    height: 630,
  })

  for (const relativePath of ['index.html', 'business/index.html']) {
    const html = readFileSync(path.join(root, relativePath), 'utf8')

    assert.match(html, /https:\/\/riesz\.org\/media\/riesz-social-card\.jpg/)
    assert.match(html, /property="og:image:width" content="1200"/)
    assert.match(html, /property="og:image:height" content="630"/)
    assert.match(html, /property="og:image:type" content="image\/jpeg"/)
    assert.match(html, /name="twitter:image:alt"/)
    assert.doesNotMatch(html, /unknown-mother-goose-poster\.jpg/)
  }
})
