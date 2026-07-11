import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../src/App.css', import.meta.url), 'utf8')

test('lets the desktop contact heading wrap within its grid column', () => {
  const desktopContactHeading = css.match(/\.contact-intro h2\s*{([^}]*)}/s)?.[1] ?? ''

  assert.match(desktopContactHeading, /white-space:\s*normal;/)
  assert.doesNotMatch(desktopContactHeading, /white-space:\s*nowrap;/)
})

test('allows long contact headings to wrap on small screens', () => {
  const mobileStart = css.indexOf('@media (max-width: 760px)')
  const mobileEnd = css.indexOf('@media (prefers-reduced-motion', mobileStart)
  const mobileCss = css.slice(mobileStart, mobileEnd)

  assert.match(
    mobileCss,
    /\.contact-intro h2\s*{[^}]*white-space:\s*normal;/s,
  )
})

test('keeps the English business heading inside narrow mobile screens', () => {
  const narrowStart = css.indexOf('@media (max-width: 360px)')
  const narrowEnd = css.indexOf('@media (prefers-reduced-motion', narrowStart)
  const narrowCss = css.slice(narrowStart, narrowEnd)

  assert.notEqual(narrowStart, -1)
  assert.match(
    narrowCss,
    /\.business-hero h1\s*{[^}]*font-size:\s*2\.5rem;/s,
  )
})

test('stacks corporate work rows without horizontal overflow on mobile', () => {
  const mobileStart = css.indexOf('@media (max-width: 760px)')
  const mobileEnd = css.indexOf('@media (max-width: 360px)', mobileStart)
  const mobileCss = css.slice(mobileStart, mobileEnd)

  assert.match(
    mobileCss,
    /\.business-work-row\s*{[^}]*grid-template-columns:\s*1fr;/s,
  )
})
