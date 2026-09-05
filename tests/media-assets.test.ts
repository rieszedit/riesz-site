import assert from 'node:assert/strict'
import { closeSync, existsSync, openSync, readSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const desktopPath = new URL(
  '../public/media/unknown-mother-goose-hero.mp4',
  import.meta.url,
)
const mobilePath = new URL(
  '../public/media/unknown-mother-goose-hero-mobile.mp4',
  import.meta.url,
)
const posterPath = new URL(
  '../public/media/unknown-mother-goose-poster.webp',
  import.meta.url,
)

type ProbeStream = {
  codec_name: string
  codec_type: string
  width?: number
  height?: number
  pix_fmt?: string
  r_frame_rate?: string
}

type ProbeResult = {
  streams: ProbeStream[]
  format: {
    duration: string
    size: string
  }
}

function probe(path: URL) {
  const result = spawnSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration,size',
      '-show_entries',
      'stream=codec_name,codec_type,width,height,pix_fmt,r_frame_rate',
      '-of',
      'json',
      fileURLToPath(path),
    ],
    { encoding: 'utf8' },
  )

  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout) as ProbeResult
}

function expectFastStart(path: URL) {
  const handle = openSync(path, 'r')
  let header = ''

  try {
    const buffer = Buffer.alloc(128 * 1024)
    const bytesRead = readSync(handle, buffer, 0, buffer.length, 0)
    header = buffer.subarray(0, bytesRead).toString('latin1')
  } finally {
    closeSync(handle)
  }

  assert.ok(header.indexOf('moov') > 0)
  assert.ok(header.indexOf('moov') < header.indexOf('mdat'))
}

test('responsive hero media matches the approved quality profile', () => {
  assert.ok(existsSync(desktopPath), 'desktop hero is missing')
  assert.ok(existsSync(mobilePath), 'mobile hero is missing')
  assert.ok(existsSync(posterPath), 'WebP poster is missing')

  const desktop = probe(desktopPath)
  const mobile = probe(mobilePath)
  const desktopVideo = desktop.streams.find((stream) => stream.codec_type === 'video')
  const mobileVideo = mobile.streams.find((stream) => stream.codec_type === 'video')

  assert.deepEqual(desktopVideo, {
    codec_name: 'h264',
    codec_type: 'video',
    width: 1920,
    height: 1080,
    pix_fmt: 'yuv420p',
    r_frame_rate: '15/1',
  })
  assert.deepEqual(mobileVideo, {
    codec_name: 'h264',
    codec_type: 'video',
    width: 960,
    height: 540,
    pix_fmt: 'yuv420p',
    r_frame_rate: '15/1',
  })
  assert.equal(
    desktop.streams.filter((stream) => stream.codec_type === 'audio').length,
    0,
  )
  assert.equal(
    mobile.streams.filter((stream) => stream.codec_type === 'audio').length,
    0,
  )

  const desktopSize = Number(desktop.format.size)
  const mobileSize = Number(mobile.format.size)
  assert.ok(desktopSize >= 4_800_000 && desktopSize <= 6_500_000)
  assert.ok(mobileSize >= 1_900_000 && mobileSize <= 3_200_000)
  assert.ok(
    Math.abs(Number(desktop.format.duration) - Number(mobile.format.duration)) < 0.05,
  )
  assert.ok(statSync(posterPath).size < 180_000)

  expectFastStart(desktopPath)
  expectFastStart(mobilePath)
})
