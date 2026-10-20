import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSubmission, submitToFormspree } from '../src/contact-delivery.ts'
import { websiteTypeOptions, websiteUpdateOptions } from '../src/website-form-options.ts'

test('each inquiry has a safe unique subject and stable receipt id', () => {
  const data = new FormData()
  data.set('name', '名前\r\nBcc: hidden@example.com')
  data.set('email', 'client@example.com')
  data.set('message', '相談内容')
  const first = buildSubmission(data, 'personal', 'RID-20260905-11111111')
  const next = buildSubmission(data, 'personal', 'RID-20260905-22222222')
  assert.match(first.subject, /^\[Riesz 個人依頼\]/)
  assert.match(first.subject, /RID-20260905-11111111/)
  assert.doesNotMatch(first.subject, /[\r\n]/)
  assert.notEqual(first.subject, next.subject)
  assert.equal(first.data.get('submission_id'), 'RID-20260905-11111111')
  assert.equal(first.data.get('_subject'), first.subject)
})

test('email fallback includes human-readable content, not anti-bot tokens', () => {
  const data = new FormData()
  data.set('name', 'Riesz')
  data.set('cf-turnstile-response', 'private-token')
  data.append('materials', '音源あり')
  data.append('materials', '歌詞あり')
  const result = buildSubmission(data, 'business', 'RID-test')
  assert.match(result.body, /音源あり/)
  assert.match(result.body, /歌詞あり/)
  assert.doesNotMatch(result.body, /private-token|cf-turnstile/)
  assert.match(result.subject, /^\[Riesz 法人依頼\]/)
})

test('website inquiries share a readable provider message and fallback without changing routing or raw fields', () => {
  for (const kind of ['personal', 'business'] as const) {
    const data = new FormData()
    data.set('name', 'Client')
    data.set('email', 'client@example.com')
    data.set('_replyto', 'reply@example.com')
    data.set('service_category', 'website')
    data.set('client_type', kind)
    data.set('company', 'Client Studio')
    data.set('website_type', 'portfolio')
    data.set('project_summary', '  活動紹介サイト\n作品一覧とお問い合わせを掲載したい。  ')
    data.set('budget', '20万円・相談したい')
    data.set('release_date', '来年4月頃')
    data.set('existing_website_url', 'https://example.com/current')
    data.append('website_reference_urls', 'https://example.com/')
    data.append('website_reference_urls', 'https://example.com/reference')
    data.set('website_updates', 'self')
    data.set('website_notes', '写真は準備済み\n5ページ程度')
    data.set('cf-turnstile-response', 'private-token')
    const original = Array.from(data.entries())
    const result = buildSubmission(data, kind, 'RID-web')

    assert.equal(result.subject, `[Riesz ${kind === 'business' ? '法人' : '個人'}依頼] Webサイト制作 | Client | RID-web`)
    assert.equal(result.data.get('_subject'), result.subject)
    assert.equal(result.data.get('email'), 'client@example.com')
    assert.equal(result.data.get('_replyto'), 'reply@example.com')
    assert.equal(result.data.get('message'), result.body)
    assert.match(result.body, /制作サービス \/ Service: Webサイト制作 \/ Website design/)
    assert.ok(result.body.includes(
      `ご依頼者の区分 / Client type: ${kind === 'business' ? '法人・企業 / Company / Organization' : '個人・個人事業主 / Individual / Sole proprietor'}`,
    ))
    assert.match(result.body, /サイトの種類 \/ Website type: ポートフォリオ・活動サイト \/ Portfolio \/ Artist website/)
    assert.ok(result.body.includes(`案件概要 / Project summary: ${data.get('project_summary')}`))
    assert.match(result.body, /予算（税別） \/ Budget before tax: 20万円・相談したい/)
    assert.match(result.body, /公開予定日 \/ Release date: 来年4月頃/)
    assert.match(result.body, /現在のサイト \/ Current website: https:\/\/example\.com\/current/)
    assert.match(result.body, /参考サイト \/ Reference websites: https:\/\/example\.com\//)
    assert.match(result.body, /参考サイト \/ Reference websites: https:\/\/example\.com\/reference/)
    assert.match(result.body, /公開後の更新 \/ Updates after launch: 自分で更新したい \/ I want to manage updates/)
    assert.match(result.body, /Web制作の補足 \/ Website notes: 写真は準備済み\n5ページ程度/)
    assert.match(result.body, /お問い合わせ番号 \/ Inquiry reference: RID-web/)
    assert.doesNotMatch(result.body, /private-token|_replyto|reply@example\.com/)
    assert.equal(result.data.get('budget_basis'), '税別 / Before tax')
    assert.equal(
      result.data.get('collaborator_approval'),
      '担当範囲と追加費用は見積もり時に明示確認 / Confirm scope and costs before commissioning',
    )
    for (const key of data.keys()) {
      assert.deepEqual(result.data.getAll(key), data.getAll(key), key)
    }
    assert.deepEqual(Array.from(data.entries()), original)
  }
})

test('website summaries translate every current select option without rewriting canonical values', () => {
  for (const [field, options] of [
    ['website_type', websiteTypeOptions],
    ['website_updates', websiteUpdateOptions],
  ] as const) {
    for (const option of options) {
      const data = new FormData()
      data.set('service_category', 'website')
      data.set(field, option.value)
      const result = buildSubmission(data, 'personal', 'RID-options')
      assert.ok(result.body.includes(`: ${option.ja} / ${option.en}`), `${field}: ${option.value}`)
      assert.equal(result.data.get(field), option.value)
      assert.equal(result.data.get('message'), result.body)
    }
  }
})

test('website summaries preserve unrecognized option values and omit blank optional fields', () => {
  const data = new FormData()
  data.set('service_category', 'website')
  data.set('client_type', 'future-client-type')
  data.set('website_type', 'future-website-type')
  data.set('website_updates', 'future-update-choice')
  data.set('website_notes', ' \n ')
  const result = buildSubmission(data, 'personal', 'RID-options')
  assert.match(result.body, /Client type: future-client-type/)
  assert.match(result.body, /Website type: future-website-type/)
  assert.match(result.body, /Updates after launch: future-update-choice/)
  assert.doesNotMatch(result.body, /Website notes:/)
  assert.equal(result.data.get('website_notes'), ' \n ')
})

test('website summaries exclude anti-bot and internal fields while keeping the provider payload intact', () => {
  const data = new FormData()
  data.set('service_category', 'website')
  const privateFields = {
    'cf-turnstile-response': 'turnstile-secret',
    'g-recaptcha-response': 'recaptcha-secret',
    'h-captcha-response': 'hcaptcha-secret',
    _gotcha: 'honeypot-secret',
    _internal: 'provider-secret',
    csrf_token: 'csrf-secret',
    internal_route: 'routing-secret',
    password: 'password-secret',
  }
  for (const [key, value] of Object.entries(privateFields)) data.set(key, value)
  const result = buildSubmission(data, 'business', 'RID-private')
  for (const [key, value] of Object.entries(privateFields)) {
    assert.equal(result.data.get(key), value)
    assert.ok(!result.body.includes(key), key)
    assert.ok(!result.body.includes(value), value)
  }
  assert.doesNotMatch(result.body, /collaborator_approval|Prior confirmation|Budget basis/)
  assert.equal(result.data.get('message'), result.body)
})

test('website summary appends a message without replacing an existing user message', () => {
  const data = new FormData()
  data.set('service_category', 'website')
  data.append('message', 'Original message\nSecond line')
  data.append('message', 'Additional message')
  const result = buildSubmission(data, 'personal', 'RID-message')
  assert.deepEqual(result.data.getAll('message'), [
    ...data.getAll('message'),
    result.body,
  ])
  assert.match(result.body, /相談内容 \/ Message: Original message\nSecond line/)
  assert.match(result.body, /相談内容 \/ Message: Additional message/)
  assert.deepEqual(data.getAll('message'), ['Original message\nSecond line', 'Additional message'])
})

test('non-website inquiries keep their original message and fallback values', () => {
  const data = new FormData()
  data.set('message', 'Original MV consultation')
  data.set('website_type', 'portfolio')
  data.set('custom_field', 'Custom content')
  const result = buildSubmission(data, 'personal', 'RID-mv')
  assert.deepEqual(result.data.getAll('message'), ['Original MV consultation'])
  assert.match(result.body, /相談内容 \/ Message: Original MV consultation/)
  assert.match(result.body, /Website type: portfolio/)
  assert.match(result.body, /custom_field: Custom content/)
  data.delete('message')
  assert.equal(buildSubmission(data, 'personal', 'RID-mv').data.has('message'), false)
})

test('MV subjects remain unchanged and arbitrary service strings cannot enter a subject', () => {
  const data = new FormData()
  data.set('name', 'Client')
  assert.equal(buildSubmission(data, 'personal', 'RID-mv').subject, '[Riesz 個人依頼] Client | RID-mv')
  data.set('service_category', 'website\r\nBcc: hidden@example.com')
  assert.equal(buildSubmission(data, 'personal', 'RID-mv').subject, '[Riesz 個人依頼] Client | RID-mv')
})

test('acceptance requires the provider confirmation, not just HTTP 200', async () => {
  for (const response of [{ ok: false }, {}, null]) {
    await assert.rejects(
      submitToFormspree('https://formspree.io/f/test', new FormData(), {
        fetcher: async () =>
          new Response(JSON.stringify(response), { status: 200 }),
      }),
      /not accepted/,
    )
  }
  await submitToFormspree('https://formspree.io/f/test', new FormData(), {
    fetcher: async () => new Response('{"ok":true}', { status: 200 }),
  })
})

test('times out a stuck request without automatically resending', async () => {
  let calls = 0
  let signal: AbortSignal | null | undefined
  await assert.rejects(
    submitToFormspree('https://formspree.io/f/test', new FormData(), {
      timeoutMs: 10,
      fetcher: async (_url, init) => {
        calls += 1
        signal = init?.signal
        return new Promise<Response>(() => {})
      },
    }),
    /timeout/,
  )
  assert.equal(calls, 1)
  assert.equal(signal?.aborted, true)
})

test('does not transmit data to unconfigured or unexpected endpoints', async () => {
  for (const url of [
    '',
    'https://formspree.io/f/REPLACE_ID',
    'https://example.com/f/test',
  ]) {
    await assert.rejects(submitToFormspree(url, new FormData()), /endpoint/)
  }
})

test('a provider server error is an unknown outcome, not confirmed non-delivery', async () => {
  await assert.rejects(
    submitToFormspree('https://formspree.io/f/test', new FormData(), {
      fetcher: async () => new Response('Unavailable', { status: 503 }),
    }),
    /outcome unknown/,
  )
})
