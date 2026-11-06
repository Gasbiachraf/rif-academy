import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, ArrowRight, CalendarDays, CheckCircle2, Info, Pencil, ShieldCheck, Users } from 'lucide-react'
import { CATEGORIES, courses, findCourse, imageSrc } from '../data/courses'
import { useI18n } from '../i18n'
import {
  AVAILABILITY,
  CURRENT_LEVELS,
  FIELD_ORDER,
  FLEXIBLE,
  MESSAGE_MAX,
  RELATIONS,
  buildMessage,
  emptyEnrollment,
  isMinor,
  prefill,
  summaryRows,
  validate,
  type Enrollment,
  type Errors,
} from '../lib/enrollment'
import { formatDate, upcomingSessions } from '../lib/sessions'
import { whatsappLink } from '../lib/whatsapp'
import { LevelBadge, PageHeader, Price, WhatsAppIcon } from '../components/ui'

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-[2rem] border border-line bg-white p-5 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <p className="flex items-center gap-3" aria-hidden="true">
        <span className="font-display grid size-9 place-items-center rounded-full bg-sun text-base font-extrabold text-deep">{n}</span>
        <span className="font-display text-xl font-extrabold text-deep">{title}</span>
      </p>
      <div className="mt-6 space-y-6">{children}</div>
    </fieldset>
  )
}

function Field({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: string; error?: string; optional?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="ms-1.5 font-medium text-muted">({optional})</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p id={id} className="field-error">
      {children}
    </p>
  ) : null
}

export function Enroll() {
  const { t, l, lang, path } = useI18n()
  const [params] = useSearchParams()
  const [data, setData] = useState<Enrollment>(() => ({ ...emptyEnrollment, ...prefill(params) }))
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const f = t.form

  const course = findCourse(data.course)
  const sessions = course ? upcomingSessions(course) : []
  const minor = isMinor(data)

  const set = <K extends keyof Enrollment>(key: K, value: Enrollment[K]) => {
    setData((prev) => ({ ...prev, [key]: value, ...(key === 'course' ? { session: '' } : {}) }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const err = (key: keyof Enrollment) => (errors[key] ? f.errors[errors[key]!] : undefined)
  const aria = (key: keyof Enrollment, hint = false) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : hint ? `${key}-hint` : undefined,
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(data)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setDone(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const hasErrors = Object.values(errors).some(Boolean)

  if (done) {
    const message = buildMessage(data, t, lang)
    return (
      <>
        <PageHeader eyebrow={t.done.eyebrow} title={t.done.title} subtitle={t.done.text} />
        <section className="container-x grid gap-8 pb-16 lg:grid-cols-[1fr_340px]">
          <div className="rounded-[2rem] border border-line bg-white p-6 sm:p-10">
            <div className="flex items-start gap-4 rounded-3xl bg-[#e8f6ee] p-5 ring-1 ring-[#bfe3cc]">
              <WhatsAppIcon className="mt-0.5 size-7 shrink-0 text-[#177e41]" />
              <div className="flex-1">
                <p className="font-display text-lg font-extrabold text-deep">{t.done.whatsappTitle}</p>
                <p className="mt-1 text-sm text-ink/80">{t.done.whatsappText}</p>
                <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-4 w-full sm:w-auto">
                  <WhatsAppIcon />
                  {t.done.openWhatsApp}
                </a>
              </div>
            </div>

            <h2 className="font-display mt-8 flex items-center gap-2 text-xl font-extrabold text-deep">
              <CheckCircle2 className="size-6 text-teal-2" aria-hidden="true" />
              {t.done.recap}
            </h2>
            <dl className="mt-4 divide-y divide-dashed divide-line rounded-3xl bg-mint-50 px-5">
              {summaryRows(data, t, lang).map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:gap-6">
                  <dt className="w-40 shrink-0 text-sm text-muted">{label}</dt>
                  <dd className="font-semibold break-words text-deep">{value}</dd>
                </div>
              ))}
            </dl>
            <details className="mt-6 text-sm">
              <summary className="cursor-pointer font-bold text-teal">{t.done.preview}</summary>
              <pre className="mt-3 rounded-2xl bg-deep p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-white/90">{message}</pre>
            </details>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setDone(false)} className="btn-ghost text-deep">
                <Pencil className="size-4" aria-hidden="true" />
                {t.done.edit}
              </button>
              <Link to={path('/formations')} className="btn-ghost text-deep">
                {t.done.more}
              </Link>
            </div>
          </div>

          <aside className="h-fit rounded-[2rem] bg-deep p-7 text-white lg:sticky lg:top-28">
            <p className="font-display text-xl font-extrabold text-sun">{t.done.nextTitle}</p>
            <ol className="mt-5 space-y-4">
              {t.done.next.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-white/85">
                  <span className="font-display grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-extrabold text-sun">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/65">{t.legal.disclaimer}</p>
          </aside>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader eyebrow={f.eyebrow} title={f.title} subtitle={f.subtitle} />

      <section className="container-x grid gap-8 pb-16 lg:grid-cols-[1fr_340px] lg:gap-10">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="min-w-0 space-y-5">
          {hasErrors && (
            <div role="alert" className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 ring-1 ring-red-200">
              <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
              {f.errors.summary}
            </div>
          )}

          <Section n={1} title={f.sections.course}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="course" label={f.course} error={err('course')}>
                <select id="course" name="course" value={data.course} onChange={(e) => set('course', e.target.value)} className="field" {...aria('course')}>
                  <option value="">{f.coursePlaceholder}</option>
                  {CATEGORIES.map((cat) => (
                    <optgroup key={cat} label={t.categories[cat]}>
                      {courses
                        .filter((c) => c.category === cat)
                        .map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {l(c.title)}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </Field>
              <Field id="session" label={f.session} error={err('session')} hint={t.common.datesNote}>
                <select
                  id="session"
                  name="session"
                  value={data.session}
                  disabled={!course}
                  onChange={(e) => set('session', e.target.value)}
                  className="field disabled:opacity-60"
                  {...aria('session', true)}
                >
                  <option value="">{f.sessionPlaceholder}</option>
                  {sessions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {formatDate(s.date, lang)} · {t.schedules[s.schedule]} · {t.formats[s.format]}
                    </option>
                  ))}
                  <option value={FLEXIBLE}>{f.flexible}</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section n={2} title={f.sections.profile}>
            <fieldset aria-describedby={errors.level ? 'level-error' : undefined}>
              <legend className="field-label">{f.level}</legend>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {CURRENT_LEVELS.map((lv) => (
                  <label
                    key={lv}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-2 ${
                      data.level === lv ? 'border-teal bg-mint-50 text-deep' : errors.level ? 'border-red-700/50' : 'border-line hover:border-teal/40'
                    }`}
                  >
                    <input type="radio" name="level" value={lv} checked={data.level === lv} onChange={() => set('level', lv)} className="size-4 shrink-0 accent-teal" />
                    {f.levels[lv]}
                  </label>
                ))}
              </div>
              <ErrorText id="level-error">{err('level')}</ErrorText>
            </fieldset>

            <fieldset aria-describedby={errors.availability ? 'availability-error' : 'availability-hint'}>
              <legend className="field-label">{f.availability}</legend>
              <p id="availability-hint" className="-mt-1 mb-3 text-xs text-muted">
                {f.availabilityHint}
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((a) => (
                  <label key={a} className={`chip ${errors.availability ? 'border-red-700/50' : ''}`}>
                    <input
                      type="checkbox"
                      name="availability"
                      value={a}
                      className="sr-only"
                      checked={data.availability.includes(a)}
                      onChange={() =>
                        set('availability', data.availability.includes(a) ? data.availability.filter((x) => x !== a) : [...data.availability, a])
                      }
                    />
                    {f.availabilities[a]}
                  </label>
                ))}
              </div>
              <ErrorText id="availability-error">{err('availability')}</ErrorText>
            </fieldset>
          </Section>

          <Section n={3} title={f.sections.learner}>
            <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
              <Field id="name" label={f.name} error={err('name')}>
                <input id="name" name="name" autoComplete="name" value={data.name} onChange={(e) => set('name', e.target.value)} className="field" {...aria('name')} />
              </Field>
              <Field id="age" label={f.age} error={err('age')} hint={course ? t.common.ageMin(course.ageMin) : undefined}>
                <input
                  id="age"
                  name="age"
                  inputMode="numeric"
                  maxLength={2}
                  value={data.age}
                  onChange={(e) => set('age', e.target.value.replace(/\D/g, ''))}
                  className="field"
                  {...aria('age', !!course)}
                />
              </Field>
            </div>
            {!minor && <p className="-mt-3 text-xs text-muted">{f.ageHint}</p>}

            <div aria-live="polite">
              {minor && (
                <div className="animate-pop rounded-3xl bg-sun-50 p-5 ring-1 ring-sun-soft sm:p-6">
                  <p className="flex items-center gap-2 font-display text-lg font-extrabold text-deep">
                    <Users className="size-5 text-teal" aria-hidden="true" />
                    {f.minorTitle}
                  </p>
                  <p className="mt-1 text-sm text-ink/80">{f.minorText}</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <Field id="guardianName" label={f.guardianName} error={err('guardianName')}>
                      <input
                        id="guardianName"
                        name="guardianName"
                        value={data.guardianName}
                        onChange={(e) => set('guardianName', e.target.value)}
                        className="field"
                        {...aria('guardianName')}
                      />
                    </Field>
                    <Field id="guardianRelation" label={f.guardianRelation} error={err('guardianRelation')}>
                      <select
                        id="guardianRelation"
                        name="guardianRelation"
                        value={data.guardianRelation}
                        onChange={(e) => set('guardianRelation', e.target.value as Enrollment['guardianRelation'])}
                        className="field"
                        {...aria('guardianRelation')}
                      >
                        <option value="">—</option>
                        {RELATIONS.map((r) => (
                          <option key={r} value={r}>
                            {f.relations[r]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id="guardianPhone" label={f.guardianPhone} error={err('guardianPhone')}>
                      <input
                        id="guardianPhone"
                        name="guardianPhone"
                        type="tel"
                        inputMode="tel"
                        dir="ltr"
                        value={data.guardianPhone}
                        onChange={(e) => set('guardianPhone', e.target.value)}
                        className="field rtl:text-end"
                        {...aria('guardianPhone')}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section n={4} title={f.sections.contact}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label={f.phone} hint={f.phoneHint} error={err('phone')}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  value={data.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="field rtl:text-end"
                  {...aria('phone', true)}
                />
              </Field>
              <Field id="email" label={f.email} optional={f.optional} error={err('email')}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  value={data.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="field rtl:text-end"
                  {...aria('email')}
                />
              </Field>
            </div>
            <Field id="message" label={f.message} optional={f.optional} error={err('message')}>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder={f.messagePlaceholder}
                value={data.message}
                onChange={(e) => set('message', e.target.value)}
                className="field resize-y"
                {...aria('message')}
              />
              <p className="mt-1 text-end text-xs text-muted" aria-hidden="true">
                {data.message.length}/{MESSAGE_MAX}
              </p>
            </Field>
            <div>
              <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-ink/85">
                <input
                  type="checkbox"
                  name="consent"
                  checked={data.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  className="mt-0.5 size-5 shrink-0 accent-teal"
                  {...aria('consent')}
                />
                {f.consent}
              </label>
              <ErrorText id="consent-error">{err('consent')}</ErrorText>
            </div>
          </Section>

          <div className="flex flex-col gap-4 rounded-[2rem] bg-deep p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex gap-2 text-xs leading-relaxed text-white/75">
              <ShieldCheck className="size-4 shrink-0 text-sun" aria-hidden="true" />
              {f.privacy}
            </p>
            <button type="submit" className="btn-sun shrink-0 px-8">
              {f.submit}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>
        </form>

        <aside className="hidden lg:block" aria-label={f.selection}>
          <div className="sticky top-28 overflow-hidden rounded-[2rem] border border-line bg-white">
            {course ? (
              <>
                <img src={imageSrc(course.image)} alt="" width={640} height={427} className="aspect-[16/9] w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs font-bold text-muted">{f.selection}</p>
                  <p className="font-display mt-1 text-lg leading-snug font-extrabold text-deep">{l(course.title)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <LevelBadge level={course.level} />
                    <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-muted">{t.common.ageMin(course.ageMin)}</span>
                  </div>
                  {data.session && (
                    <p className="mt-4 flex gap-2 text-sm text-ink">
                      <CalendarDays className="size-4 shrink-0 text-teal-2" aria-hidden="true" />
                      {data.session === FLEXIBLE ? f.flexible : formatDate(sessions.find((s) => s.id === data.session)!.date, lang)}
                    </p>
                  )}
                  <div className="mt-4 border-t border-dashed border-line pt-4">
                    <Price course={course} />
                  </div>
                </div>
              </>
            ) : (
              <p className="p-6 text-sm text-muted">{f.noSelection}</p>
            )}
            <p className="flex gap-2 border-t border-line bg-mint-50 p-5 text-xs leading-relaxed text-muted">
              <Info className="size-4 shrink-0 text-teal-2" aria-hidden="true" />
              {t.course.asideNote}
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}
