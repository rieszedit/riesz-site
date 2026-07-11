import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const entry = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')

const requiredImports = [
  '@fontsource/archivo/500.css',
  '@fontsource/archivo/700.css',
  '@fontsource/archivo/800.css',
  '@fontsource/archivo/900.css',
  '@fontsource/space-grotesk/500.css',
  '@fontsource/space-grotesk/600.css',
  '@fontsource/space-grotesk/700.css',
  '@fontsource/noto-sans-jp/400.css',
  '@fontsource/noto-sans-jp/500.css',
  '@fontsource/noto-sans-jp/700.css',
  '@fontsource/noto-sans-jp/900.css',
]

test('loads every approved font weight from the local build', () => {
  for (const fontImport of requiredImports) {
    assert.ok(
      entry.includes(`'${fontImport}'`) || entry.includes(`"${fontImport}"`),
      `missing ${fontImport}`,
    )
  }
})

test('does not load the Google Fonts stylesheet', () => {
  assert.doesNotMatch(styles, /fonts\.googleapis\.com|fonts\.gstatic\.com/)
})
