import assert from 'node:assert/strict'
import test from 'node:test'

import {
  corporateCollaboratorHelper,
  corporateCollaboratorOptions,
  notesEn,
  notesJa,
  pricingRoutes,
  supportPlans,
} from '../src/commission-content.ts'

test('groups Riesz Main and Hybrid into Standard and Flagship tiers', () => {
  assert.deepEqual(
    pricingRoutes.map((route) => route.id),
    ['main', 'hybrid'],
  )

  for (const route of pricingRoutes) {
    assert.deepEqual(
      route.tiers.map((tier) => tier.id),
      ['standard', 'flagship'],
    )

    for (const tier of route.tiers) {
      assert.match(tier.representativeWork.url, /^https:\/\/(www\.)?youtube\.com\//)
      assert.notEqual(tier.representativeWork.titleJa.trim(), '')
      assert.notEqual(tier.representativeWork.titleEn.trim(), '')
    }
  }
})

test('prices Hybrid Flagship from JPY 270,000 in both languages', () => {
  const hybridFlagship = pricingRoutes
    .find((route) => route.id === 'hybrid')
    ?.tiers.find((tier) => tier.id === 'flagship')

  assert.equal(hybridFlagship?.priceJa, '270,000円〜')
  assert.equal(hybridFlagship?.priceEn, 'From JPY 270,000')
})

test('positions Hybrid Standard as specialist lyric quality reinforcement from JPY 170,000', () => {
  const hybridRoute = pricingRoutes.find((route) => route.id === 'hybrid')
  const hybridStandard = hybridRoute?.tiers.find((tier) => tier.id === 'standard')

  assert.equal(hybridStandard?.priceJa, '170,000円〜')
  assert.equal(hybridStandard?.priceEn, 'From JPY 170,000')
  assert.match(hybridRoute?.introJa ?? '', /専門分業/)
  assert.match(hybridRoute?.introJa ?? '', /文字演出の完成度/)
  assert.match(hybridStandard?.summaryJa ?? '', /リリックデザイン/)
  assert.match(hybridStandard?.summaryJa ?? '', /完成度を高める/)
  assert.doesNotMatch(hybridStandard?.summaryJa ?? '', /制作規模を抑え/)
  assert.match(hybridRoute?.introEn ?? '', /division of expertise/i)
  assert.match(hybridStandard?.summaryEn ?? '', /specialist/i)
  assert.match(hybridStandard?.summaryEn ?? '', /quality/i)
  assert.doesNotMatch(hybridStandard?.summaryEn ?? '', /scope controlled/i)
})

test('keeps Partner and Short Light outside the Main and Hybrid comparison', () => {
  assert.deepEqual(
    supportPlans.map((plan) => plan.id),
    ['partner', 'short-light'],
  )
})

test('offers explicit corporate consent levels for collaborator participation', () => {
  assert.equal(corporateCollaboratorOptions.length, 4)
  assert.equal(
    corporateCollaboratorOptions[1].value,
    '一部工程のみ参加可（Hybrid）',
  )
  assert.equal(
    corporateCollaboratorOptions[2].value,
    '協力クリエイター主体も相談可（Partner）',
  )
  assert.equal(
    corporateCollaboratorOptions[1].en,
    'Limited participation allowed (Hybrid)',
  )
  assert.match(corporateCollaboratorOptions[2].en, /partner-led/i)
  assert.match(corporateCollaboratorHelper.ja, /担当範囲/)
  assert.match(corporateCollaboratorHelper.ja, /事前承認/)
  assert.match(corporateCollaboratorHelper.ja, /NDA/)
  assert.match(corporateCollaboratorHelper.en, /prior approval/i)
})

test('defines unlimited minor revisions only inside the agreed direction', () => {
  const japanesePolicy = notesJa.join('\n')
  const englishPolicy = notesEn.join('\n')

  assert.doesNotMatch(japanesePolicy, /常識の範囲内/)
  assert.match(japanesePolicy, /事前に合意した構成・方向性/)
  assert.match(japanesePolicy, /回数上限を設けず/)
  assert.match(japanesePolicy, /素材の大幅な差し替え/)
  assert.match(englishPolicy, /without a fixed round limit/i)
  assert.match(englishPolicy, /major asset replacements/i)
})
