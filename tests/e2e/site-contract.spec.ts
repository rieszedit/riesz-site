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

test('personal form preserves its submission contract and portfolio preset', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const form = page.locator('form.contact-form')

  await expect(readFormContract(form)).resolves.toEqual({
    names: [
      '_gotcha',
      '_subject',
      'budget',
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
      'references',
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
      'references',
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

  await page.locator('.work-contact-link').first().click()
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Riesz Main Flagship')
  await expect(form.locator('[name="budget"]')).toHaveValue('25万円以上')
  await expect(form.locator('[name="references"]')).toHaveValue(
    'https://www.youtube.com/watch?v=vIHCFGj_G2E',
  )

  await page.getByRole('button', { name: /EN/ }).click()
  await expect(form.locator('[name="preferred_plan"]')).toHaveValue('Riesz Main Flagship')
  await expect(form.locator('[name="budget"]')).toHaveValue('25万円以上')
  await expect(form.locator('[name="references"]')).toHaveValue(
    'https://www.youtube.com/watch?v=vIHCFGj_G2E',
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
