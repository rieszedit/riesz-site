export type WorkItem = {
  title: string
  titleEn: string
  client: string
  clientEn: string
  role: string
  tags: string[]
  url: string
  image: string
  businessFeatured?: boolean
  compactTitle?: boolean
  noteJa?: string
  noteEn?: string
}

export const works: WorkItem[] = [
  {
    title: '神っぽいな',
    titleEn: 'God-ish',
    client: 'プロジェクトセカイ',
    clientEn: 'Project SEKAI',
    role: 'Movie / Lyric Video',
    tags: ['Flagship', 'Major IP'],
    url: 'https://www.youtube.com/watch?v=vIHCFGj_G2E',
    image: 'https://i.ytimg.com/vi/vIHCFGj_G2E/maxresdefault.jpg',
    businessFeatured: true,
  },
  {
    title: 'メクルメ',
    titleEn: 'Mekurume',
    client: 'アイドルマスター',
    clientEn: 'THE IDOLM@STER',
    role: 'Lyric Video / Direction',
    tags: ['Flagship', 'Major IP'],
    url: 'https://www.youtube.com/watch?v=DLkNQgh4Ons',
    image: 'https://i.ytimg.com/vi/DLkNQgh4Ons/maxresdefault.jpg',
    businessFeatured: true,
  },
  {
    title: '紡ぐ時間',
    titleEn: 'Tsumugu Jikan',
    client: 'ブルーアーカイブ',
    clientEn: 'Blue Archive',
    role: 'Movie / Direction: Riesz',
    tags: ['Hybrid Flagship', 'Corporate'],
    url: 'https://www.youtube.com/watch?v=Qdz7nMfg1L8',
    image: 'https://i.ytimg.com/vi/Qdz7nMfg1L8/maxresdefault.jpg',
    businessFeatured: true,
    noteJa: 'Lyric Design: Collaborator',
    noteEn: 'Lyric Design: Collaborator',
  },
  {
    title: 'あいしていたのに',
    titleEn: 'Aishite Ita Noni',
    client: '叶 / Kanae Channel',
    clientEn: 'Kanae Channel',
    role: 'Movie: Riesz',
    tags: ['Hybrid Flagship', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=QWItOSj0bEU',
    image: 'https://i.ytimg.com/vi/QWItOSj0bEU/maxresdefault.jpg',
    noteJa: 'Lyric Design: ななし',
    noteEn: 'Lyric Design: Nanashi',
  },
  {
    title: 'アンノウン・マザーグース',
    titleEn: 'Unknown Mother Goose',
    client: '涼海ネモ / ななしいんく',
    clientEn: 'Nemo Channel / 774inc.',
    role: 'Movie / Direction / Design',
    tags: ['Flagship', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=nRDHO45n3AM',
    image: 'https://i.ytimg.com/vi/nRDHO45n3AM/maxresdefault.jpg',
    compactTitle: true,
  },
  {
    title: 'Snow halation',
    titleEn: 'Snow halation',
    client: 'ミリプロ',
    clientEn: 'MillionProduction',
    role: 'Movie / Direction / Design',
    tags: ['Flagship', 'Group Cover'],
    url: 'https://youtu.be/yynYqcLJYPk',
    image: 'https://i.ytimg.com/vi/yynYqcLJYPk/maxresdefault.jpg',
  },
  {
    title: '晩餐歌',
    titleEn: 'Bansanka',
    client: '涼海ネモ / ななしいんく',
    clientEn: 'Nemo Channel / 774inc.',
    role: 'Movie / Direction / Design',
    tags: ['Standard', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=_CK1kzr3myE',
    image: 'https://i.ytimg.com/vi/_CK1kzr3myE/maxresdefault.jpg',
  },
  {
    title: '藍悼花',
    titleEn: 'Aitoka',
    client: '涼海ネモ / ななしいんく',
    clientEn: 'Nemo Channel / 774inc.',
    role: 'Movie / Direction / Design',
    tags: ['Standard', 'Clean MV'],
    url: 'https://www.youtube.com/watch?v=0dmBEUg7jh0',
    image: 'https://i.ytimg.com/vi/0dmBEUg7jh0/maxresdefault.jpg',
  },
  {
    title: 'flos',
    titleEn: 'flos',
    client: '涼海ネモ / ななしいんく',
    clientEn: 'Nemo Channel / 774inc.',
    role: 'Movie / Direction / Design',
    tags: ['Flagship', 'Ballad'],
    url: 'https://www.youtube.com/watch?v=Zm3ftyIGBqo',
    image: 'https://i.ytimg.com/vi/Zm3ftyIGBqo/maxresdefault.jpg',
  },
  {
    title: 'シネマ',
    titleEn: 'Cinema',
    client: '天道 サン & 一 月一',
    clientEn: 'Tendo Sun & Ninomae Tsukihi',
    role: 'Movie / Direction / Design',
    tags: ['Standard', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=_5w5Rfwn6jc',
    image: 'https://i.ytimg.com/vi/_5w5Rfwn6jc/sddefault.jpg',
  },
  {
    title: 'スパークル',
    titleEn: 'Sparkle',
    client: 'カグラナナ',
    clientEn: 'Kagura Nana',
    role: 'Movie / Direction: Riesz',
    tags: ['Hybrid Standard', 'Cover MV'],
    url: 'https://www.youtube.com/watch?v=u5pwAfnnlKc',
    image: 'https://i.ytimg.com/vi/u5pwAfnnlKc/maxresdefault.jpg',
    noteJa: 'Lyric Design: ななし',
    noteEn: 'Lyric Design: Nanashi',
  },
]

export const businessWorks = works.filter((work) => work.businessFeatured)
