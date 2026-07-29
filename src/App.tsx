import {
  ArrowUpRight,
  Building2,
  Check,
  Languages,
  Mail,
  Play,
  Send,
  X,
} from 'lucide-react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import './App.css'
import {
  corporateCollaboratorHelper,
  corporateCollaboratorOptions,
  notesEn,
  notesJa,
  pricingRoutes,
  supportPlans,
} from './commission-content'
import {
  budgetOptions,
  businessPortfolioOptions,
  materialOptions,
  ndaOptions,
  personalPortfolioOptions,
  personalRequestTypeOptions,
  personalSetupOptions,
  preferredPlanOptions,
  projectFileOptions,
  songLengthOptions,
} from './form-options'
import type { LocalizedOption } from './form-options'
import {
  getSaveDataConnection,
  shouldRenderStaticHeroFromBrowser,
} from './hero-media'
import {
  readBrowserLanguagePreference,
  writeBrowserLanguagePreference,
} from './language-preference'
import type { Language } from './language-preference'
import { businessWorks, works } from './portfolio-content'
import type { WorkItem } from './portfolio-content'

type Lang = Language
type Page = 'personal' | 'business'
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type WorkContactPreset = {
  title: string
  titleEn: string
  plan: string
  budgetJa: string
  budgetEn: string
  workUrl: string
}

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

const cloudflareAnalyticsToken =
  import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim() ?? ''

const playlistUrl =
  'https://www.youtube.com/playlist?list=PL10vMJnTRJMe59Xb0q8_BVjmGqbzMVpL9'

const heroWork = {
  title: 'アンノウン・マザーグース',
  titleEn: 'Unknown Mother Goose',
  client: '涼海ネモ / Nemo Channel',
  url: 'https://www.youtube.com/watch?v=nRDHO45n3AM',
  image: '/media/unknown-mother-goose-poster.jpg',
  posterWebp: '/media/unknown-mother-goose-poster.webp',
  video: '/media/unknown-mother-goose-hero.mp4',
  mobileVideo: '/media/unknown-mother-goose-hero-mobile.mp4',
}

function createWorkContactPreset(work: WorkItem): WorkContactPreset {
  const scalePreset = getWorkScalePreset(work.tags)

  return {
    title: work.title,
    titleEn: work.titleEn,
    workUrl: work.url,
    ...scalePreset,
  }
}

function getWorkScalePreset(tags: string[]) {
  if (tags.includes('Hybrid Flagship')) {
    return {
      plan: 'Hybrid Flagship',
      budgetJa: '25万円以上',
      budgetEn: 'JPY 250,000+',
    }
  }

  if (tags.includes('Hybrid Standard')) {
    return {
      plan: 'Hybrid Standard',
      budgetJa: '15万円〜20万円',
      budgetEn: 'JPY 150,000-200,000',
    }
  }

  if (tags.includes('Standard')) {
    return {
      plan: 'Riesz Main Standard',
      budgetJa: '15万円〜20万円',
      budgetEn: 'JPY 150,000-200,000',
    }
  }

  return {
    plan: 'Riesz Main Flagship',
    budgetJa: '25万円以上',
    budgetEn: 'JPY 250,000+',
  }
}

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
  const [lang, setLang] = useState<Lang>(readBrowserLanguagePreference)
  const isBusiness = page === 'business'

  useEffect(() => {
    writeBrowserLanguagePreference(lang)
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
      <AnalyticsBeacon />
      <Header lang={lang} setLang={setLang} page={page} />
      {isBusiness ? <BusinessPage lang={lang} /> : <PersonalPage lang={lang} />}
      <Footer lang={lang} />
    </div>
  )
}

function AnalyticsBeacon() {
  useEffect(() => {
    if (!import.meta.env.PROD || !cloudflareAnalyticsToken) {
      return
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-riesz-analytics="cloudflare"]',
    )

    if (existing) {
      return
    }

    const script = document.createElement('script')
    script.defer = true
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
    script.dataset.rieszAnalytics = 'cloudflare'
    script.dataset.cfBeacon = JSON.stringify({
      token: cloudflareAnalyticsToken,
    })
    document.head.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return null
}

function getPage(): Page {
  const root = document.getElementById('root')
  return root?.dataset.page === 'business' ? 'business' : 'personal'
}

function useStaticHeroMedia() {
  const [renderStaticHero, setRenderStaticHero] = useState(
    shouldRenderStaticHeroFromBrowser,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = getSaveDataConnection()
    const handleChange = () =>
      setRenderStaticHero(shouldRenderStaticHeroFromBrowser())

    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    connection?.addEventListener?.('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
      connection?.removeEventListener?.('change', handleChange)
    }
  }, [])

  return renderStaticHero
}

async function handleContactSubmit(
  event: FormEvent<HTMLFormElement>,
  subject: string,
  setStatus: (status: SubmitStatus) => void,
  onSuccess?: () => void,
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
    onSuccess?.()
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
    onSuccess?.()
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
  const destinationLanguage = lang === 'ja' ? 'EN' : 'JP'

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
          aria-label={`Switch language to ${destinationLanguage}`}
        >
          <Languages size={16} aria-hidden="true" />
          {destinationLanguage}
        </button>
      </nav>
    </header>
  )
}

function PersonalPage({ lang }: { lang: Lang }) {
  const [workContactPreset, setWorkContactPreset] =
    useState<WorkContactPreset | null>(null)

  return (
    <main>
      <Hero lang={lang} />
      <WorksSection lang={lang} onWorkContactSelect={setWorkContactPreset} />
      <PricingSection lang={lang} />
      <FlowSection
        lang={lang}
        titleJa="制作の流れ"
        titleEn="Production Flow"
        steps={lang === 'ja' ? personalFlowJa : personalFlowEn}
      />
      <NotesSection lang={lang} />
      <PersonalContact
        lang={lang}
        workContactPreset={workContactPreset}
        onClearWorkContactPreset={() => setWorkContactPreset(null)}
      />
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
                  corporateCollaboratorHelper.ja,
                  '外部発注費が発生する場合は一部前払いをお願いする場合あり',
                ]
              : [
                  'Invoice and deferred payment available',
                  'Purchase order, contract, and NDA supported',
                  'Portfolio visibility, media, and usage scope confirmed first',
                  corporateCollaboratorHelper.en,
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

      <BusinessExperienceSection lang={lang} />
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

function BusinessExperienceSection({ lang }: { lang: Lang }) {
  const isJapanese = lang === 'ja'

  return (
    <section
      className="content-section business-work-section"
      aria-labelledby="business-work-title"
    >
      <div className="section-heading">
        <p>Selected Corporate Work</p>
        <h2 id="business-work-title">
          {isJapanese ? '法人・大型IPの公開実績' : 'Public Corporate and Major-IP Work'}
        </h2>
      </div>
      <p className="business-work-lead">
        {isJapanese
          ? '公開可能な実績のうち、法人・大型IP案件で担当した範囲を掲載しています。各作品から公開映像をご確認いただけます。'
          : 'A selection of public corporate and major-IP projects, with Riesz’s disclosed production scope for each work.'}
      </p>
      <div className="business-work-list">
        {businessWorks.map((work, index) => {
          const title = isJapanese ? work.title : work.titleEn
          const client = isJapanese ? work.client : work.clientEn
          const note = isJapanese ? work.noteJa : work.noteEn
          const linkLabel = isJapanese
            ? `${work.title}の公開映像を見る`
            : `Watch the public video for ${work.titleEn}`

          return (
            <article className="business-work-row" key={work.url}>
              <img src={work.image} alt="" loading="lazy" />
              <div className="business-work-row__identity">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{client}</p>
              </div>
              <div className="business-work-row__scope">
                <span>{isJapanese ? '担当範囲' : 'Production Scope'}</span>
                <p>{work.role}</p>
                {note && <small>{note}</small>}
                <div className="tag-list">
                  {work.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <a
                className="business-work-row__link"
                href={work.url}
                target="_blank"
                rel="noreferrer"
                aria-label={linkLabel}
                title={linkLabel}
              >
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function HoneypotField() {
  return (
    <input
      aria-hidden="true"
      autoComplete="off"
      className="hidden-field"
      name="_gotcha"
      tabIndex={-1}
      type="text"
    />
  )
}

function Hero({ lang }: { lang: Lang }) {
  const renderStaticHero = useStaticHeroMedia()

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
        {renderStaticHero ? (
          <picture>
            <source srcSet={heroWork.posterWebp} type="image/webp" />
            <img src={heroWork.image} alt="" />
          </picture>
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={heroWork.posterWebp}
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src={heroWork.mobileVideo}
              media="(max-width: 760px)"
              type="video/mp4"
            />
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

function WorksSection({
  lang,
  onWorkContactSelect,
}: {
  lang: Lang
  onWorkContactSelect: (preset: WorkContactPreset) => void
}) {
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
      <div className="work-tag-note">
        <p>
          {lang === 'ja'
            ? 'Flagship / Standard / Hybrid は制作規模の目安であり、固定料金ではありません。'
            : 'Flagship / Standard / Hybrid indicate production-scale references, not fixed prices.'}
        </p>
        <p>
          {lang === 'ja'
            ? 'Hybrid は、Rieszのディレクションに加えて、協力クリエイターが一部制作に参加する形式です。'
            : 'Hybrid means a collaborator may join part of the production under Riesz’s direction.'}
        </p>
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
              <a
                className="work-contact-link"
                href="#contact"
                onClick={() => onWorkContactSelect(createWorkContactPreset(work))}
                aria-label={`${
                  lang === 'ja' ? 'この規模で相談する' : 'Request similar style'
                }: ${lang === 'ja' ? work.title : work.titleEn}`}
              >
                {lang === 'ja' ? 'この規模で相談する' : 'Request similar style'}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PricingSection({ lang }: { lang: Lang }) {
  const isJapanese = lang === 'ja'

  return (
    <section className="content-section" id="pricing">
      <div className="section-heading">
        <p>Price Guide</p>
        <h2>{isJapanese ? '制作プラン' : 'Plans'}</h2>
      </div>
      <p className="pricing-lead">
        {isJapanese
          ? 'まず「誰が制作を主導するか」を選び、その後に作り込み量をお選びください。最終金額は楽曲尺、素材状況、納期、表現量によってお見積もりします。'
          : 'First choose who leads production, then choose the development level. Final estimates depend on song length, materials, timeline, and expression volume.'}
      </p>

      <ol className="pricing-steps" aria-label={isJapanese ? 'プランの選び方' : 'How to choose a plan'}>
        <li>
          <span>01</span>
          <div>
            <strong>{isJapanese ? '制作主導を選ぶ' : 'Choose the production lead'}</strong>
            <p>
              {isJapanese
                ? 'Riesz本人 / Rieszと協力クリエイター / 協力クリエイター主体'
                : 'Riesz-led / Riesz with a specialist / collaborator-led'}
            </p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <strong>{isJapanese ? '作り込み量を選ぶ' : 'Choose the development level'}</strong>
            <p>
              {isJapanese
                ? 'Standardは通常規模、Flagshipは代表作向けの高密度制作'
                : 'Standard for regular scope, Flagship for high-density representative work'}
            </p>
          </div>
        </li>
      </ol>

      <div className="pricing-routes">
        {pricingRoutes.map((route) => (
          <section className={`pricing-route pricing-route--${route.id}`} key={route.id}>
            <header className="pricing-route__header">
              <span>{isJapanese ? route.labelJa : route.labelEn}</span>
              <h3>{route.name}</h3>
              <p>{isJapanese ? route.introJa : route.introEn}</p>
            </header>

            <div className="pricing-route__tiers">
              {route.tiers.map((tier) => (
                <article className="pricing-tier" key={tier.name}>
                  <div className="pricing-tier__heading">
                    <div>
                      <span>{tier.id === 'standard' ? 'Standard' : 'Flagship'}</span>
                      <h4>{tier.name}</h4>
                    </div>
                    <strong>{isJapanese ? tier.priceJa : tier.priceEn}</strong>
                  </div>

                  <p className="pricing-tier__summary">
                    {isJapanese ? tier.summaryJa : tier.summaryEn}
                  </p>

                  <dl className="pricing-tier__details">
                    <div>
                      <dt>{isJapanese ? '制作' : 'Production'}</dt>
                      <dd>{isJapanese ? tier.productionJa : tier.productionEn}</dd>
                    </div>
                    <div>
                      <dt>{isJapanese ? 'リリック' : 'Lyric design'}</dt>
                      <dd>{isJapanese ? tier.lyricJa : tier.lyricEn}</dd>
                    </div>
                    <div>
                      <dt>{isJapanese ? '作り込み' : 'Development'}</dt>
                      <dd>{isJapanese ? tier.developmentJa : tier.developmentEn}</dd>
                    </div>
                    <div>
                      <dt>{isJapanese ? '向いている依頼' : 'Best for'}</dt>
                      <dd>{isJapanese ? tier.bestForJa : tier.bestForEn}</dd>
                    </div>
                  </dl>

                  <a
                    className="pricing-tier__work"
                    href={tier.representativeWork.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>{isJapanese ? '代表作' : 'Example'}</span>
                    {isJapanese
                      ? tier.representativeWork.titleJa
                      : tier.representativeWork.titleEn}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="support-plans" aria-labelledby="support-plans-title">
        <header>
          <span>{isJapanese ? 'その他の選択肢' : 'Other options'}</span>
          <h3 id="support-plans-title">
            {isJapanese ? '予算・用途から相談する' : 'Choose by budget or format'}
          </h3>
        </header>
        <div className="support-plan-grid">
          {supportPlans.map((plan) => (
            <article className="support-plan" key={plan.id}>
              <div className="support-plan__heading">
                <h4>{plan.name}</h4>
                <strong>{isJapanese ? plan.priceJa : plan.priceEn}</strong>
              </div>
              <p className="support-plan__lead">
                {isJapanese ? plan.leadJa : plan.leadEn}
              </p>
              <p>{isJapanese ? plan.descriptionJa : plan.descriptionEn}</p>
              <span className="support-plan__fit">
                {isJapanese ? plan.bestForJa : plan.bestForEn}
              </span>
            </article>
          ))}
        </div>
      </section>

      <div className="pricing-note">
        {isJapanese
          ? 'Hybrid / Partnerで協力クリエイターが参加する場合は、担当範囲と制作体制を事前に共有し、合意後に進行します。'
          : 'When a collaborator joins through Hybrid or Partner, responsibilities and production ownership are disclosed and agreed before work begins.'}
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

function PersonalContact({
  lang,
  workContactPreset,
  onClearWorkContactPreset,
}: {
  lang: Lang
  workContactPreset: WorkContactPreset | null
  onClearWorkContactPreset: () => void
}) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [preferredPlan, setPreferredPlan] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    if (!workContactPreset) {
      return
    }

    setPreferredPlan(workContactPreset.plan)
    setBudget(workContactPreset.budgetJa)
    setSubmitStatus('idle')
  }, [workContactPreset])

  const resetControlledFields = () => {
    setPreferredPlan('')
    setBudget('')
    onClearWorkContactPreset()
  }

  return (
    <section className="contact-section" id="contact">
      <ContactIntro lang={lang} business={false} />
      <form
        action={formEndpoints.personal}
        method="POST"
        className="contact-form"
        onSubmit={(event) =>
          handleContactSubmit(
            event,
            '[Riesz 個人依頼]',
            setSubmitStatus,
            resetControlledFields,
          )}
      >
        <input type="hidden" name="_subject" value="[Riesz 個人依頼]" />
        <HoneypotField />
        {workContactPreset && (
          <>
            <input
              type="hidden"
              name="riesz_reference_work"
              value={workContactPreset.title}
            />
            <input
              type="hidden"
              name="riesz_reference_url"
              value={workContactPreset.workUrl}
            />
            <div className="contact-preset">
              <div className="contact-preset__header">
                <p role="status" aria-live="polite">
                  {lang === 'ja'
                    ? `「${workContactPreset.title}」に近い規模で相談中`
                    : `Using ${workContactPreset.titleEn} as the Riesz work reference`}
                </p>
                <button
                  className="contact-preset__clear"
                  type="button"
                  onClick={onClearWorkContactPreset}
                >
                  <X size={15} aria-hidden="true" />
                  {lang === 'ja' ? '作品の選択を解除' : 'Clear work selection'}
                </button>
              </div>
              <span className="contact-preset__description">
                {lang === 'ja'
                  ? '希望プランと予算帯を入力しました。内容は自由に変更できます。'
                  : 'The plan and budget range are prefilled. You can edit them freely.'}
              </span>
            </div>
          </>
        )}
        <FormSection
          id="personal-contact"
          number="01"
          title={lang === 'ja' ? 'ご連絡先' : 'Contact'}
          subtitle={lang === 'ja' ? 'Contact' : 'Your details'}
        >
          <Field label={lang === 'ja' ? '名前 / 活動名' : 'Name / Artist name'} name="name" required />
          <Field label={lang === 'ja' ? 'メールアドレス' : 'Email'} name="email" type="email" required />
          <div className="form-row">
            <Field label="Discord ID" name="discord" />
            <Field label="X ID" name="x_id" />
          </div>
        </FormSection>

        <FormSection
          id="personal-request"
          number="02"
          title={lang === 'ja' ? 'ご依頼内容' : 'Request'}
          subtitle={lang === 'ja' ? 'Request' : 'Scope and budget'}
        >
          <Select
            lang={lang}
            label={lang === 'ja' ? '依頼内容' : 'Request type'}
            name="request_type"
            options={personalRequestTypeOptions}
            required
          />
          <Select
            lang={lang}
            label={lang === 'ja' ? '希望プラン' : 'Preferred plan'}
            name="preferred_plan"
            options={preferredPlanOptions}
            required
            value={preferredPlan}
            onValueChange={setPreferredPlan}
          />
          <Select
            lang={lang}
            label={lang === 'ja' ? '予算帯' : 'Budget range'}
            name="budget"
            options={budgetOptions}
            required
            value={budget}
            onValueChange={setBudget}
          />
        </FormSection>

        <FormSection
          id="personal-schedule"
          number="03"
          title={lang === 'ja' ? '納期・素材' : 'Schedule & Materials'}
          subtitle={lang === 'ja' ? 'Schedule & Materials' : 'Timing and source files'}
        >
          <div className="form-row">
            <Field label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'} name="delivery_date" required />
            <Field label={lang === 'ja' ? '公開予定日' : 'Planned release date'} name="release_date" />
          </div>
          <Select
            lang={lang}
            label={lang === 'ja' ? '楽曲尺' : 'Song length'}
            name="song_length"
            options={songLengthOptions}
            required
          />
          <CheckboxGroup
            lang={lang}
            label={lang === 'ja' ? '素材状況' : 'Available materials'}
            name="materials"
            options={materialOptions}
          />
          <TextArea
            label={
              lang === 'ja'
                ? '希望する表現の参考映像URL'
                : 'Client reference video URLs'
            }
            name="client_reference_urls"
            helper={
              lang === 'ja'
                ? '完成イメージに近い映像があれば、URLを1行ずつご記入ください。'
                : 'If you have examples close to the desired result, enter one URL per line.'
            }
          />
          <Field label={lang === 'ja' ? '素材URL' : 'Material URL'} name="material_url" />
        </FormSection>

        <FormSection
          id="personal-terms"
          number="04"
          title={lang === 'ja' ? '制作条件' : 'Production Terms'}
          subtitle={lang === 'ja' ? 'Production Terms' : 'Ownership and delivery'}
        >
          <Select
            lang={lang}
            label={lang === 'ja' ? '制作体制の希望' : 'Production setup'}
            name="production_setup"
            options={personalSetupOptions}
            required
          />
          <Select
            lang={lang}
            label={lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'}
            name="portfolio_visibility"
            options={personalPortfolioOptions}
            required
          />
          <Select
            lang={lang}
            label={lang === 'ja' ? 'プロジェクトファイル納品' : 'Project file delivery'}
            name="project_file"
            options={projectFileOptions}
            required
          />
          <TextArea label={lang === 'ja' ? 'その他' : 'Additional notes'} name="message" />
        </FormSection>
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
        <HoneypotField />
        <FormSection
          id="business-contact"
          number="01"
          title={lang === 'ja' ? 'ご連絡先' : 'Contact'}
          subtitle={lang === 'ja' ? 'Contact' : 'Company details'}
        >
          <div className="form-row">
            <Field label={lang === 'ja' ? '会社名' : 'Company'} name="company" required />
            <Field label={lang === 'ja' ? '担当者名' : 'Contact person'} name="name" required />
          </div>
          <div className="form-row">
            <Field label={lang === 'ja' ? 'メールアドレス' : 'Email'} name="email" type="email" required />
            <Field label={lang === 'ja' ? '会社サイトURL' : 'Company website'} name="company_url" />
          </div>
        </FormSection>

        <FormSection
          id="business-project"
          number="02"
          title={lang === 'ja' ? '案件概要' : 'Project'}
          subtitle={lang === 'ja' ? 'Project' : 'Scope and release'}
        >
          <TextArea label={lang === 'ja' ? '案件概要' : 'Project summary'} name="project_summary" required />
          <div className="form-row">
            <Field label={lang === 'ja' ? '使用範囲' : 'Usage scope'} name="usage_scope" required />
            <Field label={lang === 'ja' ? '公開媒体' : 'Release media'} name="media" required />
          </div>
          <Field label={lang === 'ja' ? '参考資料URL' : 'Reference material URL'} name="references" required />
        </FormSection>

        <FormSection
          id="business-schedule"
          number="03"
          title={lang === 'ja' ? '納期・素材' : 'Schedule & Materials'}
          subtitle={lang === 'ja' ? 'Schedule & Materials' : 'Timing, budget, and assets'}
        >
          <div className="form-row">
            <Field label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'} name="delivery_date" required />
            <Field label={lang === 'ja' ? '公開予定日' : 'Planned release date'} name="release_date" required />
          </div>
          <div className="form-row">
            <Field label={lang === 'ja' ? '予算感' : 'Budget range'} name="budget" />
            <Field label={lang === 'ja' ? '素材URL' : 'Material URL'} name="material_url" />
          </div>
        </FormSection>

        <FormSection
          id="business-terms"
          number="04"
          title={lang === 'ja' ? '契約・制作条件' : 'Contract & Production'}
          subtitle={lang === 'ja' ? 'Contract & Production' : 'Approval, payment, and delivery'}
        >
          <div className="form-row">
            <Select
              lang={lang}
              label={lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'}
              name="portfolio_visibility"
              options={businessPortfolioOptions}
              required
            />
            <Select
              lang={lang}
              label={lang === 'ja' ? 'NDA / 契約書の有無' : 'NDA / Contract'}
              name="nda_contract"
              options={ndaOptions}
              required
            />
          </div>
          <Select
            lang={lang}
            label={
              lang === 'ja'
                ? '協力クリエイターの参加可否'
                : 'Collaborator participation'
            }
            name="collaborator_participation"
            options={corporateCollaboratorOptions}
            helper={
              lang === 'ja'
                ? corporateCollaboratorHelper.ja
                : corporateCollaboratorHelper.en
            }
            required
          />
          <Field label={lang === 'ja' ? '請求書払い条件' : 'Invoice payment terms'} name="payment_terms" required />
          <Select
            lang={lang}
            label={lang === 'ja' ? 'プロジェクトファイル納品' : 'Project file delivery'}
            name="project_file"
            options={projectFileOptions}
          />
          <TextArea label={lang === 'ja' ? 'その他' : 'Additional notes'} name="message" />
        </FormSection>
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

function FormSection({
  id,
  number,
  title,
  subtitle,
  children,
}: {
  id: string
  number: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  const headingId = `${id}-heading`

  return (
    <section className="form-section" id={id} aria-labelledby={headingId}>
      <header className="form-section__heading">
        <span>{number}</span>
        <div>
          <h3 id={headingId}>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </header>
      <div className="form-section__fields">{children}</div>
    </section>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  helper,
  value,
  onValueChange,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  helper?: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  const inputProps =
    value === undefined
      ? {}
      : {
          value,
          onChange: (event: ChangeEvent<HTMLInputElement>) =>
            onValueChange?.(event.target.value),
        }

  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <input name={name} type={type} required={required} {...inputProps} />
      {helper && <small>{helper}</small>}
    </label>
  )
}

function TextArea({
  label,
  name,
  required = false,
  helper,
}: {
  label: string
  name: string
  required?: boolean
  helper?: string
}) {
  return (
    <label className="field field--wide">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <textarea name={name} required={required} rows={5} />
      {helper && <small>{helper}</small>}
    </label>
  )
}

function Select({
  lang,
  label,
  name,
  options,
  required = false,
  helper,
  value,
  onValueChange,
}: {
  lang: Lang
  label: string
  name: string
  options: LocalizedOption[]
  required?: boolean
  helper?: string
  value?: string
  onValueChange?: (value: string) => void
}) {
  const selectProps =
    value === undefined
      ? { defaultValue: '' }
      : {
          value,
          onChange: (event: ChangeEvent<HTMLSelectElement>) =>
            onValueChange?.(event.target.value),
        }

  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      <select name={name} required={required} {...selectProps}>
        <option value="" disabled>
          {lang === 'ja' ? '選択してください' : 'Select'}
        </option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option[lang]}
          </option>
        ))}
      </select>
      {helper && <small>{helper}</small>}
    </label>
  )
}

function CheckboxGroup({
  lang,
  label,
  name,
  options,
}: {
  lang: Lang
  label: string
  name: string
  options: LocalizedOption[]
}) {
  return (
    <fieldset className="checkbox-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <label key={option.value}>
            <input type="checkbox" name={name} value={option.value} />
            <span>{option[lang]}</span>
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
