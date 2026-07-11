import assert from 'node:assert/strict'
import test from 'node:test'

import {
  allLocalizedOptionSets,
  budgetOptions,
  materialOptions,
  personalRequestTypeOptions,
  personalSetupOptions,
} from '../src/form-options.ts'

test('translated form choices keep stable submitted values', () => {
  assert.deepEqual(personalRequestTypeOptions[1], {
    value: '歌ってみたMV',
    ja: '歌ってみたMV',
    en: 'Cover MV',
  })
  assert.equal(budgetOptions.at(-2)?.value, '25万円以上')
  assert.equal(materialOptions[0].value, '音源あり')
  assert.equal(personalSetupOptions[1].value, '一部協力クリエイター参加可')
})

test('every localized option has a unique non-empty value and both labels', () => {
  for (const options of allLocalizedOptionSets) {
    assert.equal(new Set(options.map((option) => option.value)).size, options.length)

    for (const option of options) {
      assert.ok(option.value)
      assert.ok(option.ja)
      assert.ok(option.en)
    }
  }
})
