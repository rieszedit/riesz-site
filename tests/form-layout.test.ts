import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const source = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')

test('defines the approved personal form groups', () => {
  for (const id of [
    'personal-contact',
    'personal-request',
    'personal-schedule',
    'personal-terms',
  ]) {
    assert.match(source, new RegExp(`id="${id}"`))
  }
})

test('keeps both Formspree actions and honeypots in place', () => {
  assert.match(source, /action={formEndpoints\.personal}/)
  assert.match(source, /action={formEndpoints\.business}/)
  assert.equal(source.match(/<HoneypotField \/>/g)?.length, 2)
})

test('defines the approved business form groups', () => {
  for (const id of [
    'business-contact',
    'business-project',
    'business-schedule',
    'business-terms',
  ]) {
    assert.match(source, new RegExp(`id="${id}"`))
  }
})
