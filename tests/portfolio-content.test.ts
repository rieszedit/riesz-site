import assert from 'node:assert/strict'
import test from 'node:test'

import { businessWorks, works } from '../src/portfolio-content.ts'

test('keeps the complete public portfolio in its existing order', () => {
  assert.equal(works.length, 12)
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
    ],
  )
})
