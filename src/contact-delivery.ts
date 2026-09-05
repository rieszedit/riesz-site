export type ContactKind = 'personal' | 'business'
export const contactEmail = 'rieszedit@gmail.com'
export const submissionTimeoutMs = 20_000

const fieldLabels: Record<string, string> = {
  name: '名前 / Name',
  email: 'メール / Email',
  company: '会社 / Company',
  company_url: '会社URL / Company URL',
  request_type: '依頼種別 / Request type',
  message: '相談内容 / Message',
  project_summary: '案件概要 / Project summary',
  budget: '予算（税別） / Budget before tax',
  delivery_date: '希望納期 / Delivery',
  preferred_plan: '希望プラン / Plan',
  client_reference_urls: 'お客様の参考映像 / Client references',
  riesz_reference_work: '選択したRiesz作品 / Selected Riesz work',
  riesz_reference_url: 'Riesz作品URL / Riesz work URL',
  submission_id: 'お問い合わせ番号 / Inquiry reference',
  release_date: '公開予定日 / Release date',
  song_length: '楽曲尺 / Song length',
  materials: '素材状況 / Materials',
  material_url: '素材URL / Material URL',
  illustration_status: 'イラスト状況 / Illustration status',
  final_illustration_date: '清書提出予定 / Final artwork date',
  rough_asset_start: 'ラフ先行 / Rough-art start',
  production_setup: '制作体制 / Production setup',
  portfolio_visibility: '実績掲載 / Portfolio visibility',
  project_file: 'プロジェクトファイル / Project files',
  usage_scope: '使用範囲 / Usage scope',
  media: '公開媒体 / Release media',
  references: '参考資料 / References',
  nda_contract: 'NDA・契約 / NDA and contract',
  payment_terms: '支払い条件 / Payment terms',
  collaborator_participation: '協力者参加 / Collaborator participation',
  collaborator_approval: '事前確認 / Prior confirmation',
  budget_basis: '予算の基準 / Budget basis',
}

export function createSubmissionId() {
  return `RID-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomUUID()}`
}

export function buildSubmission(
  source: FormData,
  kind: ContactKind,
  id: string,
) {
  const data = new FormData()
  for (const [key, value] of source.entries()) data.append(key, value)
  // Strip subject control characters without changing the submitted name field.
  const name = Array.from(String(data.get('name') ?? ''), (char) =>
    char.codePointAt(0)! < 32 || char.codePointAt(0) === 127 ? ' ' : char,
  )
    .join('')
    .trim()
    .slice(0, 60)
  const subject = `[Riesz ${kind === 'business' ? '法人' : '個人'}依頼] ${name} | ${id}`
  data.set('_subject', subject)
  data.set('submission_id', id)
  data.set('budget_basis', '税別 / Before tax')
  data.set(
    'collaborator_approval',
    '担当範囲と追加費用は見積もり時に明示確認 / Confirm scope and costs before commissioning',
  )
  const body = Array.from(data.entries())
    .filter(
      ([key, value]) =>
        !key.startsWith('_') &&
        key !== 'cf-turnstile-response' &&
        String(value).trim(),
    )
    .map(([key, value]) => `${fieldLabels[key] ?? key}: ${String(value)}`)
    .join('\n\n')
  return { id, subject, data, body }
}

export async function submitToFormspree(
  endpoint: string,
  data: FormData,
  {
    fetcher = fetch,
    timeoutMs = submissionTimeoutMs,
  }: { fetcher?: typeof fetch; timeoutMs?: number } = {},
) {
  if (
    !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9_-]+$/.test(endpoint) ||
    endpoint.includes('REPLACE')
  ) {
    throw new Error('Invalid Formspree endpoint')
  }
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error('Submission timeout'))
      controller.abort()
    }, timeoutMs)
  })
  try {
    await Promise.race([
      (async () => {
        const response = await fetcher(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data,
          signal: controller.signal,
        })
        if (response.status >= 500)
          throw new Error(`Submission outcome unknown: ${response.status}`)
        if (!response.ok)
          throw new Error(`Submission rejected: ${response.status}`)
        const result: unknown = await response.json()
        if (
          typeof result !== 'object' ||
          result === null ||
          !('ok' in result) ||
          result.ok !== true
        ) {
          throw new Error('Submission not accepted')
        }
      })(),
      timeout,
    ])
  } finally {
    clearTimeout(timer)
  }
}
