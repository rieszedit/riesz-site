import { ArrowDown, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { AvailabilityPanel } from './AvailabilityPanel'
import type { Language } from './language-preference'
import './WebsitePage.css'

const copy = {
  ja: {
    title: 'Webサイト制作',
    lead: 'ポートフォリオ、店舗・企業サイト、LP、リニューアルのご相談をお受けしています。目的と必要なページ・機能、公開後の運用を伺い、案件ごとにお見積もりします。',
    inquire: 'Web制作を相談する',
    works: '制作実績',
    visit: '公開サイトを見る',
    newTab: '新しいタブで開きます',
    portfolio: 'ポートフォリオサイト',
    services: 'ご相談いただける内容',
    serviceItems: [
      ['ポートフォリオ', '作品・活動紹介、プロフィール、お問い合わせなど。掲載内容と更新方法を整理します。'],
      ['店舗・企業サイト', '店舗・事業紹介、アクセス、お知らせなど。必要な情報と来訪者の導線を検討します。'],
      ['LP', 'サービス・商品・企画の紹介ページ。掲載情報とお問い合わせなどの目的に合わせて構成を検討します。'],
      ['リニューアル', '既存サイトの構成・デザインの見直し。現在の環境と、残す内容・移行する内容を確認します。'],
    ],
    scope: '予約サービスなどへの外部リンクと、独自の予約・決済・会員機能や外部システム連携は別の範囲です。CMS、多言語化、データ移行なども、必要な内容を確認して個別にお見積もりします。',
    quote: 'お見積もりと公開後の費用',
    quoteLead: '制作費と公開後の費用は分けてご案内します。ページ数、機能、素材の準備状況、更新の頻度などを確認して、対応範囲を決めます。',
    costItems: [
      ['初期制作', '構成・デザイン・実装・公開準備など、今回の制作範囲をお見積もりします。素材制作や移行、修正回数を含め、含まれる作業を事前に確認します。'],
      ['サーバー・ドメイン等', 'サーバー、ドメイン、サイト作成サービスなどの継続費用は制作費と別です。利用先・契約内容に応じて、費用と支払い先をご案内します。'],
      ['技術保守', '納品内容に起因する不具合の対応条件・期間は、初期のお見積もりで明記します。継続的な運用支援や公開後の環境変化への対応は、内容を確認して別途お見積もりします。'],
      ['コンテンツの更新代行', 'お知らせ、画像、掲載情報などの更新。ご自身で更新する範囲と、代行する内容・頻度を分けてお見積もりします。'],
    ],
    accountsTitle: 'アカウントはお客様が管理できる形に',
    accounts: 'ドメインや利用サービスは、お客様が管理できるアカウントでの契約を基本に検討します。契約名義、更新・支払いの担当、制作側に付与する権限、引き継ぐ内容を事前に確認します。',
    prepare: 'ご相談時にわかる範囲で',
    prepareItems: [
      'サイトの用途、必要なページ・機能',
      '公開希望時期とご予算',
      '原稿・画像などの準備状況、参考サイト',
      '既存サイトのURLと、公開後の更新担当',
    ],
    prepareNote: '未定の項目は、そのままご相談ください。制作範囲・費用・スケジュールは、内容を確認してからご案内します。',
  },
  en: {
    title: 'Website Design',
    lead: 'Inquiries are welcome for portfolios, business websites, landing pages and redesigns. Each project is quoted individually after discussing its purpose, pages, features and ongoing operation.',
    inquire: 'Discuss a website project',
    works: 'Selected Websites',
    visit: 'Visit live site',
    newTab: 'opens in a new tab',
    portfolio: 'Portfolio website',
    services: 'Project Types',
    serviceItems: [
      ['Portfolios', 'Work, activities, profiles and contact details. We discuss what to include and how it will be updated.'],
      ['Business websites', 'Store or company information, directions and news. We consider the information visitors need and how they will find it.'],
      ['Landing pages', 'A page for a service, product or campaign. We discuss its content and intended action, such as an inquiry.'],
      ['Redesigns', 'Revisiting an existing site’s structure and design. We review the current setup and what needs to be retained or migrated.'],
    ],
    scope: 'Links to external booking services are a different scope from custom booking, payment, membership features or system integrations. CMS setup, multilingual content and data migration are also assessed and quoted individually.',
    quote: 'Estimates & Ongoing Costs',
    quoteLead: 'The initial build and ongoing costs are presented separately. Scope is agreed after reviewing the pages, features, available materials and expected update frequency.',
    costItems: [
      ['Initial build', 'A quote for the agreed structure, design, implementation and launch preparation. Included work, asset production, migration and revision rounds are confirmed in advance.'],
      ['Hosting & domain', 'Recurring hosting, domain and site-platform charges are separate from the build. Costs and who receives each payment are clarified based on the chosen services and contracts.'],
      ['Technical maintenance', 'Terms and the support period for defects in the delivered work are stated in the initial estimate. Ongoing operational support and changes to the hosting or software environment are scoped and quoted separately.'],
      ['Content updates', 'Updates to news, images and other published information. Client-managed updates and commissioned changes are scoped separately, including their frequency.'],
    ],
    accountsTitle: 'Client-controlled accounts',
    accounts: 'The starting point is to register domains and services under accounts you can control. Account ownership, renewal and payment responsibilities, access granted to the creator and handover contents are confirmed in advance.',
    prepare: 'Helpful Details for Your Inquiry',
    prepareItems: [
      'The site’s purpose, pages and required features',
      'Your target launch date and budget',
      'Available text and images, and reference sites',
      'Your current site URL and who will manage updates',
    ],
    prepareNote: 'You can leave undecided details open. Scope, costs and scheduling are confirmed after reviewing the project.',
  },
}

const projects = [
  {
    name: { ja: '慈（Utsumi）', en: 'Utsumi / 慈' },
    image: 'web-utsumi.jpg',
    url: 'https://utsumi.page/',
    domain: 'utsumi.page',
  },
  {
    name: { ja: 'やきほこ / YAKIHOKO', en: 'YAKIHOKO / やきほこ' },
    image: 'web-yakihoko.jpg',
    url: 'https://yakihoko.com/ja/',
    domain: 'yakihoko.com',
  },
]

export function WebsitePage({
  lang,
  children,
}: {
  lang: Language
  children: ReactNode
}) {
  const text = copy[lang]

  return (
    <main className="website-page">
      <header className="website-intro">
        <h1>{text.title}</h1>
        <p>{text.lead}</p>
        <a className="primary-button website-inquiry-link" href="#contact">
          {text.inquire}
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </header>

      <AvailabilityPanel lang={lang} />

      <section
        className="content-section website-section"
        id="web-works"
        aria-labelledby="web-works-title"
      >
        <h2 id="web-works-title">{text.works}</h2>
        <div className="website-projects">
          {projects.map((project) => (
            <article className="website-project" key={project.url}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name[lang]}: ${text.visit} (${text.newTab})`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}media/${project.image}`}
                  width={1440}
                  height={1000}
                  alt={
                    lang === 'ja'
                      ? `${project.name.ja}の公開Webサイトのスクリーンショット`
                      : `Screenshot of the live ${project.name.en} website`
                  }
                  loading="lazy"
                  decoding="async"
                />
                <div className="website-project__body">
                  <p className="website-project__type">{text.portfolio}</p>
                  <h3>{project.name[lang]}</h3>
                  <div className="website-project__link">
                    <span>{project.domain}</span>
                    <span>
                      {text.visit}
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section
        className="content-section website-section"
        aria-labelledby="web-services-title"
      >
        <h2 id="web-services-title">{text.services}</h2>
        <dl className="website-services">
          {text.serviceItems.map(([title, description]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
        <p className="website-scope-note">{text.scope}</p>
      </section>

      <section
        className="content-section website-section"
        aria-labelledby="web-quote-title"
      >
        <h2 id="web-quote-title">{text.quote}</h2>
        <p className="website-section__lead">{text.quoteLead}</p>
        <dl className="website-costs">
          {text.costItems.map(([title, description]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
        <div className="website-accounts">
          <h3>{text.accountsTitle}</h3>
          <p>{text.accounts}</p>
        </div>
      </section>

      <section
        className="content-section website-section website-preparation"
        aria-labelledby="web-prepare-title"
      >
        <h2 id="web-prepare-title">{text.prepare}</h2>
        <ul>
          {text.prepareItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p>{text.prepareNote}</p>
        <a className="secondary-button website-inquiry-link" href="#contact">
          {text.inquire}
          <ArrowDown size={17} aria-hidden="true" />
        </a>
      </section>

      {children}
    </main>
  )
}
