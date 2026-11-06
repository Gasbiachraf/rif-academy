import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarClock, Check, ChevronDown, ChevronRight, Clock, Gauge, Info, MonitorSmartphone, Repeat, Sun, UserRound } from 'lucide-react'
import { courseFormats, courseSchedules, courses, findCourse, imageSrc, imageSrcSet, type Course } from '../data/courses'
import { useI18n } from '../i18n'
import { formatDate, upcomingSessions } from '../lib/sessions'
import { whatsappLink } from '../lib/whatsapp'
import { CourseCard } from '../components/CourseCard'
import { CATEGORY_STYLES, CategoryIcon, LevelBadge, Price, WhatsAppIcon } from '../components/ui'
import { Faq } from './Home'
import { NotFound } from './NotFound'

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2 id={id} className="font-display text-2xl font-extrabold text-deep sm:text-[1.75rem]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function EnrollBox({ course }: { course: Course }) {
  const { t, lang, l, path } = useI18n()
  const sessions = upcomingSessions(course)
  const [selected, setSelected] = useState(sessions[0]?.id ?? '')

  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 shadow-pop">
      <p className="font-display text-xl font-extrabold text-deep">{t.course.asideTitle}</p>
      <div className="mt-4 rounded-2xl bg-mint-50 p-4">
        <Price course={course} size="lg" />
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-bold text-deep">{t.course.asideSession}</legend>
        <div className="space-y-2">
          {sessions.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 text-sm transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-2 ${
                selected === s.id ? 'border-teal bg-mint-50' : 'border-line hover:border-teal/40'
              }`}
            >
              <input type="radio" name="aside-session" value={s.id} checked={selected === s.id} onChange={() => setSelected(s.id)} className="mt-0.5 size-4 accent-teal" />
              <span>
                <span className="block font-bold text-deep first-letter:uppercase">{formatDate(s.date, lang)}</span>
                <span className="block text-muted">
                  <span dir="ltr">{s.time}</span> · {t.formats[s.format]}
                </span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{t.common.datesNote}</p>
      </fieldset>

      <Link to={path(`/inscription?formation=${course.slug}${selected ? `&session=${selected}` : ''}`)} className="btn-sun mt-5 w-full">
        {t.course.asideCta}
        <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
      </Link>
      <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted">
        <Info className="size-4 shrink-0 text-teal-2" aria-hidden="true" />
        {t.course.asideNote}
      </p>
      <div className="mt-5 border-t border-dashed border-line pt-4">
        <p className="text-sm font-semibold text-deep">{t.course.question}</p>
        <a
          href={whatsappLink(t.course.questionMessage(l(course.title)))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-[#177e41] underline underline-offset-4"
        >
          <WhatsAppIcon className="size-4" />
          {t.course.questionCta}
        </a>
      </div>
    </div>
  )
}

export function CourseDetail() {
  const { slug } = useParams()
  const { t, l, lang, path } = useI18n()
  const course = findCourse(slug)
  if (!course) return <NotFound />

  const sessions = upcomingSessions(course)
  const style = CATEGORY_STYLES[course.category]
  const related = courses.filter((c) => c.slug !== course.slug && c.category === course.category)
  const more = related.length ? related : courses.filter((c) => c.slug !== course.slug && c.featured)

  const facts = [
    { icon: Clock, label: t.course.duration, value: `${t.common.hours(course.hours)} · ${t.common.weeks(course.weeks)}` },
    { icon: Repeat, label: t.course.rhythm, value: l(course.rhythm) },
    { icon: Gauge, label: t.course.level, value: t.levels[course.level] },
    { icon: MonitorSmartphone, label: t.course.formats, value: courseFormats(course).map((f) => t.formats[f]).join(', ') },
    { icon: Sun, label: t.course.schedules, value: courseSchedules(course).map((s) => t.schedules[s]).join(', ') },
    { icon: UserRound, label: t.course.age, value: t.common.ageMin(course.ageMin) },
  ]

  return (
    <>
      <section className="bg-dots">
        <div className="container-x pt-6 pb-12 sm:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <li>
                <Link to={path('/formations')} className="font-semibold hover:text-teal">
                  {t.course.breadcrumb}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 rtl:rotate-180" />
              </li>
              <li>
                <Link to={path(`/formations?cat=${course.category}`)} className="font-semibold hover:text-teal">
                  {t.categories[course.category]}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-4 rtl:rotate-180" />
              </li>
              <li aria-current="page" className="truncate text-deep">
                {l(course.title)}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full py-1 ps-1 pe-3 text-xs font-bold ${style.tile}`}>
                  <span className={`grid size-6 place-items-center rounded-full ${style.icon}`}>
                    <CategoryIcon category={course.category} className="size-3.5" />
                  </span>
                  {t.categories[course.category]}
                </span>
                <LevelBadge level={course.level} />
              </div>
              <h1 className="font-display animate-pop mt-4 text-[2.3rem] leading-[1.05] font-extrabold tracking-[-0.025em] text-balance text-deep sm:text-5xl">
                {l(course.title)}
              </h1>
              <p className="animate-pop mt-4 max-w-2xl text-lg leading-relaxed text-muted [animation-delay:80ms]">{l(course.tagline)}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Price course={course} size="lg" />
                <a href="#reserver" className="btn-teal lg:hidden">
                  {t.course.asideCta}
                </a>
              </div>
            </div>
            <img
              src={imageSrc(course.image, 1200)}
              srcSet={imageSrcSet(course.image)}
              sizes="(min-width: 1024px) 480px, 100vw"
              alt={l(course.imageAlt)}
              width={1200}
              height={800}
              fetchPriority="high"
              className="aspect-[3/2] w-full rounded-[2.5rem] object-cover shadow-pop"
            />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-3xl border border-line bg-white p-4">
                <dt className="flex items-center gap-2 text-xs font-bold text-muted">
                  <Icon className="size-4 text-teal-2" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1.5 text-[15px] leading-snug font-bold text-deep">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_360px] lg:gap-14">
        <div className="min-w-0 space-y-14">
          <Block title={t.course.objectives} id="objectives">
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.objectives.map((o) => (
                <li key={o.fr} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sun text-deep">
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="leading-relaxed">{l(o)}</span>
                </li>
              ))}
            </ul>
          </Block>

          <Block title={t.course.program} id="program">
            <ol className="space-y-3">
              {course.modules.map((m, i) => (
                <li key={m.title.fr}>
                  <details className="group rounded-3xl border border-line bg-white open:shadow-card" open={i === 0}>
                    <summary className="flex cursor-pointer items-center gap-4 rounded-3xl p-4 sm:p-5">
                      <span className="font-display grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-lg font-extrabold text-teal">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-bold text-muted">{t.course.moduleN(i + 1)}</span>
                        <span className="block font-bold text-deep">{l(m.title)}</span>
                      </span>
                      <span className="chev grid size-8 shrink-0 place-items-center rounded-full bg-mint-50 text-teal transition">
                        <ChevronDown className="size-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="ps-[4.75rem] pe-5 pb-5 leading-relaxed text-muted sm:ps-[5.25rem]">{l(m.text)}</p>
                  </details>
                </li>
              ))}
            </ol>
          </Block>

          <div className="grid gap-6 sm:grid-cols-2">
            <Block title={t.course.prerequisites} id="prereq">
              <ul className="space-y-2.5">
                {course.prerequisites.map((p) => (
                  <li key={p.fr} className="flex gap-2.5 leading-relaxed">
                    <span className="mt-2.5 size-2 shrink-0 rounded-full bg-coral" aria-hidden="true" />
                    {l(p)}
                  </li>
                ))}
              </ul>
            </Block>
            <Block title={t.course.audience} id="audience">
              <ul className="space-y-2.5">
                {course.audience.map((a) => (
                  <li key={a.fr} className="flex gap-2.5 leading-relaxed">
                    <span className="mt-2.5 size-2 shrink-0 rounded-full bg-teal-2" aria-hidden="true" />
                    {l(a)}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <Block title={t.course.sessions} id="sessions">
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li key={s.id} className="flex flex-col gap-3 rounded-3xl bg-white p-4 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sun-soft text-deep">
                      <CalendarClock className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-bold text-deep first-letter:uppercase">{formatDate(s.date, lang)}</span>
                      <span className="block text-sm text-muted">
                        <span dir="ltr">{s.time}</span> · {t.schedules[s.schedule]} · {t.formats[s.format]} · {t.common.indicativeDate}
                      </span>
                    </span>
                  </p>
                  <Link to={path(`/inscription?formation=${course.slug}&session=${s.id}`)} className="btn-ghost min-h-11 shrink-0 px-5 text-sm text-teal">
                    {t.common.requestSeat}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted">{t.common.datesNote}</p>
          </Block>

          <Block title={t.course.fees} id="fees">
            <div className="rounded-3xl bg-sun-50 p-6 ring-1 ring-sun-soft">
              <Price course={course} size="lg" />
              <p className="mt-3 text-sm leading-relaxed text-ink/80">{t.common.priceNote}</p>
            </div>
          </Block>

          <Faq items={course.faq.map((f) => ({ q: l(f.q), a: l(f.a) }))} title={t.course.faq} />

          <p className="flex items-center gap-2 text-sm text-muted">
            <UserRound className="size-4 text-teal-2" aria-hidden="true" />
            {t.course.trainer}
          </p>
        </div>

        <aside id="reserver" className="scroll-mt-28" aria-label={t.course.asideTitle}>
          <div className="lg:sticky lg:top-28">
            <EnrollBox key={course.slug} course={course} />
          </div>
        </aside>
      </div>

      <section className="container-x pb-16" aria-labelledby="related-title">
        <h2 id="related-title" className="font-display text-2xl font-extrabold text-deep">
          {t.course.related}
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.slice(0, 3).map((c) => (
            <li key={c.slug}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
        <Link to={path('/formations')} className="link-u mt-8 inline-block">
          {t.course.back}
        </Link>
      </section>
    </>
  )
}
