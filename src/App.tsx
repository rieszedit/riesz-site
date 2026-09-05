import {
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  Languages,
  Mail,
  Play,
  Send,
  X,
} from 'lucide-react'
import type { ChangeEvent, ReactNode } from 'react'
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
  businessProjectFileOptions,
  illustrationStatusOptions,
  materialOptions,
  ndaOptions,
  personalPortfolioOptions,
  personalRequestTypeOptions,
  personalSetupOptions,
  preferredPlanOptions,
  projectFileOptions,
  roughAssetStartOptions,
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
import { contactEmail } from './contact-delivery'
import { useContactDelivery } from './use-contact-delivery'
import type { SubmitStatus } from './use-contact-delivery'
import { ContactChallenge } from './ContactChallenge'
import { turnstileSiteKey } from './turnstile-config'
import { PrivacyPage } from './PrivacyPage'

type Lang = Language
type Page = 'personal' | 'business' | 'privacy'
type WorkContactPreset = {
  title: string
  titleEn: string
  plan: string
  budgetJa: string
  budgetEn: string
  workUrl: string
}

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
    document.title =
      page === 'privacy'
        ? lang === 'ja'
          ? 'プライバシー | Riesz'
          : 'Privacy | Riesz'
        : isBusiness
          ? lang === 'ja'
            ? 'Riesz for Business | MV / Design / Direction'
            : 'Riesz for Business | Music Video / Design / Direction'
          : lang === 'ja'
            ? 'Riesz | MV / Design / Direction'
            : 'Riesz | Music Video / Design / Direction'
  }, [isBusiness, lang, page])

  useEffect(() => {
    if (!location.hash) return
    let cancelled = false
    const navigate = () => {
      if (cancelled) return
      let id: string
      try {
        id = decodeURIComponent(location.hash.slice(1))
      } catch {
        return
      }
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
    const stop = () => {
      cancelled = true
    }
    const frame = requestAnimationFrame(navigate)
    void document.fonts.ready.then(navigate)
    window.addEventListener('wheel', stop, { once: true, passive: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    window.addEventListener('keydown', stop, { once: true })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [page])

  return (
    <div className="site-shell">
      <AnalyticsBeacon />
      <Header lang={lang} setLang={setLang} page={page} />
      {page === 'privacy' ? (
        <PrivacyPage lang={lang} />
      ) : isBusiness ? (
        <BusinessPage lang={lang} />
      ) : (
        <PersonalPage lang={lang} />
      )}
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
  if (root?.dataset.page === 'privacy') return 'privacy'
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
        <a href={page !== 'personal' ? '/#works' : '#works'}>Works</a>
        <a href={page !== 'personal' ? '/#pricing' : '#pricing'}>Pricing</a>
        <a href="/business/">Business</a>
        <a
          className="contact-pill"
          href={page === 'privacy' ? '/#contact' : '#contact'}
        >
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
      <PricingSection
        lang={lang}
        onPlanSelect={(name) =>
          setWorkContactPreset({
            title: name,
            titleEn: name,
            workUrl: '',
            ...getWorkScalePreset(
              name.startsWith('Hybrid')
                ? [name]
                : [name.endsWith('Standard') ? 'Standard' : 'Flagship'],
            ),
          })
        }
      />
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
            {lang === 'ja' ? (
              <>
                <span>法人・企業</span>
                <span>案件のご相談</span>
              </>
            ) : (
              'Business and Corporate Projects'
            )}
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
          {isJapanese
            ? '法人・大型IPの公開実績'
            : 'Public Corporate and Major-IP Work'}
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
                className={
                  work.compactTitle
                    ? 'work-title work-title--compact'
                    : 'work-title'
                }
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
                onClick={() =>
                  onWorkContactSelect(createWorkContactPreset(work))
                }
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

function PricingSection({
  lang,
  onPlanSelect,
}: {
  lang: Lang
  onPlanSelect: (name: string) => void
}) {
  const isJapanese = lang === 'ja'

  return (
    <section className="content-section" id="pricing">
      <div className="section-heading">
        <p>Price Guide</p>
        <h2>{isJapanese ? '制作プラン' : 'Plans'}</h2>
      </div>
      <p className="pricing-lead">
        {isJapanese
          ? '制作体制と演出の作り込み量から選べる、個人向けの料金目安です。最終金額は楽曲尺、素材状況、納期、表現量によってお見積もりします。太字は税別、下段は税込目安です。'
          : 'Indicative prices for individual commissions, grouped by production team and creative scope. Final estimates depend on song length, assets, timeline, and visual complexity. Bold prices are before tax; totals including tax appear below.'}
      </p>

      <ol
        className="pricing-steps"
        aria-label={isJapanese ? 'プランの選び方' : 'How to choose a plan'}
      >
        <li>
          <span>01</span>
          <div>
            <strong>
              {isJapanese ? '制作体制を選ぶ' : 'Choose the production team'}
            </strong>
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
            <strong>
              {isJapanese ? '作り込み量を選ぶ' : 'Choose the development level'}
            </strong>
            <p>
              {isJapanese
                ? 'Standardは通常規模、Flagshipは代表作向けの高密度制作'
                : 'Standard for regular scope, Flagship for high-density representative work'}
            </p>
          </div>
        </li>
      </ol>

      <div
        className="pricing-comparison"
        role="region"
        aria-label={isJapanese ? 'プラン比較' : 'Plan comparison'}
        tabIndex={0}
      >
        <table>
          <caption>
            {isJapanese
              ? '映像はどちらもRieszが主導。リリック担当と演出の作り込み量で選べます。'
              : 'Both routes are led by Riesz. Choose the lyric designer and production scope.'}
          </caption>
          <thead>
            <tr>
              <th scope="col">{isJapanese ? '制作規模' : 'Scope'}</th>
              <th scope="col">Riesz Main</th>
              <th scope="col">Hybrid</th>
            </tr>
          </thead>
          <tbody>
            {['standard', 'flagship'].map((id) => (
              <tr key={id}>
                <th scope="row">
                  {id === 'standard' ? 'Standard' : 'Flagship'}
                </th>
                {pricingRoutes.map((route) => {
                  const tier = route.tiers.find((item) => item.id === id)!
                  return (
                    <td key={route.id}>
                      <a href={`#tier-${route.id}-${id}`}>
                        {isJapanese ? tier.priceJa : tier.priceEn}
                      </a>
                      <small>
                        {isJapanese
                          ? `税込${tier.priceWithTax.toLocaleString('ja-JP')}円〜`
                          : `JPY ${tier.priceWithTax.toLocaleString('en-US')} incl. 10% tax`}
                      </small>
                    </td>
                  )
                })}
              </tr>
            ))}
            <tr>
              <th scope="row">{isJapanese ? 'リリック' : 'Lyrics'}</th>
              <td>Riesz</td>
              <td>{isJapanese ? '専門クリエイター' : 'Lyric specialist'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="pricing-scope">
        {isJapanese
          ? 'Standardは支給素材を活かして曲の見せ場を構成。Flagshipはシーンごとの個別デザインや展開を増やします。新規イラスト・3D素材、別尺版、サムネイル制作は内容に応じて別途見積もり。納品形式・解像度・素材範囲は見積書で確定します。'
          : 'Standard focuses on song highlights using supplied assets. Flagship adds bespoke scene designs and transitions. New illustrations, 3D assets, alternate cuts, and thumbnails are quoted separately where needed. Delivery format, resolution, and asset scope are confirmed in the quote.'}
      </p>
      <div className="pricing-routes">
        {pricingRoutes.map((route) => (
          <section
            className={`pricing-route pricing-route--${route.id}`}
            key={route.id}
          >
            <header className="pricing-route__header">
              <span>{isJapanese ? route.labelJa : route.labelEn}</span>
              <h3>{route.name}</h3>
              <p>{isJapanese ? route.introJa : route.introEn}</p>
            </header>

            <div className="pricing-route__tiers">
              {route.tiers.map((tier) => (
                <article
                  className="pricing-tier"
                  id={`tier-${route.id}-${tier.id}`}
                  key={tier.name}
                >
                  <div className="pricing-tier__heading">
                    <div>
                      <span>
                        {tier.id === 'standard' ? 'Standard' : 'Flagship'}
                      </span>
                      <h4>{tier.name}</h4>
                    </div>
                    <div className="pricing-tier__price">
                      <strong>
                        {isJapanese ? tier.priceJa : tier.priceEn}
                      </strong>
                      <small>
                        {isJapanese
                          ? `税込${tier.priceWithTax.toLocaleString('ja-JP')}円〜`
                          : `JPY ${tier.priceWithTax.toLocaleString('en-US')} incl. 10% tax`}
                      </small>
                    </div>
                  </div>

                  <p className="pricing-tier__summary">
                    {isJapanese ? tier.summaryJa : tier.summaryEn}
                  </p>

                  <dl className="pricing-tier__details">
                    <div>
                      <dt>{isJapanese ? '制作' : 'Production'}</dt>
                      <dd>
                        {isJapanese ? tier.productionJa : tier.productionEn}
                      </dd>
                    </div>
                    <div>
                      <dt>{isJapanese ? 'リリック' : 'Lyric design'}</dt>
                      <dd>{isJapanese ? tier.lyricJa : tier.lyricEn}</dd>
                    </div>
                    <div>
                      <dt>{isJapanese ? '作り込み' : 'Development'}</dt>
                      <dd>
                        {isJapanese ? tier.developmentJa : tier.developmentEn}
                      </dd>
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
                  <a
                    className="plan-contact-link"
                    href="#contact"
                    onClick={() => onPlanSelect(tier.name)}
                  >
                    <Send size={15} aria-hidden="true" />
                    {isJapanese ? 'このプランで相談' : 'Ask about this plan'}
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
            {isJapanese
              ? '予算・用途から相談する'
              : 'Choose by budget or format'}
          </h3>
        </header>
        <div className="support-plan-grid">
          {supportPlans.map((plan) => (
            <article className="support-plan" key={plan.id}>
              <div className="support-plan__heading">
                <h4>{plan.name}</h4>
                <div className="pricing-tier__price">
                  <strong>{isJapanese ? plan.priceJa : plan.priceEn}</strong>
                  <small>{isJapanese ? plan.taxJa : plan.taxEn}</small>
                </div>
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

function IllustrationScheduleFields({ lang }: { lang: Lang }) {
  const [illustrationStatus, setIllustrationStatus] = useState('')
  const needsFinalArtwork = ['ラフ段階', '制作中'].includes(illustrationStatus)
  return (
    <>
      <div className="form-row">
        <Select
          lang={lang}
          label={lang === 'ja' ? 'イラストの進行状況' : 'Illustration status'}
          name="illustration_status"
          options={illustrationStatusOptions}
          value={illustrationStatus}
          onValueChange={setIllustrationStatus}
        />
        {needsFinalArtwork && (
          <Field
            label={
              lang === 'ja'
                ? '清書イラスト提出予定日'
                : 'Expected final artwork date'
            }
            name="final_illustration_date"
            helper={
              lang === 'ja'
                ? '未定・対象外の場合は空欄で問題ありません。'
                : 'Leave blank if TBD or not applicable.'
            }
          />
        )}
      </div>
      {needsFinalArtwork && (
        <Select
          lang={lang}
          label={
            lang === 'ja'
              ? 'ラフ素材での先行進行'
              : 'Starting from rough artwork'
          }
          name="rough_asset_start"
          options={roughAssetStartOptions}
          helper={
            lang === 'ja'
              ? '清書受領後の本制作が基本です。ラフ先行は +30,000円〜（税込33,000円〜）。条件と費用は見積もり時に再確認します。'
              : 'Final production normally starts after final artwork is received. Rough-art starts are +JPY 30,000 before tax (JPY 33,000 incl. tax). Conditions and fees are reconfirmed in the quote.'
          }
        />
      )}
    </>
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
  const [preferredPlan, setPreferredPlan] = useState('')
  const [budget, setBudget] = useState('')

  const resetControlledFields = () => {
    setPreferredPlan('')
    setBudget('')
    onClearWorkContactPreset()
  }
  const delivery = useContactDelivery('personal', resetControlledFields)
  const clearDeliveryStatus = delivery.onInput
  useEffect(() => {
    if (!workContactPreset) return
    setPreferredPlan(workContactPreset.plan)
    setBudget(workContactPreset.budgetJa)
    clearDeliveryStatus()
  }, [workContactPreset, clearDeliveryStatus])

  return (
    <section className="contact-section" id="contact">
      <ContactIntro lang={lang} business={false} />
      <form
        action={formEndpoints.personal}
        method="POST"
        className="contact-form"
        ref={delivery.formRef}
        onInput={delivery.onInput}
        onSubmit={delivery.onSubmit}
      >
        <fieldset
          className="contact-form__body"
          disabled={delivery.status === 'submitting'}
        >
          <input type="hidden" name="_subject" value="[Riesz 個人依頼]" />
          {workContactPreset && (
            <>
              {workContactPreset.workUrl && (
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
                </>
              )}
              <div className="contact-preset">
                <div className="contact-preset__header">
                  <p role="status" aria-live="polite">
                    {lang === 'ja'
                      ? workContactPreset.workUrl
                        ? `「${workContactPreset.title}」に近い規模で相談中`
                        : `${workContactPreset.plan}で相談中`
                      : workContactPreset.workUrl
                        ? `Using ${workContactPreset.titleEn} as the Riesz work reference`
                        : `Selected plan: ${workContactPreset.plan}`}
                  </p>
                  <button
                    className="contact-preset__clear"
                    type="button"
                    onClick={onClearWorkContactPreset}
                  >
                    <X size={15} aria-hidden="true" />
                    {lang === 'ja' ? '選択を解除' : 'Clear selection'}
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
            <Field
              label={lang === 'ja' ? '名前 / 活動名' : 'Name / Artist name'}
              name="name"
              required
            />
            <Field
              label={lang === 'ja' ? 'メールアドレス' : 'Email'}
              name="email"
              type="email"
              required
            />
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
              value={preferredPlan}
              onValueChange={setPreferredPlan}
            />
            <Select
              lang={lang}
              label={
                lang === 'ja' ? '予算帯（税別）' : 'Budget range (before tax)'
              }
              name="budget"
              options={budgetOptions}
              required
              value={budget}
              onValueChange={setBudget}
            />
            <Field
              label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'}
              name="delivery_date"
              helper={
                lang === 'ja'
                  ? '未定の場合は「未定」で構いません。'
                  : 'TBD is fine if not decided.'
              }
              required
            />
            <TextArea
              label={
                lang === 'ja'
                  ? '案件概要・希望する映像'
                  : 'Project summary / desired movie'
              }
              name="message"
              required
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
                  ? 'お客様がお持ちの参考映像があれば、URLを1行ずつご記入ください。'
                  : 'Your own reference videos, one URL per line, if available.'
              }
            />
          </FormSection>

          <details className="form-optional">
            <summary>
              {lang === 'ja'
                ? '素材・公開予定・制作条件（任意）'
                : 'Materials, release and production details (optional)'}
            </summary>
            <FormSection
              id="personal-schedule"
              number="03"
              title={lang === 'ja' ? '納期・素材' : 'Schedule & Materials'}
              subtitle={
                lang === 'ja'
                  ? 'Schedule & Materials'
                  : 'Timing and source files'
              }
            >
              <div className="form-row">
                <Field label="Discord ID" name="discord" />
                <Field label="X ID" name="x_id" />
              </div>
              <div className="form-row">
                <Field
                  label={lang === 'ja' ? '公開予定日' : 'Planned release date'}
                  name="release_date"
                />
              </div>
              <Select
                lang={lang}
                label={lang === 'ja' ? '楽曲尺' : 'Song length'}
                name="song_length"
                options={songLengthOptions}
              />
              <CheckboxGroup
                lang={lang}
                label={lang === 'ja' ? '素材状況' : 'Available materials'}
                name="materials"
                options={materialOptions}
              />
              <IllustrationScheduleFields
                lang={lang}
                key={delivery.resetVersion}
              />
              <Field
                label={lang === 'ja' ? '素材URL' : 'Material URL'}
                name="material_url"
              />
            </FormSection>

            <FormSection
              id="personal-terms"
              number="04"
              title={lang === 'ja' ? '制作条件' : 'Production Terms'}
              subtitle={
                lang === 'ja' ? 'Production Terms' : 'Ownership and delivery'
              }
            >
              <Select
                lang={lang}
                label={lang === 'ja' ? '制作体制の希望' : 'Production setup'}
                name="production_setup"
                options={personalSetupOptions}
                helper={
                  lang === 'ja'
                    ? '未選択は外注への同意ではありません。参加者と担当範囲は契約前に確認します。'
                    : 'Leaving this blank is not consent to outsourcing. Collaborators and scope are confirmed before commissioning.'
                }
              />
              <Select
                lang={lang}
                label={
                  lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'
                }
                name="portfolio_visibility"
                options={personalPortfolioOptions}
                helper={
                  lang === 'ja'
                    ? '非公開は税別+100,000円〜（税込110,000円〜）。掲載範囲と公開時期は契約前に確認します。'
                    : 'Private work: +JPY 100,000 before tax (JPY 110,000 incl. tax). Publication scope and timing are confirmed before commissioning.'
                }
              />
              <Select
                lang={lang}
                label={
                  lang === 'ja'
                    ? 'プロジェクトファイル納品'
                    : 'Project file delivery'
                }
                name="project_file"
                options={projectFileOptions}
                helper={
                  lang === 'ja'
                    ? '納品は税別+200,000円〜（税込220,000円〜）。第三者素材の制限と納品範囲を事前に確認します。'
                    : 'Delivery: +JPY 200,000 before tax (JPY 220,000 incl. tax). Third-party restrictions and deliverables are confirmed in advance.'
                }
              />
            </FormSection>
          </details>
          <ContactActions lang={lang} delivery={delivery} />
        </fieldset>
      </form>
    </section>
  )
}

function BusinessContact({ lang }: { lang: Lang }) {
  const delivery = useContactDelivery('business')

  return (
    <section className="contact-section" id="contact">
      <ContactIntro lang={lang} business />
      <form
        action={formEndpoints.business}
        method="POST"
        className="contact-form"
        ref={delivery.formRef}
        onInput={delivery.onInput}
        onSubmit={delivery.onSubmit}
      >
        <fieldset
          className="contact-form__body"
          disabled={delivery.status === 'submitting'}
        >
          <input type="hidden" name="_subject" value="[Riesz 法人依頼]" />
          <FormSection
            id="business-contact"
            number="01"
            title={lang === 'ja' ? 'ご連絡先' : 'Contact'}
            subtitle={lang === 'ja' ? 'Contact' : 'Company details'}
          >
            <div className="form-row">
              <Field
                label={lang === 'ja' ? '会社名' : 'Company'}
                name="company"
                required
              />
              <Field
                label={lang === 'ja' ? '担当者名' : 'Contact person'}
                name="name"
                required
              />
            </div>
            <div className="form-row">
              <Field
                label={lang === 'ja' ? 'メールアドレス' : 'Email'}
                name="email"
                type="email"
                required
              />
              <Field
                label={lang === 'ja' ? '会社サイトURL' : 'Company website'}
                name="company_url"
              />
            </div>
          </FormSection>

          <FormSection
            id="business-project"
            number="02"
            title={lang === 'ja' ? '案件概要' : 'Project'}
            subtitle={lang === 'ja' ? 'Project' : 'Scope and release'}
          >
            <TextArea
              label={lang === 'ja' ? '案件概要' : 'Project summary'}
              name="project_summary"
              required
            />
            <Field
              label={lang === 'ja' ? '希望納期' : 'Preferred delivery date'}
              name="delivery_date"
              helper={
                lang === 'ja'
                  ? '未定の場合は「未定」で構いません。'
                  : 'TBD is fine if not decided.'
              }
              required
            />
            <Field
              label={
                lang === 'ja' ? '予算感（税別）' : 'Budget range (before tax)'
              }
              name="budget"
            />
            <TextArea
              label={lang === 'ja' ? '参考資料URL' : 'Reference material URLs'}
              name="references"
            />
          </FormSection>
          <details className="form-optional">
            <summary>
              {lang === 'ja'
                ? '素材・使用範囲・契約条件（任意）'
                : 'Materials, usage and contract details (optional)'}
            </summary>
            <FormSection
              id="business-schedule"
              number="03"
              title={lang === 'ja' ? '納期・素材' : 'Schedule & Materials'}
              subtitle={
                lang === 'ja' ? 'Schedule & Materials' : 'Timing and assets'
              }
            >
              <div className="form-row">
                <Field
                  label={lang === 'ja' ? '使用範囲' : 'Usage scope'}
                  name="usage_scope"
                />
                <Field
                  label={lang === 'ja' ? '公開媒体' : 'Release media'}
                  name="media"
                />
              </div>
              <div className="form-row">
                <Field
                  label={lang === 'ja' ? '公開予定日' : 'Planned release date'}
                  name="release_date"
                />
              </div>
              <IllustrationScheduleFields
                lang={lang}
                key={delivery.resetVersion}
              />
              <div className="form-row">
                <Field
                  label={lang === 'ja' ? '素材URL' : 'Material URL'}
                  name="material_url"
                />
              </div>
            </FormSection>

            <FormSection
              id="business-terms"
              number="04"
              title={lang === 'ja' ? '契約・制作条件' : 'Contract & Production'}
              subtitle={
                lang === 'ja'
                  ? 'Contract & Production'
                  : 'Approval, payment, and delivery'
              }
            >
              <div className="form-row">
                <Select
                  lang={lang}
                  label={
                    lang === 'ja' ? '実績掲載の可否' : 'Portfolio visibility'
                  }
                  name="portfolio_visibility"
                  options={businessPortfolioOptions}
                />
                <Select
                  lang={lang}
                  label={
                    lang === 'ja' ? 'NDA / 契約書の有無' : 'NDA / Contract'
                  }
                  name="nda_contract"
                  options={ndaOptions}
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
              />
              <Field
                label={
                  lang === 'ja' ? '請求書払い条件' : 'Invoice payment terms'
                }
                name="payment_terms"
              />
              <Select
                lang={lang}
                label={
                  lang === 'ja'
                    ? 'プロジェクトファイル納品'
                    : 'Project file delivery'
                }
                name="project_file"
                options={businessProjectFileOptions}
              />
              <TextArea
                label={lang === 'ja' ? 'その他' : 'Additional notes'}
                name="message"
              />
            </FormSection>
          </details>
          <ContactActions lang={lang} delivery={delivery} business />
        </fieldset>
      </form>
    </section>
  )
}

function ContactActions({
  lang,
  delivery,
  business = false,
}: {
  lang: Lang
  delivery: ReturnType<typeof useContactDelivery>
  business?: boolean
}) {
  const [verified, setVerified] = useState(false)
  const pending = delivery.status === 'submitting'
  return (
    <div className="contact-actions">
      <p className="contact-consent">
        {lang === 'ja'
          ? '相談は無料です。送信だけで発注は確定しません。'
          : 'Inquiries are free. Submitting this form does not place an order.'}{' '}
        <a href="/privacy/" target="_blank" rel="noreferrer">
          {lang === 'ja' ? '個人情報の取り扱い' : 'Privacy policy'}
        </a>
      </p>
      <ContactChallenge
        lang={lang}
        reset={delivery.challengeReset}
        onReady={setVerified}
      />
      <button
        className="submit-button"
        type="submit"
        disabled={pending || Boolean(turnstileSiteKey && !verified)}
      >
        <Mail size={17} aria-hidden="true" />
        {pending
          ? lang === 'ja'
            ? '送信中'
            : 'Sending'
          : lang === 'ja'
            ? business
              ? '法人案件を相談する'
              : '見積もり相談を送る'
            : business
              ? 'Send Business Inquiry'
              : 'Send Estimate Request'}
      </button>
      <ContactSubmitStatus lang={lang} status={delivery.status} />
      {delivery.receipt && (
        <p className="receipt-id">
          {lang === 'ja' ? 'お問い合わせ番号' : 'Inquiry reference'}:{' '}
          {delivery.receipt.id}
        </p>
      )}
      <div className="contact-fallback">
        <button type="button" onClick={delivery.copy} disabled={pending}>
          <Copy size={16} aria-hidden="true" />
          {delivery.copyState === 'copied'
            ? lang === 'ja'
              ? 'コピーしました'
              : 'Copied'
            : lang === 'ja'
              ? '相談内容をコピー'
              : 'Copy inquiry'}
        </button>
        <a href={`mailto:${contactEmail}`} onClick={delivery.email}>
          <Mail size={16} aria-hidden="true" />
          {lang === 'ja' ? 'メールで送る' : 'Send by email'}
        </a>
      </div>
      {delivery.copyState === 'manual' && (
        <label className="field">
          {lang === 'ja'
            ? '相談内容（選択してコピー）'
            : 'Inquiry (select to copy)'}
          <textarea
            readOnly
            rows={8}
            value={delivery.manualCopy}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
      <p className="contact-consent">
        {lang === 'ja'
          ? '送信が難しい場合は、内容をコピーして rieszedit@gmail.com にお送りください。'
          : 'If the form is unavailable, copy your inquiry and email rieszedit@gmail.com.'}
      </p>
    </div>
  )
}

function ContactSubmitStatus({
  lang,
  status,
}: {
  lang: Lang
  status: SubmitStatus
}) {
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
          ? `相談を受け付けました。内容を確認し、通常3日以内に返信します。3日以内に返信がない場合は ${contactEmail} へ直接ご連絡ください。`
          : `Request received. I will review the details and usually reply within 3 days. If you do not receive a reply within that time, please contact ${contactEmail} directly.`
        : status === 'unknown'
          ? lang === 'ja'
            ? '通信が中断され、受付結果を確認できませんでした。二重送信を避けるため、下のメールからお問い合わせ番号を添えて受付確認をご依頼ください。入力内容は残っています。'
            : 'The connection ended before receipt could be confirmed. To avoid duplicates, use the email option below and include your inquiry reference to check receipt. Your input is preserved.'
          : lang === 'ja'
            ? `送信できませんでした。お手数ですが ${contactEmail} へ直接ご連絡ください。`
            : `Could not send the form. Please contact ${contactEmail} directly.`

  return (
    <p
      className={`form-status form-status--${status}`}
      role={status === 'error' || status === 'unknown' ? 'alert' : 'status'}
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
            : 'I usually reply within 3 days. Follow-up questions may be needed depending on the project.'}
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
        <option value="" disabled={required}>
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
        <a href="/privacy/">{lang === 'ja' ? 'プライバシー' : 'Privacy'}</a>
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
