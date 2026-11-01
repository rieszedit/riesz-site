import { expect, test } from '@playwright/test'

test('shows six representative works and reveals the complete portfolio with the keyboard', async ({ page }) => {
  await page.goto('/')
  const works = page.locator('#works')
  const more = works.locator('.more-works')
  const summary = more.locator('summary')
  await expect(works.locator('.work-card:visible')).toHaveCount(6)
  await expect(works.locator('.work-grid--featured h3')).toHaveText([
    '神っぽいな', 'アンノウン・マザーグース', 'ザムザ',
    'あいしていたのに', '晩餐歌', 'スパークル',
  ])
  await expect(more).not.toHaveAttribute('open', '')
  await expect(summary).toHaveAccessibleName('残り12件の実績を見る')
  await expect(works.getByRole('link', { name: 'YouTube再生リストを見る' })).toHaveAttribute('href', /youtube\.com\/playlist/)
  await expect(works.getByRole('link', { name: 'YouTube再生リストを見る' })).toHaveAttribute('target', '_blank')
  for (const link of await works.locator('.work-grid--featured .work-card > a').all()) {
    await expect(link).toHaveAccessibleName(/Watch/)
  }

  await summary.focus()
  await summary.press('Tab')
  await expect(page.locator('.pricing-comparison')).toBeFocused()
  await summary.focus()
  await summary.press('Enter')
  await expect(more).toHaveAttribute('open', '')
  await expect(works.locator('.work-card:visible')).toHaveCount(18)
  await expect(summary).toHaveAccessibleName('追加の実績を閉じる')
  await summary.press('Tab')
  await expect(works.locator('.work-grid--additional .work-card > a').first()).toBeFocused()
  await page.locator('.language-toggle').click()
  await expect(more).toHaveAttribute('open', '')
  await expect(summary).toHaveAccessibleName('Hide additional works')
  await expect(works.locator('.work-grid--featured h3')).toHaveText([
    'God-ish', 'Unknown Mother Goose', 'Samsa',
    'Aishite Ita Noni', 'Bansanka', 'Sparkle',
  ])
  for (const link of await works.locator('.work-card > a').all()) {
    await expect(link).toHaveAccessibleName(/Watch/)
  }
  await summary.focus()
  await summary.press('Space')
  await expect(more).not.toHaveAttribute('open', '')
  await expect(summary).toBeFocused()
  await expect(works.locator('.work-card:visible')).toHaveCount(6)
  await expect(summary).toHaveAccessibleName('View 12 more works')
})

test('featured and additional work links preserve the correct Main and Hybrid presets', async ({ page }) => {
  await page.goto('/')
  const form = page.locator('form.contact-form')
  const clientReferences = form.locator('[name="client_reference_urls"]')
  await clientReferences.fill('https://example.com/client-reference')
  const cases = [
    ['ザムザ', 'Riesz Main Flagship', 'GhxUkShq1MU'],
    ['あいしていたのに', 'Hybrid Flagship', 'QWItOSj0bEU'],
    ['晩餐歌', 'Riesz Main Standard', '_CK1kzr3myE'],
    ['スパークル', 'Hybrid Standard', 'u5pwAfnnlKc'],
  ]
  for (const [title, plan, id] of cases) {
    await page.locator('#works').getByRole('link', { name: `この規模で相談する: ${title}`, exact: true }).click()
    await expect(form.locator('[name="preferred_plan"]')).toHaveValue(plan)
    await expect(form.locator('[name="riesz_reference_url"]')).toHaveValue(`https://www.youtube.com/watch?v=${id}`)
    await expect(clientReferences).toHaveValue('https://example.com/client-reference')
  }
  await page.locator('.more-works > summary').click()
  await page.getByRole('link', { name: 'この規模で相談する: 一体いつから', exact: true }).click()
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Hybrid Flagship')
  await expect(form.locator('[name="riesz_reference_url"]')).toHaveValue('https://www.youtube.com/watch?v=bqmOBiWv9_s')
  await expect(clientReferences).toHaveValue('https://example.com/client-reference')
})

test('work cards stay readable at desktop, tablet and phone widths in both languages', async ({ page }) => {
  for (const [width, columns] of [[320, 1], [390, 1], [768, 2], [1120, 2], [1440, 3], [1920, 3]]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    for (const lang of ['ja', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== lang) {
        await page.locator('.language-toggle').click()
      }
      await page.evaluate(() => document.fonts.ready)
      expect(await page.locator('.work-grid--featured').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length)).toBe(columns)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const more = page.locator('.more-works')
      if (await more.getAttribute('open') === null) await more.locator('summary').click()
      const measurements = await page.locator('.work-card').evaluateAll(cards => cards.map(card => {
        const title = card.querySelector('h3')!
        const button = card.querySelector('.work-contact-link')!
        const bounds = card.getBoundingClientRect()
        const buttonBounds = button.getBoundingClientRect()
        return {
          titleFits: title.scrollWidth <= title.clientWidth + 1,
          cardFits: card.scrollWidth <= card.clientWidth + 1,
          top: Math.round(bounds.top),
          buttonBottom: Math.round(buttonBounds.bottom),
          buttonHeight: buttonBounds.height,
        }
      }))
      for (const m of measurements) {
        expect(m.titleFits, `Title overflow at ${width}px in ${lang}`).toBe(true)
        expect(m.cardFits, `Card overflow at ${width}px in ${lang}`).toBe(true)
        expect(m.buttonHeight).toBeGreaterThanOrEqual(44)
        const row = measurements.filter(other => other.top === m.top)
        expect(Math.max(...row.map(other => other.buttonBottom)) - Math.min(...row.map(other => other.buttonBottom))).toBeLessThanOrEqual(1)
      }
      await expect(more.locator('summary')).toBeVisible()
    }
  }
})
