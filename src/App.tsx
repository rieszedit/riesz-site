import {
  ArrowUpRight,
  Building2,
  Check,
  Languages,
  Mail,
  Play,
  Send,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import './App.css'

type Lang = 'ja' | 'en'
type Page = 'personal' | 'business'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

const contactEmail = 'rieszedit@gmail.com'
const xUrl = 'https://x.com/Riesz_edit'
const boothUrl = 'https://rieszedit.booth.pm/'

const formEndpoints = {
  personal:
    import.meta.env.VITE_FORMSPREE_PERSONAL_ENDPOINT ??
    'https://formspree.io/f/REPLACE_PERSONAL_ID',
  business:
    import.meta.env.VITE_FORMSPREE_BUSINESS_ENDPOINT ??
    'https://formspree.io/f/REPLACE_BUSINESS_ID',
}

const playlistUrl =
  'https://www.youtube.com/playlist?list=PL10vMJnTRJMe59Xb0q8_BVjmGqbzMVpL9'

const heroWork = {
  title: 'アンノウン・マザーグース',
  titleEn: 'Unknown Mother Goose',
  client: '涼海ネモ / Nemo Channel',
  url: 'https://www.youtube.com/watch?v=nRDHO45n3AM',
  image: '/media/unknown-mother-goose-poster.jpg',
  video: '/media/unknown-mother-goose-hero.mp4',
}

const works = [
  {
    title: '神っぽいな',
    titleEn: 'God-ish',
    client: 'プロジェクトセカイ',
    clientEn: 'Project SEKAI',
    role: 'Movie / Lyric Video',
    tags: ['Flagship', 'Major IP'],
    url: 'https://www.youtube.com/watch?v=vIHCFGj_G2E',
    image: 'https://i.ytimg.com/vi/vIHCFGj_G2E/maxresdefault.jpg',
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
    noteJa: 'Lyric Design: Collaborator',
    noteEn: 'Lyric Design: Collaborator',
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

const personalPlans = [
  {
    name: 'Riesz Main',
    price: '150,000円〜',
    priceEn: 'From JPY 150,000',
    description:
      'Riesz本人がメイン制作を担当するプランです。演出・編集・デザイン・仕上げまで、Rieszの作風を重視したMV制作に向いています。',
    descriptionEn:
      'A Riesz-led plan for clients who want the core direction, editing, design, and finishing handled by Riesz.',
    tiers: ['Standard 150,000円〜', 'Flagship 250,000円〜'],
    tiersEn: ['Standard from JPY 150,000', 'Flagship from JPY 250,000'],
  },
  {
    name: 'Hybrid',
    price: '100,000円〜',
    priceEn: 'From JPY 100,000',
    description:
      'リリックデザインなど一部工程を、信頼できる協力クリエイターが担当します。Rieszが全体のディレクション・演出・編集・仕上げを行います。',
    descriptionEn:
      'A trusted collaborator handles selected parts such as lyric design, while Riesz directs, edits, and finishes the work.',
    tiers: ['Entry 100,000円〜', 'Standard 130,000円〜', 'Flagship 200,000円〜'],
    tiersEn: [
      'Entry from JPY 100,000',
      'Standard from JPY 130,000',
      'Flagship from JPY 200,000',
    ],
  },
  {
    name: 'Partner',
    price: '50,000円〜',
    priceEn: 'From JPY 50,000',
    description:
      '協力クリエイターの作風を活かして制作するプランです。Rieszは主にディレクション・品質確認を担当します。',
    descriptionEn:
      'A collaborator-led plan. Riesz mainly handles direction and quality review while the partner creator leads the visual expression.',
    tiers: ['Light 50,000円〜', 'Standard 80,000円〜', 'Premium 100,000円〜'],
    tiersEn: [
      'Light from JPY 50,000',
      'Standard from JPY 80,000',
      'Premium from JPY 100,000',
    ],
  },
]

const notesJa = [
  '表示価格は税別です。',
  '個人のお客様は全額前払いです。入金確認後にスケジュールを確保します。',
  '軽微な修正は2回まで無料です。大幅な方向転換・構成変更は追加料金となります。',
  '4分以上の楽曲、短納期、納品後修正は内容に応じて別途お見積もりとなります。',
  '実績非公開をご希望の場合は +100,000円〜 となります。',
  'プロジェクトファイル納品をご希望の場合は +200,000円〜 となります。',
  'プロジェクトファイルを納品した場合、クライアント様の責任範囲において編集・改変・関係者への共有・二次配布が可能です。',
  '使用素材・フォント・プラグイン等のライセンスにより、一部データの納品・再配布・商用利用が制限される場合があります。',
  'お客様都合による制作開始後のキャンセルは、原則として返金できません。当方都合により制作継続が困難となった場合は、全額返金いたします。',
]

const notesEn = [
  'Prices are listed before tax.',
  'Individual commissions require full advance payment. The production schedule is reserved after payment is confirmed.',
  'Two minor revision rounds are included. Major direction or structure changes require an additional estimate.',
  'Songs longer than four minutes, rush timelines, and post-delivery revisions may require an additional estimate.',
  'Private / non-public portfolio use starts from an additional JPY 100,000.',
  'Project file delivery starts from an additional JPY 200,000.',
  'When project files are delivered, the client may edit, modify, share with relevant parties, and redistribute them within the client responsibility scope.',
  'Some assets, fonts, plugins, or third-party materials may limit delivery scope, redistribution, or commercial use.',
  'Client-side cancellation after production begins is generally non-refundable. If production cannot continue due to Riesz-side circumstances, a full refund will be issued.',
]

const personalFlowJa = [
  'お問い合わせ',
  '内容確認・お見積もり',
  'ご入金 / スケジュール確保',
  '制作開始',
  '初稿確認',
  '修正対応',
  '納品',
]

const personalFlowEn = [
  'Request',
  'Scope review / estimate',
  'Payment / schedule reservation',
  'Production starts',
  'First preview',
  'Revision rounds',
  'Delivery',
]

const businessFlowJa = [
  'お問い合わせ',
  '内容確認・お見積もり',
  '発注書 / 契約 / NDA確認',
  '制作開始',
  '初稿確認',
  '修正対応',
  '納品 / ご請求',
]

const businessFlowEn = [
  'Inquiry',
  'Scope review / estimate',
  'Purchase order / contract / NDA',
  'Production starts',
  'First preview',
  'Revision rounds',
  'Delivery / invoice',
]

function App() {
  const page = getPage()
  const [lang, setLang] = useState<Lang>('ja')
  const isBusiness = page === 'business'

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = isBusiness
      ? lang === 'ja'
        ? 'Riesz for Business | MV / Design / Direction'
        : 'Riesz for Business | Music Video / Design / Direction'
      : lang === 'ja'
        ? 'Riesz | MV / Design / Direction'
        : 'Riesz | Music Video / Design / Direction'
  }, [isBusiness, lang])

  return (
    <div className="site-shell">
      <Header lang={lang} setLang={setLang} page={page} />
      {isBusiness ? <BusinessPage lang={lang} /> : <PersonalPage lang={lang} />}
      <Footer lang={lang} />
    </div>
  )
}

function getPage(): Page {
  const root = document.getElementById('root')
  return root?.dataset.page === 'business' ? 'business' : 'personal'
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

async function handleContactSubmit(
  event: FormEvent<HTMLFormElement>,
  subject: string,
  setStatus: (status: SubmitStatus) => void,
) {
  const form = event.currentTarget

  event.preventDefault()
  setStatus('submitting')

  if (form.action.includes('REPLACE_')) {
    const formData = new FormData(form)
    const body = Array.from(formData.entries())
      .filter(([key, value]) => key !== '_gotcha' && String(value).trim() !== '')
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n')

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setStatus('idle')
    return
  }

  const formData = new FormData(form)

  if (String(formData.get('_gotcha') ?? '').trim() !== '') {
    setStatus('success')
    form.reset()
    return
  }

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Form submission failed: ${response.status}`)
    }

    setStatus('success')
    form.reset()
  } catch {
    setStatus('error')
  }
}

function Header({
  lang,
  setLang,
  page,
}: {
  lang: Lang
  setLang: (lang: Lang) => void
  page: Page
}) {
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="Riesz home">
        Riesz
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href={page === 'business' ? '/#works' : '#works'}>Works</a>
        <a href={page === 'business' ? '/#pricing' : '#pricing'}>Pricing</a>
        <a href="/business/">Business</a>
        <a className="contact-pill" href="#contact">
          <span className="contact-pill__label">Contact</span>
          <span className="contact-pill__dot" aria-hidden="true" />
        </a>
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
          aria-label="Switch language"
        >
          <Languages size={16} aria-hidden="true" />
          {lang === 'ja' ? 'EN' : 'JP'}
        </button>
      </nav>
    </header>
  )
}

function PersonalPage({ lang }: { lang: Lang }) {
  return (
    <main>
      <Hero lang={lang} />
      <WorksSection lang={lang} />
      <PricingSection lang={lang} />
      <FlowSection
        lang={lang}
        titleJa="制作の流れ"
        titleEn="Production Flow"
        steps={lang === 'ja' ? personalFlowJa : personalFlowEn}
      />
      <NotesSection lang={lang} />
      <PersonalContact lang={lang} />
    </main>
  )
}

function BusinessPage({ lang }: { lang: Lang }) {
  return (
    <main>
      <section className="business-hero">
        <div className="business-hero__copy">
          <div className="eyebrow">
            <Building2 size={16} aria-hidden="true" />
            {lang === 'ja' ? 'Business / Corporate' : 'Business / Corporate'}
          </div>
          <h1>
            {lang === 'ja'
              ? (
                  <>
                    <span>法人・企業</span>
                    <span>案件のご相談</span>
                  </>
                )
              : 'Business and Corporate Projects'}
          </h1>
          <p>
            {lang === 'ja'
              ? '企業案件、IP関連映像、VTuber / 音楽プロジェクト、告知映像、ティザー、Short動画など、使用範囲と権利条件を確認したうえで個別にお見積もりします。'
              : 'For corporate projects, IP-related videos, VTuber or music projects, teasers, announcements, and shorts, estimates are prepared individually based on scope, usage, and rights.'}
          </p>
        </div>
        <div className="business-panel">
          <h2>{lang === 'ja' ? '別途お見積もり' : 'Custom Estimate'}</h2>
          <ul>
            {(lang === 'ja'
              ? [
                  '請求書払い・後払い対応可',
                  '発注書・契約書・NDA対応可',
                  '実績掲載可否、公開媒体、使用範囲を確認',
                  '外部発注費が発生する場合は一部前払いをお願いする場合あり',
                ]
              : [
                  'Invoice and deferred payment available',
                  'Purchase order, contract, and NDA supported',
                  'Portfolio visibility, media, and usage scope confirmed first',
                  'Partial advance payment may be requested when external production costs are required',
                ]
            ).map((item) => (
              <li key={item}>
                <Check size={16} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FlowSection
        lang={lang}
        titleJa="法人案件の流れ"
        titleEn="Business Project Flow"
        steps={lang === 'ja' ? businessFlowJa : businessFlowEn}
      />
      <BusinessContact lang={lang} />
    </main>
  )
}

function Hero({ lang }: { lang: Lang }) {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow">
          <Play size={15} aria-hidden="true" />
          Music Video Commissions
        </div>
        <h1>Riesz</h1>
        <p className="hero-subtitle">
          {lang === 'ja'
            ? 'MV / Design / Direction'
            : 'Music Video / Design / Direction'}
        </p>
        <p className="hero-description">
          {lang === 'ja'
            ? '歌ってみたMV、オリジナルMV、リリックビデオの制作相談を受け付けています。作品の温度と情報量を両立する映像設計を行います。'
            : 'Music video, cover MV, and lyric video commissions. Riesz designs video direction that balances visual density, rhythm, and emotional tone.'}
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#contact">
            <Send size={16} aria-hidden="true" />
            {lang === 'ja' ? '見積もり相談' : 'Request Estimate'}
          </a>
          <a className="secondary-button" href="#works">
            {lang === 'ja' ? '作品を見る' : 'View Works'}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-label={heroWork.title}>
        {prefersReducedMotion ? (
          <img src={heroWork.image} alt="" />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroWork.image}
            preload="metadata"
            aria-hidden="true"
          >
            <source src={heroWork.video} type="video/mp4" />
          </video>
        )}
        <div className="hero-visual__caption">
          <span>{lang === 'ja' ? 'Hero Work' : 'Hero Work'}</span>
          <strong>{lang === 'ja' ? heroWork.title : heroWork.titleEn}</strong>
          <small>{heroWork.client}</small>
        </div>
      </div>
    </section>
  )
}

function WorksSection({ lang }: { lang: Lang }) {
  return (
    <section className="content-section works-section" id="works">
      <div className="section-heading">
        <p>{lang === 'ja' ? 'Selected Works' : 'Selected Works'}</p>
        <h2>{lang === 'ja' ? '制作実績' : 'Works'}</h2>
        <a href={playlistUrl} target="_blank" rel="noreferrer">
          {lang === 'ja' ? 'すべての制作実績を見る' : 'View all works'}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="work-grid">
        {works.map((work) => (
          <article className="work-card" key={work.url}>
            <a href={work.url} target="_blank" rel="noreferrer">
              <img src={work.image} alt="" loading="lazy" />
              <span className="work-watch">
                Watch <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
            <div className="work-card__body">
              <h3
                className={work.compactTitle ? 'work-title work-title--compact' : 'work-title'}
              >
                {lang === 'ja' ? work.title : work.titleEn}
              </h3>
              <p>{lang === 'ja' ? work.client : work.clientEn}</p>
              <p className="work-role">{work.role}</p>
              {work.noteJa && (
                <p className="work-note">
                  {lang === 'ja' ? work.noteJa : work.noteEn}
                </p>
              )}
              <div className="tag-list">
                {work.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PricingSection({ lang }: { lang: Lang }) {
  return (
    <section className="content-section" id="pricing">
      <div className="section-heading">
        <p>{lang === 'ja' ? 'Price Guide' : 'Price Guide'}</p>
        <h2>{lang === 'ja' ? '制作プラン' : 'Plans'}</h2>
      </div>
      <div className="plan-grid">
        {personalPlans.map((plan) => (
          <article className="plan-card" key={plan.name}>
            <div className="plan-card__top">
              <h3>{plan.name}</h3>
              <strong>{lang === 'ja' ? plan.price : plan.priceEn}</strong>
            </div>
            <p>{lang === 'ja' ? plan.description : plan.descriptionEn}</p>
            <ul>
              {(lang === 'ja' ? plan.tiers : plan.tiersEn).map((tier) => (
                <li key={tier}>
                  <Check size={15} aria-hidden="true" />
                  {tier}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="light-plan">
        <span>{lang === 'ja' ? 'Short / Light Plan' : 'Short / Light Plan'}</span>
        <p>
          {lang === 'ja'
            ? 'Shorts、ティザー、部分制作、簡易編集などは 50,000円〜100,000円目安でご相談可能です。'
            : 'Shorts, teasers, partial production, and light editing are available around JPY 50,000 to 100,000 depending on scope.'}
        </p>
      </div>
    </section>
  )
}

function FlowSection({
  lang,
  titleJa,
  titleEn,
  steps,
}: {
  lang: Lang
  titleJa: string
  titleEn: string
  steps: string[]
}) {
  return (
    <section className="content-section flow-section">
      <div className="section-heading">
        <p>{lang === 'ja' ? 'Flow' : 'Flow'}</p>
        <h2>{lang === 'ja' ? titleJa : titleEn}</h2>
      </div>
      <ol className="flow-list">
        {steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  )
}

function NotesSection({ lang }: { lang: Lang }) {
  const notes = lang === 'ja' ? notesJa : notesEn
  return (
    <section className="content-section notes-section">
      <div className="section-heading">
        <p>{lang === 'ja' ? 'Terms' : 'Terms'}</p>
        <h2>{lang === 'ja' ? '注意事項' : 'Notes'}</h2>
      </div>
      <ul>
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </section>
  )
}

function PersonalContact({ lang }: { lang: Lang }) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  return (
    <section className="contact-section" id="contact">
      <ContactIntro lang={lang} business={false} />
      <form
        action={formEndpoints.personal}
        method="POST"
        className="contact-form"
        onSubmit={(event) => handleContactSubmit(event, '[Riesz 個人依頼]', setSubmitStatus)}
      >
        <input type="hidden" name="_subject" value="[Riesz 個人依頼]" />
        <input className="hidden-field" type="text" name="_gotcha" tabIndex={-1} />
        <Field label={lang === 'ja' ? '名前 / 活動名' : 'Name / Artist name'} name="name" required />
        <Field label={lang === 'ja' ? 'メールアドレス' : 'Email'} name="email" type="email" required />
        <div className="form-row">
          <Field label="Discord ID" name="discord" />
          <Field label="X ID" name="x_id" />
        </div>
        <Select
          lang={lang}
          label={lang === 'ja' ? '依頼内容' : 'Request type'}
          name="request_type"
          options={
            lang === 'ja'
              ? ['オリジナルMV', '歌ってみたMV', 'Shorts / 短尺動画', 'Lyric Video', 'その他']
              : ['Original MV', 'Cover MV', 'Shorts / Short video', 'Lyric Video', 'Other']
          }
          required
        />
        <Select
          lang={lang}
          label={lang === 'ja' ? '希望プラン' : 'Preferred plan'}
          name="preferred_plan"
          options={[
            'Riesz Main Standard',
            'Riesz Main Flagship',
            'Hybrid Entry',
            'Hybrid Standard',
            'Hybrid Flagship',
            'Partner Light',
            'Partner Standard',
            'Partner Premium',
            'Short / Light',
            lang === 'ja' ? '相談して決めたい' : 'Need advice',
          ]}
          required
        />
        <Select
          lang={lang}
          label={lang === 'ja' ? '予算帯' : 'Budget range'}
          name="budget"
          options={
            lang === 'ja'
              ? ['5万円〜10万円', '10万円〜15万円', '15万円〜20万円', '20万円〜25万円', '25万円以上', '相談したい']
              : [
                  'JPY 50,000-100,000',
                  'JPY 100,000-150,000',
                  'JPY 150,000-200,000',
                  'JPY 200,000-250,000',
                  'JPY 250,000+',
                  'Need advice',
                ]
          }
          required
        />
        <div className="form-row">
          <Field label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'} name="delivery_date" required />
          <Field label={lang === 'ja' ? '公開予定日' : 'Planned release date'} name="release_date" />
        </div>
        <Select
          lang={lang}
          label={lang === 'ja' ? '楽曲尺' : 'Song length'}
          name="song_length"
          options={['〜1分', '1分〜2分', '2分〜3分', '3分〜4分', '4分以上', lang === 'ja' ? '未定' : 'TBD']}
          required
        />
        <CheckboxGroup
          label={lang === 'ja' ? '素材状況' : 'Available materials'}
          name="materials"
          options={
            lang === 'ja'
              ? ['音源あり', '歌詞あり', 'イラストあり', 'イラスト差分あり', 'ロゴあり', '背景素材あり', 'まだ未定']
              : ['Audio ready', 'Lyrics ready', 'Illustration ready', 'Illustration variations ready', 'Logo ready', 'Background ready', 'TBD']
          }
        />
        <Field
          label={lang === 'ja' ? '参考映像URL' : 'Reference video URL'}
          name="references"
          required
          helper={lang === 'ja' ? '未定の場合は「未定」とご記入ください。' : 'If undecided, enter TBD.'}
        />
        <Field label={lang === 'ja' ? '素材URL' : 'Material URL'} name="material_url" />
        <Select
          lang={lang}
          label={lang === 'ja' ? '制作体制の希望' : 'Production setup'}
          name="production_setup"
          options={
            lang === 'ja'
              ? ['Riesz本人メインの制作を希望', '一部協力クリエイター参加可', 'Partner Planも相談可', '内容を見て相談したい']
              : ['Riesz-led production preferred', 'Collaborator support is acceptable', 'Partner Plan is acceptable', 'Need advice after review']
          }
          required
        />
        <Select
          lang={lang}
          label={lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'}
          name="portfolio_visibility"
          options={lang === 'ja' ? ['掲載可', '公開後なら掲載可', '掲載不可（+100,000円〜）', '相談したい'] : ['Allowed', 'Allowed after release', 'Private (+JPY 100,000+)', 'Need to discuss']}
          required
        />
        <Select
          lang={lang}
          label={lang === 'ja' ? 'プロジェクトファイル納品' : 'Project file delivery'}
          name="project_file"
          options={lang === 'ja' ? ['希望しない', '希望する（+200,000円〜）', '相談したい'] : ['Not needed', 'Requested (+JPY 200,000+)', 'Need to discuss']}
          required
        />
        <TextArea label={lang === 'ja' ? 'その他' : 'Additional notes'} name="message" />
        <button className="submit-button" type="submit" disabled={submitStatus === 'submitting'}>
          <Mail size={17} aria-hidden="true" />
          {submitStatus === 'submitting'
            ? lang === 'ja'
              ? '送信中'
              : 'Sending'
            : lang === 'ja'
              ? '見積もり相談を送る'
              : 'Send Estimate Request'}
        </button>
        <ContactSubmitStatus lang={lang} status={submitStatus} />
      </form>
    </section>
  )
}

function BusinessContact({ lang }: { lang: Lang }) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')

  return (
    <section className="contact-section" id="contact">
      <ContactIntro lang={lang} business />
      <form
        action={formEndpoints.business}
        method="POST"
        className="contact-form"
        onSubmit={(event) => handleContactSubmit(event, '[Riesz 法人依頼]', setSubmitStatus)}
      >
        <input type="hidden" name="_subject" value="[Riesz 法人依頼]" />
        <input className="hidden-field" type="text" name="_gotcha" tabIndex={-1} />
        <Field label={lang === 'ja' ? '会社名' : 'Company'} name="company" required />
        <Field label={lang === 'ja' ? '担当者名' : 'Contact person'} name="name" required />
        <Field label={lang === 'ja' ? 'メールアドレス' : 'Email'} name="email" type="email" required />
        <Field label={lang === 'ja' ? '会社サイトURL' : 'Company website'} name="company_url" />
        <TextArea label={lang === 'ja' ? '案件概要' : 'Project summary'} name="project_summary" required />
        <Field label={lang === 'ja' ? '使用範囲' : 'Usage scope'} name="usage_scope" required />
        <Field label={lang === 'ja' ? '公開媒体' : 'Release media'} name="media" required />
        <div className="form-row">
          <Field label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'} name="delivery_date" required />
          <Field label={lang === 'ja' ? '公開予定日' : 'Planned release date'} name="release_date" required />
        </div>
        <Select
          lang={lang}
          label={lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'}
          name="portfolio_visibility"
          options={lang === 'ja' ? ['掲載可', '公開後なら掲載可', '掲載不可', '相談したい'] : ['Allowed', 'Allowed after release', 'Private', 'Need to discuss']}
          required
        />
        <Select
          lang={lang}
          label={lang === 'ja' ? 'NDA / 契約書の有無' : 'NDA / Contract'}
          name="nda_contract"
          options={lang === 'ja' ? ['あり', 'なし', '相談したい'] : ['Required', 'Not required', 'Need to discuss']}
          required
        />
        <Field label={lang === 'ja' ? '請求書払い条件' : 'Invoice payment terms'} name="payment_terms" required />
        <Field label={lang === 'ja' ? '参考資料URL' : 'Reference material URL'} name="references" required />
        <Field label={lang === 'ja' ? '予算感' : 'Budget range'} name="budget" />
        <Field label={lang === 'ja' ? '素材URL' : 'Material URL'} name="material_url" />
        <Select
          lang={lang}
          label={lang === 'ja' ? 'プロジェクトファイル納品' : 'Project file delivery'}
          name="project_file"
          options={lang === 'ja' ? ['希望しない', '希望する（+200,000円〜）', '相談したい'] : ['Not needed', 'Requested (+JPY 200,000+)', 'Need to discuss']}
        />
        <TextArea label={lang === 'ja' ? 'その他' : 'Additional notes'} name="message" />
        <button className="submit-button" type="submit" disabled={submitStatus === 'submitting'}>
          <Mail size={17} aria-hidden="true" />
          {submitStatus === 'submitting'
            ? lang === 'ja'
              ? '送信中'
              : 'Sending'
            : lang === 'ja'
              ? '法人案件を相談する'
              : 'Send Business Inquiry'}
        </button>
        <ContactSubmitStatus lang={lang} status={submitStatus} />
      </form>
    </section>
  )
}

function ContactSubmitStatus({ lang, status }: { lang: Lang; status: SubmitStatus }) {
  if (status === 'idle') {
    return null
  }

  const message =
    status === 'submitting'
      ? lang === 'ja'
        ? '送信しています。画面を閉じずにお待ちください。'
        : 'Sending. Please keep this page open.'
      : status === 'success'
        ? lang === 'ja'
          ? '相談を受け付けました。内容を確認し、通常3日以内に返信します。'
          : 'Request received. I will review the details and reply within 3 business days.'
        : lang === 'ja'
          ? `送信できませんでした。お手数ですが ${contactEmail} へ直接ご連絡ください。`
          : `Could not send the form. Please contact ${contactEmail} directly.`

  return (
    <p
      className={`form-status form-status--${status}`}
      role={status === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {message}
    </p>
  )
}

function ContactIntro({ lang, business }: { lang: Lang; business: boolean }) {
  return (
    <div className="contact-intro">
      <p>Contact</p>
      <h2>{lang === 'ja' ? 'ご相談はこちら' : 'Request an Estimate'}</h2>
      <span>
        {business
          ? lang === 'ja'
            ? '法人・企業案件は内容、使用範囲、権利条件を確認したうえで個別にお見積もりします。'
            : 'Business projects are estimated individually after confirming scope, usage, and rights.'
          : lang === 'ja'
            ? '通常3日以内にご返信いたします。内容により、追加確認をお願いする場合があります。'
            : 'I usually reply within 3 business days. Follow-up questions may be needed depending on the project.'}
      </span>
      <a className="direct-mail" href={`mailto:${contactEmail}`}>
        {contactEmail}
      </a>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  helper,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  helper?: string
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <input name={name} type={type} required={required} />
      {helper && <small>{helper}</small>}
    </label>
  )
}

function TextArea({
  label,
  name,
  required = false,
}: {
  label: string
  name: string
  required?: boolean
}) {
  return (
    <label className="field field--wide">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <textarea name={name} required={required} rows={5} />
    </label>
  )
}

function Select({
  lang,
  label,
  name,
  options,
  required = false,
}: {
  lang: Lang
  label: string
  name: string
  options: string[]
  required?: boolean
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <select name={name} required={required} defaultValue="">
        <option value="" disabled>
          {lang === 'ja' ? '選択してください' : 'Select'}
        </option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function CheckboxGroup({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: string[]
}) {
  return (
    <fieldset className="checkbox-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <label key={option}>
            <input type="checkbox" name={name} value={option} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>Riesz</strong>
        <span>
          {lang === 'ja'
            ? 'MV / Design / Direction'
            : 'Music Video / Design / Direction'}
        </span>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/">Home</a>
        <a href="/business/">Business</a>
        <a href={playlistUrl} target="_blank" rel="noreferrer">
          YouTube
        </a>
        <a href={xUrl} target="_blank" rel="noreferrer">
          X
        </a>
        <a href={boothUrl} target="_blank" rel="noreferrer">
          BOOTH
        </a>
        <a href={`mailto:${contactEmail}`}>
          <Mail size={14} aria-hidden="true" />
          {contactEmail}
        </a>
      </nav>
    </footer>
  )
}

export default App
