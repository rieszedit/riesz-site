import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`layout evidence at ${width}px with delayed fonts`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.addInitScript(() => {
      const shifts: { value: number; sources: string[] }[] = []
      Object.assign(window, { testLayoutShifts: shifts })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            hadRecentInput: boolean
            value: number
            sources: { node?: HTMLElement }[]
          }
          if (!shift.hadRecentInput)
            shifts.push({
              value: shift.value,
              sources: shift.sources.map(
                (source) =>
                  source.node?.className || source.node?.tagName || '',
              ),
            })
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.route(/\.woff2?$/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 600))
      await route.continue()
    })
    for (const path of ['/', '/business/']) {
      await page.goto(path, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      const shifts = await page.evaluate(
        () =>
          (
            window as unknown as {
              testLayoutShifts: { value: number; sources: string[] }[]
            }
          ).testLayoutShifts,
      )
      await testInfo.attach(
        `layout-${path === '/' ? 'home' : 'business'}.json`,
        { body: JSON.stringify(shifts), contentType: 'application/json' },
      )
      console.log(
        `Load layout-shift sum ${width}px ${path}: ${shifts.reduce((total, shift) => total + shift.value, 0).toFixed(4)}`,
      )
      // The aggregate is stricter than CLS session windows for this short load.
      expect(
        shifts.reduce((total, shift) => total + shift.value, 0),
      ).toBeLessThanOrEqual(0.1)
      await page.screenshot({
        path: `output/playwright/intake-${width}-${path === '/' ? 'home' : 'business'}.png`,
      })
      await page.locator('#contact').scrollIntoViewIfNeeded()
      await page.screenshot({
        path: `output/playwright/intake-${width}-${path === '/' ? 'personal' : 'corporate'}-contact.png`,
      })
      if (path === '/') {
        await page.locator('.pricing-comparison').scrollIntoViewIfNeeded()
        await page.screenshot({
          path: `output/playwright/intake-${width}-pricing.png`,
        })
      }
    }
  })
}
