import type { LocalizedOption } from './form-options'

export const websiteTypeOptions: LocalizedOption[] = [
  { value: 'portfolio', ja: 'ポートフォリオ・活動サイト', en: 'Portfolio / Artist website' },
  { value: 'business-site', ja: '店舗・企業サイト', en: 'Store / Corporate website' },
  { value: 'landing-page', ja: 'LP（サービス・企画紹介ページ）', en: 'Landing page' },
  { value: 'redesign', ja: '既存サイトの改修・リニューアル', en: 'Website redesign / Improvements' },
  { value: 'undecided', ja: '相談して決めたい', en: 'Need advice' },
]

export const websiteUpdateOptions: LocalizedOption[] = [
  { value: 'self', ja: '自分で更新したい', en: 'I want to manage updates' },
  { value: 'request', ja: '更新も依頼したい', en: 'I want help with updates' },
  { value: 'rarely', ja: '頻繁な更新は予定していない', en: 'Infrequent updates expected' },
  { value: 'undecided', ja: '相談して決めたい', en: 'Need advice' },
]
