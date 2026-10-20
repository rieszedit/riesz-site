import { CalendarDays } from 'lucide-react'
import type { Language } from './language-preference'
import './AvailabilityPanel.css'

// Update this shared schedule when confirmed bookings change.
const schedule = [
  { ja: '2026年11月', en: 'Nov 2026', mark: '△', jaStatus: '要相談', enStatus: 'Limited' },
  { ja: '2026年12月', en: 'Dec 2026', mark: '○', jaStatus: '受付中', enStatus: 'Available' },
  { ja: '2027年1月以降', en: 'Jan 2027 onward', mark: '◎', jaStatus: '余裕あり', enStatus: 'Open' },
]
const updatedAt = '2026-10-20'

export function AvailabilityPanel({ lang }: { lang: Language }) {
  const ja = lang === 'ja'
  return (
    <aside className="availability" aria-label={ja ? '制作の受付状況' : 'Commission availability'}>
      <div className="availability__heading">
        <CalendarDays size={17} aria-hidden="true" />
        <strong>{ja ? 'ご相談受付中' : 'Open for inquiries'}</strong>
        <span>{ja ? '企業様優先' : 'Corporate priority'}</span>
      </div>
      <p className="availability__priority">
        {ja
          ? '現在、法人・企業様からのご依頼を優先してお受けしています。個人の方もお気軽にご相談ください。'
          : 'Corporate projects are currently prioritized. Individual clients are also welcome to get in touch.'}
      </p>
      <ul className="availability__months">
        {schedule.map((month) => (
          <li key={month.en}>
            <span>{month[lang]}</span>
            <strong>
              <span aria-hidden="true">{month.mark}</span>
              {ja ? month.jaStatus : month.enStatus}
            </strong>
          </li>
        ))}
      </ul>
      <p className="availability__note">
        {ja ? '着手時期・納期は内容に応じてご案内します。' : 'Start and delivery dates are confirmed based on scope.'}
        {' '}
        <span>{ja ? '更新：' : 'Updated: '}<time dateTime={updatedAt}>{updatedAt.replaceAll('-', '.')}</time></span>
      </p>
    </aside>
  )
}
