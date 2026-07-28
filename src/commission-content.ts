export type Lang = 'ja' | 'en'

export { corporateCollaboratorOptions } from './form-options.ts'

type PricingTierId = 'standard' | 'flagship'

export type PricingTier = {
  id: PricingTierId
  name: string
  priceJa: string
  priceEn: string
  summaryJa: string
  summaryEn: string
  productionJa: string
  productionEn: string
  lyricJa: string
  lyricEn: string
  developmentJa: string
  developmentEn: string
  bestForJa: string
  bestForEn: string
  representativeWork: {
    titleJa: string
    titleEn: string
    url: string
  }
}

export type PricingRoute = {
  id: 'main' | 'hybrid'
  name: string
  labelJa: string
  labelEn: string
  introJa: string
  introEn: string
  tiers: PricingTier[]
}

export type SupportPlan = {
  id: 'partner' | 'short-light'
  name: string
  priceJa: string
  priceEn: string
  leadJa: string
  leadEn: string
  descriptionJa: string
  descriptionEn: string
  bestForJa: string
  bestForEn: string
}

export const pricingRoutes: PricingRoute[] = [
  {
    id: 'main',
    name: 'Riesz Main',
    labelJa: 'Riesz本人が制作',
    labelEn: 'Riesz-led production',
    introJa:
      '映像・演出・デザイン・仕上げまでRiesz本人が担当します。全体をRieszの作風で一貫させたい依頼向けです。',
    introEn:
      'Riesz handles the movie, direction, design, and finishing. Choose this route when you want one consistent Riesz-led visual direction.',
    tiers: [
      {
        id: 'standard',
        name: 'Riesz Main Standard',
        priceJa: '150,000円〜',
        priceEn: 'From JPY 150,000',
        summaryJa:
          '支給素材を活かし、必要十分な画面設計・編集・デザインで一曲をまとめる標準規模です。',
        summaryEn:
          'A standard-scope MV built around the supplied materials with focused screen design, editing, and visual treatment.',
        productionJa: '映像・演出・デザイン・仕上げ：Riesz',
        productionEn: 'Movie, direction, design, and finishing: Riesz',
        lyricJa: 'Riesz',
        lyricEn: 'Riesz',
        developmentJa: '標準：楽曲の見せ場を絞って構成',
        developmentEn: 'Standard: focused development around the song highlights',
        bestForJa: '歌ってみたMV / 綺麗めMV / 通常規模のMV',
        bestForEn: 'Cover MVs / clean MVs / regular-scope MVs',
        representativeWork: {
          titleJa: '晩餐歌',
          titleEn: 'Bansanka',
          url: 'https://www.youtube.com/watch?v=_CK1kzr3myE',
        },
      },
      {
        id: 'flagship',
        name: 'Riesz Main Flagship',
        priceJa: '250,000円〜',
        priceEn: 'From JPY 250,000',
        summaryJa:
          'シーン展開、画面設計、演出密度、個別デザインを増やし、代表作として作り込む高密度規模です。',
        summaryEn:
          'A high-density production with deeper scene development, screen design, direction, and bespoke visual treatment.',
        productionJa: '映像・演出・デザイン・仕上げ：Riesz',
        productionEn: 'Movie, direction, design, and finishing: Riesz',
        lyricJa: 'Riesz',
        lyricEn: 'Riesz',
        developmentJa: '高：シーン展開・情報量・世界観設計を強化',
        developmentEn: 'High: expanded scenes, information density, and world-building',
        bestForJa: '重要な公開 / 大型企画 / 代表作にしたいMV',
        bestForEn: 'Major releases / large projects / representative works',
        representativeWork: {
          titleJa: 'アンノウン・マザーグース',
          titleEn: 'Unknown Mother Goose',
          url: 'https://www.youtube.com/watch?v=nRDHO45n3AM',
        },
      },
    ],
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    labelJa: 'Riesz + 協力クリエイター',
    labelEn: 'Riesz + specialist collaborator',
    introJa:
      'Rieszが映像・ディレクション・仕上げを担当し、得意分野を持つ協力クリエイターが、事前に合意したリリックデザイン等の工程に参加します。',
    introEn:
      'Riesz leads the movie, direction, and finishing while a trusted specialist joins an agreed area such as lyric design.',
    tiers: [
      {
        id: 'standard',
        name: 'Hybrid Standard',
        priceJa: '130,000円〜',
        priceEn: 'From JPY 130,000',
        summaryJa:
          'リリックデザイン等の一部工程を補強しながら、全体の制作規模を抑えた標準プランです。',
        summaryEn:
          'A standard hybrid plan that strengthens a focused area such as lyric design while keeping the overall scope controlled.',
        productionJa: '映像・ディレクション・仕上げ：Riesz',
        productionEn: 'Movie, direction, and finishing: Riesz',
        lyricJa: '協力クリエイター（一部工程）',
        lyricEn: 'Specialist collaborator for an agreed portion',
        developmentJa: '標準：必要な文字演出に重点',
        developmentEn: 'Standard: focused lyric and text treatment',
        bestForJa: '歌詞表現を強めたい通常規模のMV',
        bestForEn: 'Regular-scope MVs that need stronger lyric expression',
        representativeWork: {
          titleJa: 'スパークル',
          titleEn: 'Sparkle',
          url: 'https://www.youtube.com/watch?v=u5pwAfnnlKc',
        },
      },
      {
        id: 'flagship',
        name: 'Hybrid Flagship',
        priceJa: '270,000円〜',
        priceEn: 'From JPY 270,000',
        summaryJa:
          'リリックデザインを専門パートとして組み込み、映像と文字演出を高密度に設計するプランです。',
        summaryEn:
          'A high-density plan combining Riesz-led movie direction with specialist lyric design as a core production area.',
        productionJa: '映像・ディレクション・仕上げ：Riesz',
        productionEn: 'Movie, direction, and finishing: Riesz',
        lyricJa: '協力クリエイター（リリックデザイン担当）',
        lyricEn: 'Specialist collaborator leading lyric design',
        developmentJa: '高：文字演出と映像を一体で高密度に設計',
        developmentEn: 'High: dense, integrated movie and lyric-direction development',
        bestForJa: 'リリック重視 / 文字量の多い楽曲 / 重要な公開',
        bestForEn: 'Lyric-focused work / text-heavy songs / major releases',
        representativeWork: {
          titleJa: 'あいしていたのに',
          titleEn: 'Aishite Ita Noni',
          url: 'https://www.youtube.com/watch?v=QWItOSj0bEU',
        },
      },
    ],
  },
]

export const supportPlans: SupportPlan[] = [
  {
    id: 'partner',
    name: 'Partner Plan',
    priceJa: '50,000円〜',
    priceEn: 'From JPY 50,000',
    leadJa: '協力クリエイター主体 / Rieszがディレクション・品質確認',
    leadEn: 'Collaborator-led / directed and reviewed by Riesz',
    descriptionJa:
      'Riesz本人メインの制作ではありません。担当範囲と制作体制を事前に共有し、合意後に進行します。',
    descriptionEn:
      'This is not primarily produced by Riesz. Production ownership and responsibilities are disclosed and agreed before work begins.',
    bestForJa: '予算を抑えたい依頼 / 短納期の相談',
    bestForEn: 'Budget-focused requests / faster timeline discussions',
  },
  {
    id: 'short-light',
    name: 'Short / Light Plan',
    priceJa: '50,000円〜100,000円目安',
    priceEn: 'Around JPY 50,000-100,000',
    leadJa: '内容に応じて個別に決定',
    leadEn: 'Production setup decided by scope',
    descriptionJa:
      'Shorts、ティザー、部分制作、簡易編集など、フル尺MV以外の軽量な制作向けです。',
    descriptionEn:
      'For shorts, teasers, partial production, simpler edits, and other work outside a full-length MV.',
    bestForJa: '短尺映像 / 告知映像 / 一部工程のみの依頼',
    bestForEn: 'Short videos / announcements / partial-production requests',
  },
]

export const corporateCollaboratorHelper = {
  ja: '参加する場合は担当範囲を開示し、クライアントの事前承認と必要なNDA締結後に進行します。',
  en: 'When a collaborator joins, their scope is disclosed in advance and work begins only after prior approval from the client and any required NDA.',
}

export const notesJa = [
  '表示価格は税別です。',
  '個人のお客様は全額前払いです。入金確認後にスケジュールを確保します。',
  '事前に合意した構成・方向性の範囲内における軽微な修正は、回数上限を設けず対応します。',
  '構成変更、演出方針の変更、素材の大幅な差し替え、追加制作、納品後修正は別途お見積もりとなります。',
  '4分以上の楽曲、短納期、特殊な素材対応は内容に応じて別途お見積もりとなります。',
  '実績非公開をご希望の場合は +100,000円〜 となります。',
  'プロジェクトファイル納品をご希望の場合は +200,000円〜 となります。',
  'プロジェクトファイルを納品した場合、クライアント様の責任範囲において編集・改変・関係者への共有・二次配布が可能です。',
  '使用素材・フォント・プラグイン等のライセンスにより、一部データの納品・再配布・商用利用が制限される場合があります。',
  'お客様都合による制作開始後のキャンセルは、原則として返金できません。当方都合により制作継続が困難となった場合は、全額返金いたします。',
]

export const notesEn = [
  'Prices are listed before tax.',
  'Individual commissions require full advance payment. The production schedule is reserved after payment is confirmed.',
  'Minor revisions within the structure and direction agreed before production are handled without a fixed round limit.',
  'Structural changes, direction changes, major asset replacements, additional production, and post-delivery revisions require an additional estimate.',
  'Songs longer than four minutes, rush timelines, and special material handling may require an additional estimate.',
  'Private / non-public portfolio use starts from an additional JPY 100,000.',
  'Project file delivery starts from an additional JPY 200,000.',
  'When project files are delivered, the client may edit, modify, share with relevant parties, and redistribute them within the client responsibility scope.',
  'Some assets, fonts, plugins, or third-party materials may limit delivery scope, redistribution, or commercial use.',
  'Client-side cancellation after production begins is generally non-refundable. If production cannot continue due to Riesz-side circumstances, a full refund will be issued.',
]
