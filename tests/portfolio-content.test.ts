import assert from 'node:assert/strict'
import test from 'node:test'

import { businessWorks, works } from '../src/portfolio-content.ts'

test('keeps the complete public portfolio in its existing order', () => {
  assert.equal(works.length, 15)
  assert.deepEqual(works.slice(0, 3).map((work) => work.title), [
    '神っぽいな',
    'メクルメ',
    '紡ぐ時間',
  ])
})

test('includes Kurumi Noah Unknown Mother Goose as Riesz Main Standard', () => {
  const work = works.find((item) => item.url.endsWith('MaOT-hgSO18'))

  assert.deepEqual(work, {
    title: 'アンノウン・マザーグース',
    titleEn: 'Unknown Mother Goose',
    client: '胡桃のあ / ぶいすぽっ！',
    clientEn: 'Kurumi Noah / VSPO!',
    role: 'Movie: Riesz',
    tags: ['Standard', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=MaOT-hgSO18',
    image: 'https://i.ytimg.com/vi/MaOT-hgSO18/maxresdefault.jpg',
    compactTitle: true,
  })
})

test('includes World Lampshade as Riesz Main Standard', () => {
  const work = works.find((item) => item.url.endsWith('dkfixC4fq-w'))

  assert.deepEqual(work, {
    title: 'ワールド・ランプシェード',
    titleEn: 'World Lampshade',
    client: '眠雲ツクリ',
    clientEn: 'Nemukumo Tsukuri',
    role: 'Movie: Riesz',
    tags: ['Standard', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=dkfixC4fq-w',
    image: 'https://i.ytimg.com/vi/dkfixC4fq-w/maxresdefault.jpg',
    compactTitle: true,
  })
})

test('preserves distinct public credits for the new Hybrid Flagship works', () => {
  const capsule = works.find((item) => item.url.endsWith('vwzQcLr_fQ8'))
  const romeo = works.find((item) => item.url.endsWith('HD3v90A3ldg'))

  assert.ok(capsule)
  assert.ok(romeo)
  for (const work of [capsule, romeo]) {
    assert.deepEqual(work.tags, ['Hybrid Flagship', 'Major IP'])
    assert.equal(work.businessFeatured, true)
  }
  assert.equal(capsule.role, 'Movie / Direction: Riesz')
  assert.equal(capsule.noteJa, 'Lyric Motion: con')
  assert.equal(capsule.noteEn, 'Lyric Motion: con')
  assert.equal(romeo.role, 'Movie: Riesz')
  assert.equal(romeo.noteJa, 'Lyric Design: ななし / Direction: s!on')
  assert.equal(romeo.noteEn, 'Lyric Design: Nanashi / Direction: s!on')
})

test('selects exactly the approved public corporate works', () => {
  assert.deepEqual(
    businessWorks.map((work) => ({
      title: work.title,
      clientEn: work.clientEn,
      role: work.role,
      url: work.url,
    })),
    [
      {
        title: '神っぽいな',
        clientEn: 'Project SEKAI',
        role: 'Movie / Lyric Video',
        url: 'https://www.youtube.com/watch?v=vIHCFGj_G2E',
      },
      {
        title: 'メクルメ',
        clientEn: 'THE IDOLM@STER',
        role: 'Lyric Video / Direction',
        url: 'https://www.youtube.com/watch?v=DLkNQgh4Ons',
      },
      {
        title: '紡ぐ時間',
        clientEn: 'Blue Archive',
        role: 'Movie / Direction: Riesz',
        url: 'https://www.youtube.com/watch?v=Qdz7nMfg1L8',
      },
      {
        title: '星屑カプセル',
        clientEn: "Ninomae Ina'nis / hololive Dreams",
        role: 'Movie / Direction: Riesz',
        url: 'https://www.youtube.com/watch?v=vwzQcLr_fQ8',
      },
      {
        title: 'ロミオとシンデレラ',
        clientEn: 'Shizuku Hinomori / Project SEKAI',
        role: 'Movie: Riesz',
        url: 'https://www.youtube.com/watch?v=HD3v90A3ldg',
      },
    ],
  )
})
