import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronDown, Clock, Compass, Hammer, MapPin, MessagesSquare, Search, Users } from 'lucide-react'
import { CATEGORIES, courses } from '../data/courses'
import { useI18n } from '../i18n'
import { dateParts, formatDate, nextSessions } from '../lib/sessions'
import { whatsappLink } from '../lib/whatsapp'
import { CourseCard } from '../components/CourseCard'
import { CATEGORY_STYLES, CategoryIcon, Reveal, SectionHeading, WhatsAppIcon } from '../components/ui'

function Hero() {
  const { t, l, lang, path } = useI18n()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const next = nextSessions(undefined, 1)[0]

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(path(q.trim() ? `/formations?q=${encodeURIComponent(q.trim())}` : '/formations'))
  }

  return (
    <section className="bg-dots relative overflow-hidden">
      <div className="container-x grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-16 lg:pb-24">
        <div>
          <p className="eyebrow animate-pop">{t.hero.eyebrow}</p>
          <h1 className="font-display animate-pop mt-5 text-[2.75rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance text-deep [animation-delay:60ms] sm:text-6xl lg:text-[4.4rem]">
            {t.hero.titleA} <span className="hl">{t.hero.titleB}</span>
          </h1>
          <p className="animate-pop mt-6 max-w-xl text-lg leading-relaxed text-muted [animation-delay:120ms]">{t.hero.subtitle}</p>

          <form role="search" onSubmit={onSearch} className="animate-pop mt-8 max-w-xl [animation-delay:180ms]">
            <label htmlFor="hero-search" className="mb-2 block text-sm font-bold text-deep">
              {t.hero.searchLabel}
            </label>
            <div className="flex items-center gap-2 rounded-full border-2 border-line bg-white p-1.5 shadow-card focus-within:border-teal">
              <Search className="ms-3 size-5 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="hero-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted/70"
              />
              <button type="submit" className="btn-teal min-h-11 px-5">
                {t.hero.searchButton}
              </button>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{t.hero.popular}</span>
              {t.hero.popularTerms.map((term) => (
                <Link
                  key={term}
                  to={path(`/formations?q=${encodeURIComponent(term)}`)}
                  className="rounded-full bg-white px-3 py-1 font-semibold text-teal ring-1 ring-line transition hover:ring-teal"
                >
                  {term}
                </Link>
              ))}
            </p>
          </form>

          <div className="animate-pop mt-8 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Link to={path('/inscription')} className="btn-sun">
              {t.hero.primary}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link to={path('/formations')} className="btn-ghost text-deep">
              {t.hero.secondary}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="absolute -end-6 -top-6 size-40 rounded-full bg-sun sm:size-52" aria-hidden="true" />
          <div className="absolute -start-4 bottom-10 size-24 rounded-[2rem] bg-coral/90" aria-hidden="true" />
          <picture>
            <source media="(min-width: 1024px)" srcSet="/images/hero-1100.webp" />
            <img
              src="/images/hero-720.webp"
              alt=""
              width={720}
              height={860}
              fetchPriority="high"
              className="relative aspect-[6/7] w-full rounded-[2.5rem] object-cover shadow-pop"
            />
          </picture>

          {next && (
            <Link
              to={path(`/formations/${next.course.slug}`)}
              className="animate-float absolute -bottom-6 start-4 end-4 flex items-center gap-4 rounded-3xl border border-line bg-white p-4 shadow-pop transition hover:border-teal sm:start-auto sm:-end-4 sm:w-80"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-teal text-center leading-none text-white">
                <span>
                  <span className="font-display block text-xl font-extrabold">{dateParts(next.session.date, lang).day}</span>
                  <span className="block text-[11px] font-semibold uppercase">{dateParts(next.session.date, lang).month}</span>
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-teal-2">{t.hero.nextLabel}</span>
                <span className="block truncate font-bold text-deep">{l(next.course.title)}</span>
                <span className="block text-xs text-muted">
                  {t.schedules[next.session.schedule]} · {t.common.indicativeDate}
                </span>
              </span>
            </Link>
          )}

          <div className="absolute -top-4 start-4 hidden max-w-56 -rotate-3 rounded-2xl bg-deep p-4 text-white shadow-pop sm:block">
            <p className="font-display font-bold text-sun">{t.hero.stickerTitle}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/80">{t.hero.stickerText}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const { t, path } = useI18n()
  return (
    <section className="container-x py-16 sm:py-20" aria-labelledby="cat-title">
      <SectionHeading id="cat-title" eyebrow={t.home.categoriesEyebrow} title={t.home.categoriesTitle} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat, i) => {
          const style = CATEGORY_STYLES[cat]
          const n = courses.filter((c) => c.category === cat).length
          return (
            <Reveal as="li" key={cat} delay={i * 70}>
              <Link
                to={path(`/formations?cat=${cat}`)}
                className={`group flex h-full flex-col rounded-[2rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-pop ${style.tile}`}
              >
                <span className={`grid size-12 place-items-center rounded-2xl ${style.icon}`}>
                  <CategoryIcon category={cat} className="size-6" />
                </span>
                <span className="font-display mt-6 text-2xl font-extrabold">{t.categories[cat]}</span>
                <span className="mt-2 text-sm leading-relaxed opacity-85">{t.categoryText[cat]}</span>
                <span className="mt-6 flex items-center justify-between text-sm font-bold">
                  {t.home.coursesCount(n)}
                  <ArrowRight className="size-5 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}

function Featured() {
  const { t, path } = useI18n()
  return (
    <section className="container-x pb-16 sm:pb-20" aria-labelledby="featured-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="featured-title" eyebrow={t.home.featuredEyebrow} title={t.home.featuredTitle} />
        <Link to={path('/formations')} className="link-u">
          {t.home.featuredAll}
        </Link>
      </div>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses
          .filter((c) => c.featured)
          .map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 80}>
              <CourseCard course={c} />
            </Reveal>
          ))}
      </ul>
    </section>
  )
}

function Sessions() {
  const { t, l, lang, path } = useI18n()
  const list = nextSessions(undefined, 6)
  return (
    <section id="sessions" className="bg-mint-50 py-16 sm:py-20" aria-labelledby="sessions-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading id="sessions-title" eyebrow={t.home.sessionsEyebrow} title={t.home.sessionsTitle}>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t.home.sessionsText}</p>
          </SectionHeading>
          <p className="mt-6 flex gap-2 rounded-2xl bg-white p-4 text-sm text-muted ring-1 ring-line">
            <CalendarDays className="size-5 shrink-0 text-teal-2" aria-hidden="true" />
            {t.common.datesNote}
          </p>
        </div>
        <ol className="space-y-3">
          {list.map(({ course, session }, i) => {
            const d = dateParts(session.date, lang)
            return (
              <Reveal as="li" key={session.id + course.slug} delay={i * 50}>
                <div className="flex items-center gap-4 rounded-3xl bg-white p-3 pe-4 shadow-card ring-1 ring-line sm:gap-5">
                  <time
                    dateTime={session.id.slice(0, 10)}
                    className="grid size-16 shrink-0 place-items-center rounded-2xl bg-sun-soft text-center leading-none text-deep sm:size-[4.5rem]"
                  >
                    <span>
                      <span className="font-display block text-2xl font-extrabold">{d.day}</span>
                      <span className="block text-xs font-bold uppercase">{d.month}</span>
                    </span>
                  </time>
                  <div className="min-w-0 flex-1">
                    <Link to={path(`/formations/${course.slug}`)} className="font-display block leading-snug font-bold text-deep hover:text-teal">
                      {l(course.title)}
                    </Link>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                      <span className="capitalize">{d.weekday}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" />
                        <span dir="ltr">{session.time}</span>
                      </span>
                      <span>
                        {t.schedules[session.schedule]} · {t.formats[session.format]}
                      </span>
                    </p>
                  </div>
                  <Link
                    to={path(`/inscription?formation=${course.slug}&session=${session.id}`)}
                    className="btn-teal hidden min-h-10 shrink-0 px-4 text-sm sm:inline-flex"
                    aria-label={`${t.home.sessionsCta} — ${l(course.title)}, ${formatDate(session.date, lang)}`}
                  >
                    {t.home.sessionsCta}
                  </Link>
                  <Link
                    to={path(`/inscription?formation=${course.slug}&session=${session.id}`)}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-teal text-white sm:hidden"
                    aria-label={`${t.home.sessionsCta} — ${l(course.title)}, ${formatDate(session.date, lang)}`}
                  >
                    <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

const METHOD_ICONS = [Compass, Users, Hammer, MessagesSquare]

function Method() {
  const { t } = useI18n()
  return (
    <section id="methode" className="container-x py-16 sm:py-24" aria-labelledby="method-title">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading id="method-title" eyebrow={t.home.methodEyebrow} title={t.home.methodTitle} />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {t.home.method.map((step, i) => {
              const Icon = METHOD_ICONS[i]
              return (
                <Reveal as="li" key={step.title} delay={i * 70} className="rounded-3xl border border-line bg-white p-5">
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-mint text-teal">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-extrabold text-sun-soft [-webkit-text-stroke:1px_var(--color-teal)]" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </span>
                  <h3 className="font-display mt-4 text-lg font-bold text-deep">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{step.text}</p>
                </Reveal>
              )
            })}
          </ol>
        </div>
        <Reveal className="relative">
          <img
            src="/images/method-1200.webp"
            srcSet="/images/method-640.webp 640w, /images/method-1200.webp 1200w"
            sizes="(min-width: 1024px) 600px, 100vw"
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full rounded-[2.5rem] object-cover"
          />
          <div className="absolute -top-4 -end-3 size-20 rounded-full bg-sun sm:size-24" aria-hidden="true" />
        </Reveal>
      </div>

      <div className="mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl font-extrabold text-deep">{t.home.trainersTitle}</h3>
          <p className="text-sm text-muted">{t.home.trainersNote}</p>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {t.home.trainers.map((tr, i) => (
            <Reveal as="li" key={tr.role} delay={i * 70} className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-line">
              <span
                className={`grid size-14 shrink-0 place-items-center rounded-full ${['bg-mint text-teal', 'bg-sun-soft text-deep', 'bg-coral-soft text-[#8a2a14]'][i]}`}
                aria-hidden="true"
              >
                <Users className="size-6" />
              </span>
              <div>
                <p className="font-display font-bold text-deep">{tr.role}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{tr.text}</p>
                <p className="mt-2 inline-block rounded-full border border-dashed border-muted/50 px-2.5 py-0.5 text-[11px] font-bold text-muted">
                  {t.home.trainerTag}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Parents() {
  const { t, path } = useI18n()
  return (
    <section className="container-x pb-16 sm:pb-24" aria-labelledby="parents-title">
      <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-sun-soft md:grid-cols-[0.9fr_1.1fr]">
        <img
          src="/images/learner-640.webp"
          srcSet="/images/learner-640.webp 640w, /images/learner-1200.webp 1200w"
          sizes="(min-width: 768px) 45vw, 100vw"
          alt=""
          width={640}
          height={427}
          loading="lazy"
          decoding="async"
          className="h-full min-h-56 w-full object-cover"
        />
        <div className="p-7 sm:p-10 lg:p-14">
          <p className="eyebrow bg-white/70">{t.home.parentsEyebrow}</p>
          <h2 id="parents-title" className="font-display mt-4 text-3xl font-extrabold text-deep sm:text-4xl">
            {t.home.parentsTitle}
          </h2>
          <p className="mt-4 max-w-lg leading-relaxed text-ink/80">{t.home.parentsText}</p>
          <Link to={path('/inscription')} className="btn-teal mt-7">
            {t.home.parentsCta}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>
    </section>
  )
}

export function Faq({ items, title, eyebrow }: { items: { q: string; a: string }[]; title: string; eyebrow?: string }) {
  return (
    <div>
      {eyebrow ? <SectionHeading eyebrow={eyebrow} title={title} /> : <h2 className="font-display text-2xl font-extrabold text-deep">{title}</h2>}
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group rounded-3xl border border-line bg-white open:shadow-card">
            <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-3xl p-5 text-start font-bold text-deep sm:px-6">
              {item.q}
              <span className="chev grid size-8 shrink-0 place-items-center rounded-full bg-mint text-teal transition">
                <ChevronDown className="size-4" aria-hidden="true" />
              </span>
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-muted sm:px-6">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  const { t } = useI18n()
  const c = t.contact
  return (
    <section id="contact" className="container-x pb-10" aria-labelledby="contact-title">
      <div className="grid overflow-hidden rounded-[2.5rem] border border-line bg-white lg:grid-cols-2">
        <div className="p-7 sm:p-10">
          <SectionHeading id="contact-title" eyebrow={c.eyebrow} title={c.title} />
          <dl className="mt-8 space-y-6">
            <div className="flex gap-4">
              <dt className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-teal">
                <MapPin className="size-5" aria-hidden="true" />
                <span className="sr-only">{c.addressLabel}</span>
              </dt>
              <dd>
                <p className="font-bold text-deep">
                  {c.address}{' '}
                  <span className="ms-1 rounded-full bg-sun-soft px-2 py-0.5 align-middle text-[11px] font-bold text-[#5c4300]">{c.exampleTag}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted">{c.addressNote}</p>
              </dd>
            </div>
            <div className="flex gap-4">
              <dt className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint text-teal">
                <Clock className="size-5" aria-hidden="true" />
                <span className="sr-only">{c.hoursLabel}</span>
              </dt>
              <dd className="space-y-0.5 text-ink">
                {c.hours.map((h) => (
                  <p key={h}>{h}</p>
                ))}
              </dd>
            </div>
          </dl>
          <a href={whatsappLink(c.hello)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8">
            <WhatsAppIcon />
            {c.whatsappCta}
          </a>
        </div>
        <iframe
          title={c.mapTitle}
          src="https://www.openstreetmap.org/export/embed.html?bbox=-3.9420%2C35.2380%2C-3.9080%2C35.2580&layer=mapnik&marker=35.2465%2C-3.9300"
          loading="lazy"
          className="min-h-80 w-full border-0 lg:min-h-full"
        />
      </div>
    </section>
  )
}

export function Home() {
  const { t } = useI18n()
  return (
    <>
      <Hero />
      <Categories />
      <Featured />
      <Sessions />
      <Method />
      <Parents />
      <section id="faq" className="container-x max-w-4xl pb-16 sm:pb-24">
        <Faq items={t.home.faq} title={t.home.faqTitle} eyebrow={t.home.faqEyebrow} />
      </section>
      <Contact />
    </>
  )
}
