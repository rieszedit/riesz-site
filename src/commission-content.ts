export type Lang = 'ja' | 'en'

export { corporateCollaboratorOptions } from './form-options.ts'

type PricingTierId = 'standard' | 'flagship'

export type PricingTier = {
  id: PricingTierId
  name: string
  priceJa: string
  priceEn: string
  priceWithTax: number
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
  taxJa: string
  taxEn: string
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
        priceWithTax: 165000,
        summaryJa:
          '支給素材を活かし、必要十分な画面設計・編集・デザインで一曲をまとめる標準規模です。',
        summaryEn:
          'A standard-scope MV built around the supplied materials with focused screen design, editing, and visual treatment.',
        productionJa: '映像・演出・デザイン・仕上げ：Riesz',
        productionEn: 'Movie, direction, design, and finishing: Riesz',
        lyricJa: 'Riesz',
        lyricEn: 'Riesz',
        developmentJa: '標準：楽曲の見せ場を絞って構成',
        developmentEn:
          'Standard: focused development around the song highlights',
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
        priceWithTax: 275000,
        summaryJa:
          'シーン展開、画面設計、演出密度、個別デザインを増やし、代表作として作り込む高密度規模です。',
        summaryEn:
          'A high-density production with deeper scene development, screen design, direction, and bespoke visual treatment.',
        productionJa: '映像・演出・デザイン・仕上げ：Riesz',
        productionEn: 'Movie, direction, design, and finishing: Riesz',
        lyricJa: 'Riesz',
        lyricEn: 'Riesz',
        developmentJa: '高：シーン展開・情報量・世界観設計を強化',
        developmentEn:
          'High: expanded scenes, information density, and world-building',
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
      'Rieszが映像・ディレクション・仕上げを担当し、リリックデザインを得意とする協力クリエイターが、事前に合意した文字演出を担当します。専門分業により、Rieszの映像表現を保ちながらリリック・文字演出の完成度を高めます。',
    introEn:
      'Riesz leads the movie, direction, and finishing, while a trusted lyric-design specialist handles the agreed text direction. This division of expertise preserves Riesz’s visual direction while elevating the quality of lyric and text expression.',
    tiers: [
      {
        id: 'standard',
        name: 'Hybrid Standard',
        priceJa: '170,000円〜',
        priceEn: 'From JPY 170,000',
        priceWithTax: 187000,
        summaryJa:
          'Rieszが映像全体を制作し、協力クリエイターがリリックデザインを補強することで、文字演出の完成度を高める標準プランです。',
        summaryEn:
          'A standard hybrid plan in which Riesz creates the overall movie and a specialist strengthens lyric design to elevate the quality of text expression.',
        productionJa: '映像・ディレクション・仕上げ：Riesz',
        productionEn: 'Movie, direction, and finishing: Riesz',
        lyricJa: '協力クリエイター（リリックデザイン担当）',
        lyricEn: 'Specialist collaborator leading lyric design',
        developmentJa: '標準：リリックデザイン・文字演出を専門的に強化',
        developmentEn:
          'Standard: specialist-led lyric design and text treatment',
        bestForJa: '歌詞表現の完成度を高めたい通常規模のMV',
        bestForEn: 'Regular-scope MVs that need elevated lyric expression',
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
        priceWithTax: 297000,
        summaryJa:
          'リリックデザインを専門パートとして組み込み、映像と文字演出を高密度に設計するプランです。',
        summaryEn:
          'A high-density plan combining Riesz-led movie direction with specialist lyric design as a core production area.',
        productionJa: '映像・ディレクション・仕上げ：Riesz',
        productionEn: 'Movie, direction, and finishing: Riesz',
        lyricJa: '協力クリエイター（リリックデザイン担当）',
        lyricEn: 'Specialist collaborator leading lyric design',
        developmentJa: '高：文字演出と映像を一体で高密度に設計',
        developmentEn:
          'High: dense, integrated movie and lyric-direction development',
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
    taxJa: '税込55,000円〜',
    taxEn: 'JPY 55,000+ incl. tax',
    leadJa: '協力クリエイター主体 / Rieszがディレクション・品質確認',
    leadEn: 'Collaborator-led / directed and reviewed by Riesz',
    descriptionJa:
      '協力クリエイターの作風を活かし、Rieszがディレクションと品質確認を担当します。Riesz本人メインの制作ではありません。担当者・範囲を事前に共有し、合意後に進行します。クレジットは映像を担当クリエイター、ディレクションをRieszとします。',
    descriptionEn:
      'The collaborator brings their own visual style while Riesz directs and reviews quality. This is not primarily produced by Riesz. The creator and responsibilities are agreed before work begins. Credits name the collaborator for Movie and Riesz for Direction.',
    bestForJa: '予算を抑えたい依頼 / 短納期の相談',
    bestForEn: 'Budget-focused requests / faster timeline discussions',
  },
  {
    id: 'short-light',
    name: 'Short / Light Plan',
    priceJa: '50,000円〜100,000円目安',
    priceEn: 'Around JPY 50,000-100,000',
    taxJa: '税込55,000〜110,000円目安',
    taxEn: 'Around JPY 55,000-110,000 incl. tax',
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
  '表示価格は税別です。税込目安（消費税10%）を併記しています。個人向けの参考料金であり、内容・使用範囲を確認後に正式なお見積もりをご案内します。法人案件は個別見積もりです。',
  '個人のお客様は全額前払いです。入金確認後にスケジュールを確保します。',
  '事前に合意した構成・方向性の範囲内における軽微な修正は、回数上限を設けず対応します。',
  '構成変更、演出方針の変更、素材の大幅な差し替え、追加制作、納品後修正は別途お見積もりとなります。',
  '当方の制作ミスや合意仕様との不一致の修正は、納品後も追加料金の対象にしません。確認期間・修正受付の進め方はお見積もり時に合意します。追加費用が必要な変更は、金額と納期をご案内し、承認後に着手します。',
  '本制作は、清書イラストおよび必要素材の受領・確認後に開始します。清書前は、構成・演出設計・歌詞タイミング・簡易アニマティクスまで進行可能です。',
  'ラフイラストの段階からレイアウト・モーション・合成を進める場合は、ラフ素材先行進行として +30,000円〜（税別／税込33,000円〜）となります。同一構図・同一サイズ・同一ポーズ・同等のレイヤー構成での清書差し替え1回を含みます。',
  '構図、ポーズ、表情、トリミング、レイヤー構成などが変更される場合は、作業量に応じて追加料金と納期調整が発生します。必要素材の提出が予定日より遅れた場合、納期および制作枠を再調整します。',
  '4分以上の楽曲、短納期、特殊な素材対応は内容に応じて別途お見積もりとなります。',
  '実績非公開をご希望の場合は +100,000円〜（税込110,000円〜）となります。実績掲載の媒体・公開時期・クレジットは事前に確認し、公開前や許可のない掲載は行いません。NDAの有無とは別に、非公開範囲を合意します。',
  'プロジェクトファイル納品をご希望の場合は +200,000円〜（税込220,000円〜）となります。',
  'プロジェクトファイルを納品した場合、クライアント様の責任範囲において編集・改変・関係者への共有・二次配布が可能です。',
  '使用素材・フォント・プラグイン等のライセンスにより、一部データの納品・再配布・商用利用が制限される場合があります。除外データや必要なライセンスは見積もり時に確認します。プロジェクトファイル納品と著作権譲渡は別条件であり、使用範囲・権利条件は事前に合意します。',
  'お客様都合のキャンセルは、着手前で費用が発生していなければ全額返金します。着手後は実施済み作業と事前合意した取消不能な外注等の費用を精算し、未使用分を返金します。構成・演出設計等も作業に含み、進行範囲は事前に確認します。当方都合により制作継続が困難となった場合は、全額返金いたします。',
]

export const notesEn = [
  'Prices are listed before tax, alongside totals including 10% Japanese consumption tax. These are indicative individual-commission prices; the final quote depends on scope and usage. Business projects receive a separate quote.',
  'Individual commissions require full advance payment. The production schedule is reserved after payment is confirmed.',
  'Minor revisions within the structure and direction agreed before production are handled without a fixed round limit.',
  'Structural changes, direction changes, major asset replacements, additional production, and post-delivery revisions require an additional estimate.',
  'Corrections of our production errors or deviations from agreed specifications are not charged extra, including after delivery. Review periods and the revision process are agreed in the quote. Paid changes begin only after approval of the added cost and revised schedule.',
  'Final production begins after the final illustrations and other required materials have been received and reviewed. Before then, planning, direction design, lyric timing, and a simple animatic may proceed.',
  'Starting layout, animation, and compositing from rough artwork is available from an additional JPY 30,000 before tax (JPY 33,000 including tax). This includes one replacement with final artwork that retains the same composition, dimensions, pose, and equivalent layer structure.',
  'Changes to the composition, pose, expression, crop, or layer structure may require an additional estimate and schedule adjustment. If required materials are delivered later than agreed, the production schedule and delivery date will be rescheduled.',
  'Songs four minutes or longer, rush timelines, and special material handling may require an additional estimate.',
  'Private / non-public portfolio use starts from an additional JPY 100,000 (JPY 110,000 including tax). Portfolio media, timing, and credits are agreed in advance; work is never posted before release or without permission. Confidentiality scope is agreed separately from whether an NDA is required.',
  'Project file delivery starts from an additional JPY 200,000 (JPY 220,000 including tax).',
  'When project files are delivered, the client may edit, modify, share with relevant parties, and redistribute them within the client responsibility scope.',
  'Some assets, fonts, plugins, or third-party materials may limit delivery scope, redistribution, or commercial use. Excluded files and required licenses are confirmed in the quote. Project-file delivery is separate from copyright transfer; usage and rights are agreed in advance.',
  'For client cancellation before any work or costs have been incurred, payment is refunded in full. After work begins, completed work and previously agreed non-cancellable external costs are settled and the unused balance refunded. Planning and direction design count as work; the scope is confirmed in advance. If production cannot continue due to Riesz-side circumstances, a full refund will be issued.',
]
