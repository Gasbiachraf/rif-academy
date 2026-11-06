import {
  CATEGORIES,
  FORMATS,
  LEVELS,
  SCHEDULES,
  courseFormats,
  courseSchedules,
  type Category,
  type Course,
  type Format,
  type Level,
  type Schedule,
} from '../data/courses'

export interface Filters {
  q: string
  cat: Category[]
  level: Level[]
  format: Format[]
  time: Schedule[]
}

export type FacetKey = Exclude<keyof Filters, 'q'>

export const FACETS: { key: FacetKey; values: readonly string[] }[] = [
  { key: 'cat', values: CATEGORIES },
  { key: 'level', values: LEVELS },
  { key: 'format', values: FORMATS },
  { key: 'time', values: SCHEDULES },
]

export const emptyFilters: Filters = { q: '', cat: [], level: [], format: [], time: [] }

/** Reads filters from the query string, ignoring unknown values. Lists are comma-separated. */
export function parseFilters(params: URLSearchParams): Filters {
  const list = <T extends string>(key: string, allowed: readonly T[]) => {
    const raw = (params.get(key) ?? '').split(',').map((v) => v.trim())
    return allowed.filter((v) => raw.includes(v))
  }
  return {
    q: (params.get('q') ?? '').slice(0, 80),
    cat: list('cat', CATEGORIES),
    level: list('level', LEVELS),
    format: list('format', FORMATS),
    time: list('time', SCHEDULES),
  }
}

export function toSearchParams(f: Filters) {
  const params = new URLSearchParams()
  if (f.q.trim()) params.set('q', f.q.trim())
  for (const { key } of FACETS) if (f[key].length) params.set(key, f[key].join(','))
  return params
}

export function activeCount(f: Filters) {
  return FACETS.reduce((n, { key }) => n + f[key].length, 0) + (f.q.trim() ? 1 : 0)
}

/** Lower-case, strip Latin accents and Arabic diacritics, unify alef/yeh/teh marbuta. */
export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
}

function haystack(c: Course) {
  return normalize([...Object.values(c.title), ...Object.values(c.tagline), c.keywords].join(' '))
}

export function matches(c: Course, f: Filters) {
  const words = normalize(f.q).split(/\s+/).filter(Boolean)
  if (words.length) {
    const text = haystack(c)
    if (!words.every((w) => text.includes(w))) return false
  }
  if (f.cat.length && !f.cat.includes(c.category)) return false
  if (f.level.length && !f.level.includes(c.level)) return false
  if (f.format.length && !courseFormats(c).some((v) => f.format.includes(v))) return false
  if (f.time.length && !courseSchedules(c).some((v) => f.time.includes(v))) return false
  return true
}

export function filterCourses(list: Course[], f: Filters) {
  return list.filter((c) => matches(c, f))
}

export function toggle<T extends string>(values: T[], value: T) {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
}

/**
 * For an empty result: which single filter to drop to get results back,
 * with the number of courses each relaxation would show (best first).
 */
export function relaxations(list: Course[], f: Filters) {
  const options: { key: keyof Filters; count: number }[] = []
  if (f.q.trim()) options.push({ key: 'q', count: filterCourses(list, { ...f, q: '' }).length })
  for (const { key } of FACETS) if (f[key].length) options.push({ key, count: filterCourses(list, { ...f, [key]: [] }).length })
  return options.filter((o) => o.count > 0).sort((a, b) => b.count - a.count)
}
