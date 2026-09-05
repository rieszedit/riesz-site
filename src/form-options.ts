export type LocalizedOption = {
  value: string
  ja: string
  en: string
}

const option = (value: string, en: string): LocalizedOption => ({
  value,
  ja: value,
  en,
})

export const personalRequestTypeOptions = [
  option('オリジナルMV', 'Original MV'),
  option('歌ってみたMV', 'Cover MV'),
  option('Shorts / 短尺動画', 'Shorts / Short video'),
  option('Lyric Video', 'Lyric Video'),
  option('その他', 'Other'),
]

export const preferredPlanOptions = [
  option('Riesz Main Standard', 'Riesz Main Standard'),
  option('Riesz Main Flagship', 'Riesz Main Flagship'),
  option('Hybrid Standard', 'Hybrid Standard'),
  option('Hybrid Flagship', 'Hybrid Flagship'),
  option('Partner Plan', 'Partner Plan'),
  option('Short / Light', 'Short / Light'),
  option('相談して決めたい', 'Need advice'),
]

export const budgetOptions = [
  option('5万円〜10万円', 'JPY 50,000-100,000'),
  option('10万円〜15万円', 'JPY 100,000-150,000'),
  option('15万円〜20万円', 'JPY 150,000-200,000'),
  option('20万円〜25万円', 'JPY 200,000-250,000'),
  option('25万円以上', 'JPY 250,000+'),
  option('相談したい', 'Need advice'),
]

export const songLengthOptions = [
  option('1分未満', 'Under 1 minute'),
  option('1分以上2分未満', '1 to under 2 minutes'),
  option('2分以上3分未満', '2 to under 3 minutes'),
  option('3分以上4分未満', '3 to under 4 minutes'),
  option('4分以上', '4 minutes or longer'),
  option('未定', 'TBD'),
]

export const materialOptions = [
  option('音源あり', 'Audio ready'),
  option('歌詞あり', 'Lyrics ready'),
  option('イラストあり', 'Illustration ready'),
  option('イラスト差分あり', 'Illustration variations ready'),
  option('ロゴあり', 'Logo ready'),
  option('背景素材あり', 'Background ready'),
  option('まだ未定', 'TBD'),
]

export const illustrationStatusOptions = [
  option('清書済み', 'Final artwork ready'),
  option('ラフ段階', 'Rough artwork'),
  option('制作中', 'Final artwork in progress'),
  option('未定', 'TBD'),
  option('イラストなし / 対象外', 'No illustration / Not applicable'),
]

export const roughAssetStartOptions = [
  option(
    '清書受領後に本制作（推奨）',
    'Start final production after final artwork (Recommended)',
  ),
  option(
    'ラフ素材から先行を希望（+30,000円〜）',
    'Start from rough artwork (+JPY 30,000+)',
  ),
  option('相談して決めたい', 'Need advice'),
  option('対象外', 'Not applicable'),
]

export const personalSetupOptions = [
  option('Riesz本人メインの制作を希望', 'Riesz-led production preferred'),
  option('一部協力クリエイター参加可', 'Collaborator support is acceptable'),
  option('Partner Planも相談可', 'Partner Plan is acceptable'),
  option('内容を見て相談したい', 'Need advice after review'),
]

export const personalPortfolioOptions = [
  option('掲載可', 'Allowed'),
  option('公開後なら掲載可', 'Allowed after release'),
  option('掲載不可（+100,000円〜）', 'Private (+JPY 100,000+)'),
  option('相談したい', 'Need to discuss'),
]

export const businessPortfolioOptions = [
  option('掲載可', 'Allowed'),
  option('公開後なら掲載可', 'Allowed after release'),
  option('掲載不可', 'Private'),
  option('相談したい', 'Need to discuss'),
]

export const projectFileOptions = [
  option('希望しない', 'Not needed'),
  option('希望する（+200,000円〜）', 'Requested (+JPY 200,000+)'),
  option('相談したい', 'Need to discuss'),
]

export const businessProjectFileOptions = [
  option('希望しない', 'Not needed'),
  option('希望する（個別見積もり）', 'Requested (custom quote)'),
  option('相談したい', 'Need to discuss'),
]

export const ndaOptions = [
  option('あり', 'Required'),
  option('なし', 'Not required'),
  option('相談したい', 'Need to discuss'),
]

export const corporateCollaboratorOptions = [
  option('Riesz本人メインの制作を希望', 'Riesz-led production preferred'),
  option(
    '一部工程のみ参加可（Hybrid）',
    'Limited participation allowed (Hybrid)',
  ),
  option(
    '協力クリエイター主体も相談可（Partner）',
    'Partner-led production may be discussed',
  ),
  option('案件内容を見て相談したい', 'Decide after reviewing the project'),
]

export const allLocalizedOptionSets: LocalizedOption[][] = [
  personalRequestTypeOptions,
  preferredPlanOptions,
  budgetOptions,
  songLengthOptions,
  materialOptions,
  illustrationStatusOptions,
  roughAssetStartOptions,
  personalSetupOptions,
  personalPortfolioOptions,
  businessPortfolioOptions,
  projectFileOptions,
  ndaOptions,
  corporateCollaboratorOptions,
]
