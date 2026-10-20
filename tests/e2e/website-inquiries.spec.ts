import { expect, test } from '@playwright/test'

test('all commission pages share the confirmed schedule and corporate priority', async ({ page }) => {
  for (const path of ['/', '/business/', '/website/']) {
    await page.goto(path)
    const panel = page.getByRole('complementary', { name: '制作の受付状況' })
    await expect(panel).toContainText('企業様優先')
    for (const [month, status] of [['2026年11月', '△要相談'], ['2026年12月', '○受付中'], ['2027年1月以降', '◎余裕あり']]) {
      await expect(panel.getByRole('listitem').filter({ hasText: month })).toContainText(status)
    }
    await expect(panel.locator('time')).toHaveAttribute('datetime', '2026-10-20')
  }
})

test('website form submits to the appropriate existing endpoint with a distinct subject', async ({ page }) => {
  const submissions: { url: string; body: string }[] = []
  await page.route('https://formspree.io/**', async (route) => {
    submissions.push({ url: route.request().url(), body: route.request().postData() ?? '' })
    await route.fulfill({ json: { ok: true } })
  })
  for (const kind of ['personal', 'business']) {
    await page.goto('/website/#contact')
    const form = page.locator('form')
    await form.locator('[name="client_type"]').selectOption(kind)
    await form.locator('[name="name"]').fill('Website client')
    await form.locator('[name="email"]').fill('test@example.com')
    if (kind === 'business') {
      await expect(form.locator('[name="company"]')).toHaveAttribute('required', '')
      await form.locator('[name="company"]').fill('Test company')
    }
    await form.locator('[name="website_type"]').selectOption('portfolio')
    await form.locator('[name="project_summary"]').fill('A new website for my activities.')
    await form.getByRole('button', { name: 'Web制作の相談を送る' }).click()
    await expect(form.getByRole('status')).toContainText('相談を受け付けました')
    await expect(form.locator('[name="project_summary"]')).toHaveValue('')
    const submission = submissions.at(-1)!
    expect(submission.url).toBe(`https://formspree.io/f/test-${kind}`)
    expect(submission.body).toContain(`[Riesz ${kind === 'business' ? '法人' : '個人'}依頼] Webサイト制作 | Website client | RID-`)
    expect(submission.body).toContain('name="service_category"\r\n\r\nwebsite')
    expect(submission.body).toContain('A new website for my activities.')
    expect(submission.body).not.toContain('preferred_plan')
    expect(submission.body).not.toContain('song_length')
  }
  expect(submissions).toHaveLength(2)
})

test('website failure preserves optional references and offers a complete email fallback', async ({ page }) => {
  let calls = 0
  await page.route('https://formspree.io/**', async (route) => {
    calls++
    await route.fulfill({ status: 503, body: 'Unavailable' })
  })
  await page.goto('/website/#contact')
  const form = page.locator('form')
  await form.locator('[name="name"]').fill('Client')
  await form.locator('[name="email"]').fill('client@example.com')
  await form.locator('[name="website_type"]').selectOption('redesign')
  await form.locator('[name="project_summary"]').fill('Please improve my current site.')
  await form.locator('summary').click()
  await form.locator('[name="website_reference_urls"]').fill('https://example.com/reference')
  await form.getByRole('button', { name: 'Web制作の相談を送る' }).click()
  await expect(form.getByRole('alert')).toContainText('受付結果を確認できません')
  await expect(form.locator('[name="website_reference_urls"]')).toHaveValue('https://example.com/reference')
  await expect(form.locator('[name="project_summary"]')).toHaveValue('Please improve my current site.')
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await form.getByRole('button', { name: '相談内容をコピー' }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('https://example.com/reference')
  expect(copied).toContain('Please improve my current site.')
  expect(copied).toContain('RID-')
  expect(calls).toBe(1)
})

test('website language and client-type changes preserve the inquiry', async ({ page }) => {
  await page.goto('/website/#contact')
  const form = page.locator('form')
  await form.locator('[name="name"]').fill('Keep this')
  await form.locator('[name="website_type"]').selectOption('business-site')
  await form.locator('[name="client_type"]').selectOption('business')
  await form.locator('[name="company"]').fill('Company')
  await form.locator('[name="project_summary"]').fill('Please keep these details.')
  await page.getByRole('button', { name: /Switch language to EN/ }).click()
  await expect(page).toHaveTitle('Website Design & Estimates | Riesz')
  await expect(form.locator('[name="website_type"]')).toHaveValue('business-site')
  await expect(form.locator('[name="company"]')).toHaveValue('Company')
  await expect(form.locator('[name="name"]')).toHaveValue('Keep this')
  await expect(form.locator('[name="project_summary"]')).toHaveValue('Please keep these details.')
  await expect(form).toHaveAttribute('action', 'https://formspree.io/f/test-business')
  await expect(form.getByRole('button', { name: 'Send Website Inquiry' })).toBeVisible()
  await form.locator('[name="client_type"]').selectOption('personal')
  await expect(form.locator('[name="company"]')).not.toHaveAttribute('required', '')
  await expect(form).toHaveAttribute('action', 'https://formspree.io/f/test-personal')
})

test('website inquiries have only essential required fields', async ({ page }) => {
  await page.goto('/website/#contact')
  const required = await page.locator('form [required]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('name')).sort())
  expect(required).toEqual(['client_type', 'email', 'name', 'project_summary', 'website_type'])
  await expect(page.locator('form details')).not.toHaveAttribute('open', '')
  await expect(page.locator('form a[href="/privacy/"]')).toBeVisible()
})

test('website portfolio and navigation remain usable in both languages on narrow screens', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/website/')
    for (const lang of ['ja', 'en']) {
      if (await page.locator('html').getAttribute('lang') !== lang) {
        await page.locator('.language-toggle').click()
      }
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      for (const item of await page.locator('.nav-links > *').all()) {
        const bounds = await item.boundingBox()
        expect(bounds!.height).toBeGreaterThanOrEqual(44)
        expect(bounds!.width).toBeGreaterThanOrEqual(44)
      }
      const projects = page.locator('.website-project a')
      await expect(projects).toHaveCount(2)
      await expect(projects.nth(0)).toHaveAttribute('href', 'https://utsumi.page/')
      await expect(projects.nth(1)).toHaveAttribute('href', 'https://yakihoko.com/ja/')
      for (const image of await page.locator('.website-project img').all()) {
        await image.scrollIntoViewIfNeeded()
        await image.evaluate((image: HTMLImageElement) => image.decode())
        expect(await image.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
      }
    }
  }
})
