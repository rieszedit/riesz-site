import { expect, test } from '@playwright/test'

test('a failed or ambiguous response never clears the inquiry or auto-resends', async ({
  page,
}) => {
  let calls = 0
  await page.route('https://formspree.io/f/test-personal', async (route) => {
    calls++
    await route.abort('failed')
  })
  await page.goto('/#contact')
  const form = page.locator('form')
  await form.locator('[name="name"]').fill('Reception test')
  await form.locator('[name="email"]').fill('test@example.com')
  await form.locator('[name="request_type"]').selectOption('その他')
  await form.locator('[name="budget"]').selectOption('相談したい')
  await form.locator('[name="delivery_date"]').fill('未定')
  await form.locator('[name="message"]').fill('Keep these details on failure.')
  await form.getByRole('button', { name: '見積もり相談を送る' }).click()
  await expect(form.getByRole('alert')).toContainText(
    '受付結果を確認できません',
  )
  await expect(form.locator('[name="message"]')).toHaveValue(
    'Keep these details on failure.',
  )
  const receipt = await form.locator('.receipt-id').innerText()
  expect(receipt).toContain('RID-')
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await form.getByRole('button', { name: '相談内容をコピー' }).click()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('Keep these details on failure.')
  expect(copied).toContain(receipt.split(': ')[1])
  expect(calls).toBe(1)
})

test('rough-art follow-up fields are conditional and optional', async ({
  page,
}) => {
  await page.goto('/#contact')
  const form = page.locator('form')
  await form.locator('details > summary').click()
  await expect(form.locator('[name="rough_asset_start"]')).toHaveCount(0)
  await form.locator('[name="illustration_status"]').selectOption('ラフ段階')
  await expect(form.locator('[name="rough_asset_start"]')).toBeVisible()
  await expect(form.locator('[name="final_illustration_date"]')).toBeVisible()
  await form.locator('[name="illustration_status"]').selectOption('清書済み')
  await expect(form.locator('[name="rough_asset_start"]')).toHaveCount(0)
  await expect(form.locator('[name="final_illustration_date"]')).toHaveCount(0)
  await form.locator('[name="illustration_status"]').selectOption('')
  await expect(form.locator('[name="illustration_status"]')).toHaveValue('')
})

test('privacy has both languages and does not overflow small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/privacy/')
  await expect(
    page.getByRole('heading', { name: '個人情報の取り扱い', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: /EN/ }).click()
  await expect(
    page.getByRole('heading', { name: 'Privacy Policy', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

test('prices display tax-inclusive amounts with the agreed plan scope', async ({
  page,
}) => {
  await page.goto('/#pricing')
  for (const [id, amount] of [
    ['main-standard', '165,000'],
    ['main-flagship', '275,000'],
    ['hybrid-standard', '187,000'],
    ['hybrid-flagship', '297,000'],
  ]) {
    await expect(
      page.locator(`#tier-${id} .pricing-tier__price`),
    ).toContainText(amount)
  }
  await expect(page.locator('.pricing-comparison')).toContainText('Riesz Main')
  await expect(page.locator('.pricing-comparison')).toContainText('Hybrid')
})

test('initial inquiry requires only the essential fields', async ({ page }) => {
  for (const [path, expected] of [
    [
      '/',
      ['budget', 'delivery_date', 'email', 'message', 'name', 'request_type'],
    ],
    [
      '/business/',
      ['company', 'delivery_date', 'email', 'name', 'project_summary'],
    ],
  ] as const) {
    await page.goto(path)
    const required = await page
      .locator('form [required]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('name')).sort(),
      )
    expect(required).toEqual([...expected].sort())
    await expect(page.locator('form details')).not.toHaveAttribute('open', '')
    await expect(page.locator('form a[href="/privacy/"]')).toBeVisible()
  }
})

test('cross-page pricing links and cold contact links reach their sections', async ({
  page,
}) => {
  await page.goto('/business/#contact')
  await expect
    .poll(() =>
      page
        .locator('#contact')
        .evaluate((node) => node.getBoundingClientRect().top),
    )
    .toBeLessThan(200)
  await page
    .getByLabel('Primary navigation')
    .getByRole('link', { name: 'Pricing', exact: true })
    .click()
  await expect
    .poll(() =>
      page
        .locator('#pricing')
        .evaluate((node) => node.getBoundingClientRect().top),
    )
    .toBeLessThan(200)
})

test('plan consultation does not replace client references or select a portfolio work', async ({
  page,
}) => {
  await page.goto('/')
  await page
    .locator('form [name="client_reference_urls"]')
    .fill('https://example.com/client-video')
  await page
    .locator('.pricing-tier')
    .filter({ hasText: 'Hybrid Standard' })
    .getByRole('link', { name: 'このプランで相談' })
    .click()
  await expect(page.locator('form [name="preferred_plan"]')).toHaveValue(
    'Hybrid Standard',
  )
  await expect(page.locator('form [name="client_reference_urls"]')).toHaveValue(
    'https://example.com/client-video',
  )
  await expect(page.locator('form [name="riesz_reference_url"]')).toHaveCount(0)
})

test('corporate errors preserve content and offer an email fallback', async ({
  page,
}) => {
  await page.route('https://formspree.io/f/test-business', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  )
  await page.goto('/business/')
  const form = page.locator('form')
  await form.locator('[name="company"]').fill('TEST Company')
  await form.locator('[name="name"]').fill('TEST Client')
  await form.locator('[name="email"]').fill('client@example.com')
  await form.locator('[name="delivery_date"]').fill('未定')
  await form
    .locator('[name="project_summary"]')
    .fill('This is an automated test, not a real inquiry.')
  await form.getByRole('button', { name: '法人案件を相談する' }).click()
  await expect(form.getByRole('alert')).toBeVisible()
  await expect(form.locator('[name="company"]')).toHaveValue('TEST Company')
  await expect(
    form.getByRole('button', { name: '相談内容をコピー' }),
  ).toBeVisible()
  await expect(
    form.getByRole('link', { name: 'メールで送る' }),
  ).toHaveAttribute('href', /mailto:rieszedit@gmail.com/)
})
