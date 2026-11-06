import { useEffect, useRef, type ReactNode } from 'react'
import { BarChart3, Languages, Laptop, Megaphone } from 'lucide-react'
import type { Category, Course, Level } from '../data/courses'
import { useI18n } from '../i18n'
import { formatPrice } from '../lib/sessions'

export function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43zm8.03-17.46A11.27 11.27 0 0 0 12.04.72C5.78.72.69 5.8.69 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.01-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.02z" />
    </svg>
  )
}

const CATEGORY_ICONS = { languages: Languages, it: Laptop, office: BarChart3, marketing: Megaphone }

/** Colour token per category: tile background + icon. */
export const CATEGORY_STYLES: Record<Category, { tile: string; icon: string }> = {
  languages: { tile: 'bg-mint text-teal', icon: 'bg-teal text-white' },
  it: { tile: 'bg-deep text-white', icon: 'bg-sun text-deep' },
  office: { tile: 'bg-sun-soft text-deep', icon: 'bg-deep text-sun' },
  marketing: { tile: 'bg-coral-soft text-[#7a2614]', icon: 'bg-coral text-white' },
}

export function CategoryIcon({ category, className = 'size-5' }: { category: Category; className?: string }) {
  const Icon = CATEGORY_ICONS[category]
  return <Icon className={className} strokeWidth={2} aria-hidden="true" />
}

const LEVEL_STYLES: Record<Level, { badge: string; bars: number }> = {
  beginner: { badge: 'bg-mint text-teal', bars: 1 },
  intermediate: { badge: 'bg-sun-soft text-[#6b4a00]', bars: 2 },
  advanced: { badge: 'bg-coral-soft text-[#8a2a14]', bars: 3 },
}

/** Level pill with a 3-bar signal, so the level reads without colour alone. */
export function LevelBadge({ level, className = '' }: { level: Level; className?: string }) {
  const { t } = useI18n()
  const style = LEVEL_STYLES[level]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge} ${className}`}>
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`w-[3px] rounded-full ${i <= style.bars ? 'bg-current' : 'bg-current/25'}`} style={{ height: 4 + i * 2 }} />
        ))}
      </span>
      {t.levels[level]}
    </span>
  )
}

export function Price({ course, size = 'md' }: { course: Course; size?: 'md' | 'lg' }) {
  const { t, lang } = useI18n()
  return (
    <p className="leading-tight">
      <span className="block text-xs font-semibold text-muted">{t.common.from}</span>
      <span className={`font-display font-extrabold text-deep ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
        {formatPrice(course.priceFrom, lang)} {t.common.currency}
      </span>{' '}
      <span className="text-sm font-semibold text-muted">{course.priceUnit === 'month' ? t.common.perMonth : t.common.perCourse}</span>
      <span className="ms-2 inline-block rounded-full border border-line px-2 py-0.5 align-middle text-[11px] font-bold tracking-wide text-muted uppercase rtl:tracking-normal">
        {t.common.indicative}
      </span>
    </p>
  )
}

/** Fades children in once they scroll into view (disabled by prefers-reduced-motion in CSS). */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  light = false,
  center = false,
  className = '',
  id,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  light?: boolean
  center?: boolean
  className?: string
  id?: string
}) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      <p className={`eyebrow ${light ? 'bg-white/10 text-sun' : ''}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`font-display mt-4 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.02em] text-balance sm:text-[2.6rem] ${light ? 'text-white' : 'text-deep'}`}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

/** Header band for inner pages. */
export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="bg-dots relative overflow-hidden">
      <div className="container-x pt-10 pb-10 sm:pt-14 sm:pb-14">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="font-display animate-pop mt-4 max-w-3xl text-[2.4rem] leading-[1.04] font-extrabold tracking-[-0.025em] text-balance text-deep sm:text-[3.4rem]">
          {title}
        </h1>
        {subtitle && <p className="animate-pop mt-4 max-w-2xl text-lg leading-relaxed text-muted [animation-delay:80ms]">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
