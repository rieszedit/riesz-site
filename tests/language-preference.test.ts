import assert from 'node:assert/strict'
import test from 'node:test'

import {
  readLanguagePreference,
  writeLanguagePreference,
} from '../src/language-preference.ts'

test('reads only supported stored languages', () => {
  assert.equal(readLanguagePreference({ getItem: () => 'en' }), 'en')
  assert.equal(readLanguagePreference({ getItem: () => 'fr' }), 'ja')
  assert.equal(readLanguagePreference({ getItem: () => null }), 'ja')
})

test('falls back safely when storage access throws', () => {
  assert.equal(
    readLanguagePreference({
      getItem: () => {
        throw new Error('blocked')
      },
    }),
    'ja',
  )
  assert.doesNotThrow(() =>
    writeLanguagePreference(
      {
        setItem: () => {
          throw new Error('blocked')
        },
      },
      'en',
    ),
  )
})
