import { expect, test } from '@playwright/test'

const widgetScript = `
window.turnstile = {
  render(container, options) {
    container.dataset.widgetSize = options.size;
    const input = document.createElement('input');
    input.type = 'hidden'; input.name = 'cf-turnstile-response';
    container.append(input);
    window.testChallenge = {
      solve() { input.value = 'verified-test-token'; options.callback(input.value); },
      expire() { input.value = ''; options['expired-callback'](); },
      fail() { input.value = ''; options['error-callback'](); },
      remove() { input.remove(); },
    };
    return 'mock-widget';
  },
  reset() { window.testChallenge.expire(); },
  remove() { window.testChallenge.remove(); },
};`

test('verification gates sending, expires safely and resets after acceptance', async ({
  page,
}) => {
  await page.route(
    'https://challenges.cloudflare.com/turnstile/v0/api.js*',
    (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: widgetScript,
      }),
  )
  let count = 0
  let body = ''
  await page.route('https://formspree.io/f/test-personal', async (route) => {
    count++
    body = route.request().postData() || ''
    await route.fulfill({
      contentType: 'application/json',
      body: '{"ok":true}',
    })
  })
  await page.goto('/#contact')
  const form = page.locator('form')
  await form.locator('[name="name"]').fill('Test Requester')
  await form.locator('[name="email"]').fill('test@example.com')
  await form.locator('[name="request_type"]').selectOption('その他')
  await form.locator('[name="budget"]').selectOption('相談したい')
  await form.locator('[name="delivery_date"]').fill('未定')
  await form
    .locator('[name="message"]')
    .fill('Verification test, not a real inquiry.')
  const button = form.getByRole('button', { name: '見積もり相談を送る' })
  await button.scrollIntoViewIfNeeded()
  await expect(button).toBeDisabled()
  await expect(form.locator('[name="cf-turnstile-response"]')).toHaveCount(1)
  await page.evaluate(() =>
    (
      window as unknown as { testChallenge: { solve(): void } }
    ).testChallenge.solve(),
  )
  await expect(button).toBeEnabled()
  await page.evaluate(() =>
    (
      window as unknown as { testChallenge: { expire(): void } }
    ).testChallenge.expire(),
  )
  await expect(button).toBeDisabled()
  await page.evaluate(() =>
    (
      window as unknown as { testChallenge: { solve(): void } }
    ).testChallenge.solve(),
  )
  await button.click()
  await expect(form.getByRole('status')).toContainText('相談を受け付けました')
  await expect(button).toBeDisabled()
  expect(count).toBe(1)
  expect(body).toContain('verified-test-token')
  expect(body).toContain('submission_id')
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await form.getByRole('button', { name: '相談内容をコピー' }).click()
  expect(
    await page.evaluate(() => navigator.clipboard.readText()),
  ).not.toContain('verified-test-token')
})

test('blocked verification retains email fallback and can load again', async ({
  page,
}) => {
  let loads = 0
  await page.route(
    'https://challenges.cloudflare.com/turnstile/v0/api.js*',
    async (route) => {
      loads++
      if (loads === 1) await route.abort('failed')
      else
        await route.fulfill({
          contentType: 'application/javascript',
          body: widgetScript,
        })
    },
  )
  await page.goto('/business/#contact')
  const button = page.getByRole('button', { name: '法人案件を相談する' })
  await button.scrollIntoViewIfNeeded()
  await expect(page.getByRole('alert')).toContainText(
    'ボット確認を完了できません',
  )
  await expect(button).toBeDisabled()
  await expect(page.getByRole('link', { name: 'メールで送る' })).toBeVisible()
  await page.getByRole('button', { name: '確認を再試行' }).click()
  await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(1)
  await page.evaluate(() =>
    (
      window as unknown as { testChallenge: { solve(): void } }
    ).testChallenge.solve(),
  )
  await expect(button).toBeEnabled()
  expect(loads).toBe(2)
})

test('narrow forms use the compact widget and adapt when resized', async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({contentType:'application/javascript',body:widgetScript}))
  await page.setViewportSize({width:320,height:800})
  await page.goto('/#contact')
  await page.locator('.contact-challenge').scrollIntoViewIfNeeded()
  await expect(page.locator('[data-widget-size="compact"]')).toHaveCount(1)
  await page.setViewportSize({width:1440,height:1000})
  await page.locator('.contact-challenge').scrollIntoViewIfNeeded()
  await expect(page.locator('[data-widget-size="flexible"]')).toHaveCount(1)
  await expect(page.locator('[name="cf-turnstile-response"]')).toHaveCount(1)
})
