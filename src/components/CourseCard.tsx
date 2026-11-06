import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { courseFormats, imageSrc, imageSrcSet, type Course } from '../data/courses'
import { useI18n } from '../i18n'
import { formatDate, upcomingSessions } from '../lib/sessions'
import { CATEGORY_STYLES, CategoryIcon, LevelBadge, Price } from './ui'

export function CourseCard({ course, headingLevel = 'h3' }: { course: Course; headingLevel?: 'h2' | 'h3' }) {
  const { t, l, lang, path } = useI18n()
  const next = upcomingSessions(course)[0]
  const Heading = headingLevel
  const style = CATEGORY_STYLES[course.category]

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-pop has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-teal-2">
      <div className="relative aspect-[3/2] overflow-hidden bg-mint">
        <img
          src={imageSrc(course.image)}
          srcSet={imageSrcSet(course.image)}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          alt={l(course.imageAlt)}
          width={640}
          height={427}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <span className={`absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full py-1 ps-1 pe-3 text-xs font-bold shadow-sm ${style.tile}`}>
          <span className={`grid size-6 place-items-center rounded-full ${style.icon}`}>
            <CategoryIcon category={course.category} className="size-3.5" />
          </span>
          {t.categories[course.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={course.level} />
          {courseFormats(course).map((f) => (
            <span key={f} className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">
              {t.formats[f]}
            </span>
          ))}
        </div>

        <Heading className="font-display mt-3 text-xl leading-snug font-bold text-deep">
          <Link to={path(`/formations/${course.slug}`)} className="outline-none after:absolute after:inset-0 after:content-['']">
            {l(course.title)}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{l(course.tagline)}</p>

        <dl className="mt-4 mb-5 grid gap-1.5 text-sm text-ink">
          <div className="flex items-center gap-2">
            <dt>
              <Clock className="size-4 text-teal-2" aria-hidden="true" />
              <span className="sr-only">{t.course.duration}</span>
            </dt>
            <dd>
              {t.common.hours(course.hours)} · {t.common.weeks(course.weeks)}
            </dd>
          </div>
          {next && (
            <div className="flex items-center gap-2">
              <dt>
                <CalendarDays className="size-4 text-teal-2" aria-hidden="true" />
                <span className="sr-only">{t.hero.nextLabel}</span>
              </dt>
              <dd>
                {formatDate(next.date, lang)} <span className="text-muted">({t.common.indicativeDate})</span>
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-line pt-4">
          <Price course={course} />
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun text-deep transition group-hover:bg-teal group-hover:text-white" aria-hidden="true">
            <ArrowRight className="size-5 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </article>
  )
}
