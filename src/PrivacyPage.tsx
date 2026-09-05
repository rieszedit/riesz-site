import type { Lang } from './commission-content'

const policy = [
  {
    ja: [
      '取得する情報と目的',
      'Rieszは、お名前・活動名、会社名、メールアドレス、ご相談内容、素材や参考資料のURLなど、送信いただいた情報を、お問い合わせへの返信、お見積もり、制作・契約・請求の連絡に使用します。不要な機密情報や、公開を許可されていない情報は初回のフォームに記載しないでください。',
    ],
    en: [
      'Information and purpose',
      'Riesz uses the name, company, email address, project details and reference or asset URLs you submit to reply, prepare estimates and communicate about production, contracts and billing. Please do not include unnecessary confidential information or information you are not permitted to share in the initial form.',
    ],
  },
  {
    ja: [
      '受付・保管と外部サービス',
      'フォームの受付・保管にはFormspree、メールの受信・返信にはGmailを使用します。送信された情報は、これらのサービスによって処理・保管されます。ボット対策にはCloudflare Turnstileを使用し、検証に必要なネットワーク・ブラウザ情報等がCloudflareで処理されます。各サービスは国外で情報を処理する場合があります。',
    ],
    en: [
      'Processing and service providers',
      'Formspree receives and stores form submissions, and Gmail is used for email correspondence. Submitted information is processed and stored by these services. Cloudflare Turnstile processes network and browser information needed for anti-bot verification. These providers may process information outside your country.',
    ],
  },
  {
    ja: [
      'アクセス解析',
      'Cloudflare Web Analyticsで訪問数・ページビュー・参照元・表示性能などの集計を確認します。問い合わせ本文やメールアドレスを解析へ送信する独自の処理は行っていません。問い合わせの途中離脱や個人単位の行動履歴を計測する追加サービスは使用していません。',
    ],
    en: [
      'Analytics',
      'Cloudflare Web Analytics provides aggregate visits, page views, referrers and loading-performance metrics. We do not send inquiry text or email addresses to analytics through custom tracking. No additional service tracks form abandonment or individual browsing histories.',
    ],
  },
  {
    ja: [
      '共有と保存期間',
      '協力クリエイターが参加する場合は、担当範囲と必要な情報の共有について事前に確認します。法令に基づく場合を除き、目的外の第三者提供は行いません。問い合わせ・契約対応に必要な期間、または法令上必要な期間保管し、不要になった情報は削除します。',
    ],
    en: [
      'Sharing and retention',
      'When a collaborator participates, their scope and the necessary information to be shared are confirmed in advance. Information is not provided to unrelated third parties except where legally required. It is retained as needed for inquiries, contracts and legal obligations, and deleted when no longer needed.',
    ],
  },
  {
    ja: [
      'お問い合わせ',
      'ご自身の情報の確認・訂正・削除などのお申し出は、rieszedit@gmail.comへご連絡ください。本人確認のうえ、法令上の義務や必要な契約対応を踏まえて対応します。',
    ],
    en: [
      'Contact',
      'To request access, correction or deletion of your information, contact rieszedit@gmail.com. Requests are handled after identity verification, subject to legal obligations and necessary contractual administration.',
    ],
  },
]

export function PrivacyPage({ lang }: { lang: Lang }) {
  return (
    <main className="privacy-page content-section">
      <p className="eyebrow">Privacy</p>
      <h1>{lang === 'ja' ? '個人情報の取り扱い' : 'Privacy Policy'}</h1>
      <p>
        {lang === 'ja'
          ? '運営者：Riesz / 更新日：2026年9月5日'
          : 'Operator: Riesz / Updated: September 5, 2026'}
      </p>
      {policy.map((item) => (
        <section key={item.en[0]}>
          <h2>{item[lang][0]}</h2>
          <p>{item[lang][1]}</p>
        </section>
      ))}
      <nav
        aria-label={
          lang === 'ja'
            ? '外部サービスのプライバシーポリシー'
            : 'Service privacy policies'
        }
      >
        <a
          href="https://formspree.io/legal/privacy-policy/"
          target="_blank"
          rel="noreferrer"
        >
          Formspree
        </a>
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
        >
          Google
        </a>
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noreferrer"
        >
          Cloudflare
        </a>
      </nav>
      <a className="direct-mail" href="mailto:rieszedit@gmail.com">
        rieszedit@gmail.com
      </a>
    </main>
  )
}
