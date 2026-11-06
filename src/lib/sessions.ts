import { courses, type Course, type Format, type Schedule } from '../data/courses'
import type { Lang } from '../i18n'

export interface Session {
  /** Stable id used in URLs and the form, e.g. "2026-12-07-evening". */
  id: string
  date: Date
  schedule: Schedule
  format: Format
  time: string
}

export function isoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Start of today, local time. */
export function today() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** Upcoming sessions of a course: the first matching weekday of a following month. */
export function upcomingSessions(course: Course, from: Date = today()): Session[] {
  return course.sessions
    .map((plan) => {
      const date = new Date(from.getFullYear(), from.getMonth() + plan.monthOffset, 1)
      date.setDate(1 + ((plan.weekday - date.getDay() + 7) % 7))
      return { id: `${isoDate(date)}-${plan.schedule}`, date, schedule: plan.schedule, format: plan.format, time: plan.time }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}

/** All upcoming sessions across the catalogue, soonest first. */
export function nextSessions(from: Date = today(), limit = 6) {
  return courses
    .flatMap((course) => upcomingSessions(course, from).map((session) => ({ course, session })))
    .sort((a, b) => a.session.date.getTime() - b.session.date.getTime() || a.course.slug.localeCompare(b.course.slug))
    .slice(0, limit)
}

const LOCALES: Record<Lang, string> = { fr: 'fr-FR', ar: 'ar-MA', en: 'en-GB' }

export function formatDate(date: Date, lang: Lang, style: 'long' | 'short' = 'long') {
  return new Intl.DateTimeFormat(LOCALES[lang], style === 'long' ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' }).format(date)
}

export function dateParts(date: Date, lang: Lang) {
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(LOCALES[lang], o).format(date)
  return { day: fmt({ day: 'numeric' }), month: fmt({ month: 'short' }), weekday: fmt({ weekday: 'long' }) }
}

export function formatPrice(amount: number, lang: Lang) {
  return new Intl.NumberFormat(LOCALES[lang] === 'ar-MA' ? 'fr-FR' : LOCALES[lang]).format(amount)
}
