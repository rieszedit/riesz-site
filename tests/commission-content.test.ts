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

test('keeps Partner and Short Light outside the Main and Hybrid comparison', () => {
  assert.deepEqual(
    supportPlans.map((plan) => plan.id),
    ['partner', 'short-light'],
  )
})

test('offers explicit corporate consent levels for collaborator participation', () => {
  assert.equal(corporateCollaboratorOptions.ja.length, 4)
  assert.equal(corporateCollaboratorOptions.en.length, 4)
  assert.equal(corporateCollaboratorOptions.ja[1], '一部工程のみ参加可（Hybrid）')
  assert.equal(
    corporateCollaboratorOptions.ja[2],
    '協力クリエイター主体も相談可（Partner）',
  )
  assert.equal(corporateCollaboratorOptions.en[1], 'Limited participation allowed (Hybrid)')
  assert.match(corporateCollaboratorOptions.en[2], /partner-led/i)
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
