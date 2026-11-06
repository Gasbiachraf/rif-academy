import { findCourse } from '../data/courses'
import type { Lang } from '../i18n'
import type { Dict } from '../i18n/fr'
import { formatDate, today, upcomingSessions } from './sessions'

export const CURRENT_LEVELS = ['none', 'basics', 'comfortable'] as const
export const AVAILABILITY = ['morning', 'afternoon', 'evening', 'saturday', 'sunday'] as const
export const RELATIONS = ['parent', 'guardian', 'other'] as const
/** Session value meaning "any upcoming session". */
export const FLEXIBLE = 'flexible'
export const ADULT_AGE = 18
export const MESSAGE_MAX = 600

export type CurrentLevel = (typeof CURRENT_LEVELS)[number]
export type Availability = (typeof AVAILABILITY)[number]
export type Relation = (typeof RELATIONS)[number]

export interface Enrollment {
  course: string
  session: string
  level: CurrentLevel | ''
  availability: Availability[]
  name: string
  age: string
  guardianName: string
  guardianPhone: string
  guardianRelation: Relation | ''
  phone: string
  email: string
  message: string
  consent: boolean
}

export type ErrorKey = keyof Dict['form']['errors']
export type Errors = Partial<Record<keyof Enrollment, ErrorKey>>

export const emptyEnrollment: Enrollment = {
  course: '',
  session: '',
  level: '',
  availability: [],
  name: '',
  age: '',
  guardianName: '',
  guardianPhone: '',
  guardianRelation: '',
  phone: '',
  email: '',
  message: '',
  consent: false,
}

/** Order in which fields appear on the page (used to focus the first error). */
export const FIELD_ORDER: Array<keyof Enrollment> = [
  'course',
  'session',
  'level',
  'availability',
  'name',
  'age',
  'guardianName',
  'guardianRelation',
  'guardianPhone',
  'phone',
  'email',
  'message',
  'consent',
]

export function parseAge(value: string): number | null {
  const v = value.trim()
  if (!/^\d{1,3}$/.test(v)) return null
  const n = Number(v)
  return n >= 5 && n <= 99 ? n : null
}

export function isMinor(e: Pick<Enrollment, 'age'>) {
  const age = parseAge(e.age)
  return age !== null && age < ADULT_AGE
}

const validPhone = (v: string) => /^\+?[\d\s().-]+$/.test(v.trim()) && v.replace(/\D/g, '').length >= 9 && v.replace(/\D/g, '').length <= 15

export function validate(e: Enrollment, from: Date = today()): Errors {
  const errors: Errors = {}
  const course = findCourse(e.course)

  if (!course) errors.course = 'course'
  else if (e.session !== FLEXIBLE && !upcomingSessions(course, from).some((s) => s.id === e.session)) errors.session = 'session'
  if (!e.level) errors.level = 'level'
  if (!e.availability.length) errors.availability = 'availability'
  if (e.name.trim().length < 2) errors.name = 'name'

  const age = parseAge(e.age)
  if (age === null) errors.age = 'age'
  else if (course && age < course.ageMin) errors.age = 'ageMin'

  if (isMinor(e)) {
    if (e.guardianName.trim().length < 2) errors.guardianName = 'guardianName'
    if (!e.guardianRelation) errors.guardianRelation = 'guardianRelation'
    if (!validPhone(e.guardianPhone)) errors.guardianPhone = 'phone'
  }

  if (!validPhone(e.phone)) errors.phone = 'phone'
  if (e.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email.trim())) errors.email = 'email'
  if (e.message.length > MESSAGE_MAX) errors.message = 'message'
  if (!e.consent) errors.consent = 'consent'
  return errors
}

/** Pre-selection from the query string (?formation=slug&session=id), validated. */
export function prefill(params: URLSearchParams, from: Date = today()): Pick<Enrollment, 'course' | 'session'> {
  const course = findCourse(params.get('formation'))
  if (!course) return { course: '', session: '' }
  const session = params.get('session') ?? ''
  const valid = upcomingSessions(course, from).some((s) => s.id === session)
  return { course: course.slug, session: valid ? session : '' }
}

export function sessionLabel(e: Enrollment, t: Dict, lang: Lang, from: Date = today()) {
  if (e.session === FLEXIBLE) return t.form.flexible
  const course = findCourse(e.course)
  const session = course && upcomingSessions(course, from).find((s) => s.id === e.session)
  if (!session) return ''
  return `${formatDate(session.date, lang)} · ${t.schedules[session.schedule]} · ${t.formats[session.format]} (${t.common.indicative})`
}

/** Label/value pairs shown in the confirmation and sent on WhatsApp. */
export function summaryRows(e: Enrollment, t: Dict, lang: Lang, from: Date = today()): Array<[string, string]> {
  const f = t.form
  const course = findCourse(e.course)
  const rows: Array<[string, string]> = [
    [t.wa.course, course ? course.title[lang] : ''],
    [t.wa.session, sessionLabel(e, t, lang, from)],
    [t.wa.level, e.level ? f.levels[e.level] : ''],
    [t.wa.availability, e.availability.map((a) => f.availabilities[a]).join(', ')],
    [t.wa.name, e.name.trim()],
    [t.wa.age, f.ageValue(e.age.trim())],
  ]
  if (isMinor(e)) rows.push([t.wa.guardian, `${e.guardianName.trim()} (${e.guardianRelation ? f.relations[e.guardianRelation] : ''}) · ${e.guardianPhone.trim()}`])
  rows.push([t.wa.phone, e.phone.trim()])
  if (e.email.trim()) rows.push([t.wa.email, e.email.trim()])
  if (e.message.trim()) rows.push([t.wa.message, e.message.trim()])
  return rows
}

export function buildMessage(e: Enrollment, t: Dict, lang: Lang, from: Date = today()) {
  const sep = lang === 'fr' ? ' : ' : ': '
  return [t.wa.greeting, t.wa.intro, '', ...summaryRows(e, t, lang, from).map(([label, value]) => `• ${label}${sep}${value}`), '', t.wa.outro].join('\n')
}
