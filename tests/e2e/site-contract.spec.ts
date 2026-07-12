import { expect, test, type Locator, type Page } from '@playwright/test'

type FormContract = {
  names: string[]
  required: string[]
}

async function readFormContract(form: Locator): Promise<FormContract> {
  return form.locator('[name]').evaluateAll((controls) => {
    const names = [...new Set(controls.map((control) => control.getAttribute('name') ?? ''))]
      .filter(Boolean)
      .sort()
    const required = [...new Set(
      controls
        .filter((control) => control.hasAttribute('required'))
        .map((control) => control.getAttribute('name') ?? ''),
    )]
      .filter(Boolean)
      .sort()

    return { names, required }
  })
}

async function readOptions(form: Locator, name: string) {
  return form.locator(`select[name="${name}"] option`).evaluateAll((options) =>
    options.map((option) => (option as HTMLOptionElement).value),
  )
}

async function expectNoHorizontalOverflow(page: Page, path: string, width: number) {
  await page.setViewportSize({ width, height: 900 })
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

test('personal form keeps client references separate from the selected Riesz work', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const form = page.locator('form.contact-form')

  await expect(readFormContract(form)).resolves.toEqual({
    names: [
      '_gotcha',
      '_subject',
      'budget',
      'client_reference_urls',
      'delivery_date',
      'discord',
      'email',
      'materials',
      'material_url',
      'message',
      'name',
      'portfolio_visibility',
      'preferred_plan',
      'production_setup',
      'project_file',
      'release_date',
      'request_type',
      'song_length',
      'x_id',
    ].sort(),
    required: [
      'budget',
      'delivery_date',
      'email',
      'name',
      'portfolio_visibility',
      'preferred_plan',
      'production_setup',
      'project_file',
      'request_type',
      'song_length',
    ].sort(),
  })

  await expect(readOptions(form, 'preferred_plan')).resolves.toEqual([
    '',
    'Riesz Main Standard',
    'Riesz Main Flagship',
    'Hybrid Standard',
    'Hybrid Flagship',
    'Partner Plan',
    'Short / Light',
    '相談して決めたい',
  ])
  await expect(readOptions(form, 'budget')).resolves.toEqual([
    '',
    '5万円〜10万円',
    '10万円〜15万円',
    '15万円〜20万円',
    '20万円〜25万円',
    '25万円以上',
    '相談したい',
  ])

  const clientReferences = form.locator('[name="client_reference_urls"]')
  await clientReferences.fill(
    'https://www.youtube.com/watch?v=client-reference\nhttps://vimeo.com/client-reference',
  )

  await page.locator('.work-contact-link').first().click()
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Riesz Main Flagship')
  await expect(form.locator('[name="budget"]')).toHaveValue('25万円以上')
  await expect(form.locator('[name="riesz_reference_work"]')).toHaveValue('神っぽいな')
  await expect(form.locator('[name="riesz_reference_url"]')).toHaveValue(
    'https://www.youtube.com/watch?v=vIHCFGj_G2E',
  )
  await expect(clientReferences).toHaveValue(
    'https://www.youtube.com/watch?v=client-reference\nhttps://vimeo.com/client-reference',
  )

  await page.getByRole('button', { name: /EN/ }).click()
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Riesz Main Flagship')
  await expect(form.locator('[name="budget"]')).toHaveValue('25万円以上')
  await expect(form.locator('[name="riesz_reference_work"]')).toHaveValue('神っぽいな')
  await expect(form.locator('[name="riesz_reference_url"]')).toHaveValue(
    'https://www.youtube.com/watch?v=vIHCFGj_G2E',
  )
  await expect(clientReferences).toHaveValue(
    'https://www.youtube.com/watch?v=client-reference\nhttps://vimeo.com/client-reference',
  )
})

test('selected Riesz work can be cleared without erasing the inquiry details', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const form = page.locator('form.contact-form')
  const clientReferences = form.locator('[name="client_reference_urls"]')

  await clientReferences.fill('https://www.youtube.com/watch?v=client-reference')
  await page.locator('.work-contact-link').first().click()
  await page.getByRole('button', { name: '作品の選択を解除' }).click()

  await expect(form.locator('[name="riesz_reference_work"]')).toHaveCount(0)
  await expect(form.locator('[name="riesz_reference_url"]')).toHaveCount(0)
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Riesz Main Flagship')
  await expect(form.locator('[name="budget"]')).toHaveValue('25万円以上')
  await expect(clientReferences).toHaveValue(
    'https://www.youtube.com/watch?v=client-reference',
  )
})

test('language changes preserve personal form selections and checkboxes', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const form = page.locator('form.contact-form')

  await form.locator('select[name="request_type"]').selectOption('歌ってみたMV')
  await form.locator('select[name="preferred_plan"]').selectOption('相談して決めたい')
  await form
    .locator('select[name="production_setup"]')
    .selectOption('一部協力クリエイター参加可')
  await form.locator('input[name="materials"][value="音源あり"]').check()

  await page.getByRole('button', { name: /EN/ }).click()

  await expect(form.locator('select[name="request_type"]')).toHaveValue('歌ってみたMV')
  await expect(form.locator('select[name="preferred_plan"]')).toHaveValue('相談して決めたい')
  await expect(form.locator('select[name="production_setup"]')).toHaveValue(
    '一部協力クリエイター参加可',
  )
  await expect(form.locator('input[name="materials"][value="音源あり"]')).toBeChecked()
})

test('language preference survives navigation between personal and business pages', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /EN/ }).click()
  await page
    .getByLabel('Primary navigation')
    .getByRole('link', { name: 'Business', exact: true })
    .click()

  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(
    page.getByRole('heading', { name: 'Business and Corporate Projects' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Riesz home' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(
    page.getByRole('heading', { name: 'Riesz', exact: true }),
  ).toBeVisible()
})

test('visible interaction labels are included in accessible names', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('button', { name: /EN/ })).toBeVisible()
  await expect(
    page.getByRole('link', { name: /^この規模で相談する: 神っぽいな$/ }),
  ).toBeVisible()
})

test('business form preserves its submission contract and select values', async ({ page }) => {
  await page.goto('/business/', { waitUntil: 'domcontentloaded' })
  const form = page.locator('form.contact-form')

  await expect(readFormContract(form)).resolves.toEqual({
    names: [
      '_gotcha',
      '_subject',
      'budget',
      'collaborator_participation',
      'company',
      'company_url',
      'delivery_date',
      'email',
      'material_url',
      'media',
      'message',
      'name',
      'nda_contract',
      'payment_terms',
      'portfolio_visibility',
      'project_file',
      'project_summary',
      'references',
      'release_date',
      'usage_scope',
    ].sort(),
    required: [
      'collaborator_participation',
      'company',
      'delivery_date',
      'email',
      'media',
      'name',
      'nda_contract',
      'payment_terms',
      'portfolio_visibility',
      'project_summary',
      'references',
      'release_date',
      'usage_scope',
    ].sort(),
  })

  await expect(readOptions(form, 'portfolio_visibility')).resolves.toEqual([
    '',
    '掲載可',
    '公開後なら掲載可',
    '掲載不可',
    '相談したい',
  ])
  await expect(readOptions(form, 'project_file')).resolves.toEqual([
    '',
    '希望しない',
    '希望する（+200,000円〜）',
    '相談したい',
  ])
})

test('personal and business pages do not overflow narrow viewports', async ({ page }) => {
  for (const width of [320, 412]) {
    await expectNoHorizontalOverflow(page, '/', width)
    await expectNoHorizontalOverflow(page, '/business/', width)
  }
})

test('hero media selects the desktop and mobile delivery files', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.hero-visual video')).toBeVisible()
  await expect
    .poll(() => page.locator('.hero-visual video').evaluate((video) => video.currentSrc))
    .toContain('unknown-mother-goose-hero.mp4')

  await page.setViewportSize({ width: 390, height: 844 })
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect
    .poll(() => page.locator('.hero-visual video').evaluate((video) => video.currentSrc))
    .toContain('unknown-mother-goose-hero-mobile.mp4')
})

test('reduced motion renders a static hero without video sources', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.hero-visual video')).toHaveCount(0)
  await expect(page.locator('.hero-visual picture img')).toBeVisible()

  await context.close()
})

test('Save-Data renders a static hero without video sources', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: {
        addEventListener() {},
        removeEventListener() {},
        saveData: true,
      },
    })
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.hero-visual video')).toHaveCount(0)
  await expect(page.locator('.hero-visual picture img')).toBeVisible()

  await context.close()
})

test('font files are delivered locally without changing the font families', async ({
  page,
}) => {
  const fontRequests: string[] = []
  const externalFontRequests: string[] = []
  page.on('request', (request) => {
    const url = request.url()
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url)) {
      externalFontRequests.push(url)
    }
    if (request.resourceType() === 'font') {
      fontRequests.push(url)
    }
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pageOrigin = new URL(page.url()).origin

  expect(externalFontRequests).toEqual([])
  expect(fontRequests.length).toBeGreaterThan(0)
  expect(fontRequests.every((url) => new URL(url).origin === pageOrigin)).toBe(true)
  await expect(page.locator('.hero-copy h1')).toHaveCSS('font-family', /Archivo/)
  await expect(page.locator('.hero-description')).toHaveCSS(
    'font-family',
    /Noto Sans JP/,
  )
})
