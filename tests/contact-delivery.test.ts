import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSubmission, submitToFormspree } from '../src/contact-delivery.ts'

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

test('website inquiries keep Gmail routing prefixes and useful fallback labels', () => {
  for (const kind of ['personal', 'business'] as const) {
    const data = new FormData()
    data.set('name', 'Client')
    data.set('service_category', 'website')
    data.set('website_type', 'portfolio')
    data.set('website_reference_urls', 'https://example.com/')
    data.set('website_updates', 'self')
    data.set('cf-turnstile-response', 'private-token')
    const result = buildSubmission(data, kind, 'RID-web')
    assert.equal(result.subject, `[Riesz ${kind === 'business' ? '法人' : '個人'}依頼] Webサイト制作 | Client | RID-web`)
    assert.match(result.body, /参考サイト \/ Reference websites: https:\/\/example\.com\//)
    assert.match(result.body, /公開後の更新 \/ Updates after launch: self/)
    assert.doesNotMatch(result.body, /private-token/)
    assert.equal(result.data.get('service_category'), 'website')
  }
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
