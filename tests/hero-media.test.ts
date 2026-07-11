import assert from 'node:assert/strict'
import test from 'node:test'

import { shouldRenderStaticHero } from '../src/hero-media.ts'

test('uses a static hero for reduced motion or Save-Data', () => {
  assert.equal(
    shouldRenderStaticHero({ reducedMotion: true, saveData: false }),
    true,
  )
  assert.equal(
    shouldRenderStaticHero({ reducedMotion: false, saveData: true }),
    true,
  )
  assert.equal(
    shouldRenderStaticHero({ reducedMotion: false, saveData: false }),
    false,
  )
})
