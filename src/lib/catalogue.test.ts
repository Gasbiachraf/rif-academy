import { describe, expect, it } from 'vitest'
import { courses } from '../data/courses'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { activeCount, emptyFilters, filterCourses, normalize, parseFilters, relaxations, toSearchParams, toggle } from './filters'
import { nextSessions, upcomingSessions } from './sessions'

const FROM = new Date(2026, 10, 6)
const slugs = (list: typeof courses) => list.map((c) => c.slug)

describe('URL filters', () => {
  it('round-trips through the query string and ignores unknown values', () => {
    const params = new URLSearchParams('q=excel&cat=office,hacking&format=online&time=evening&level=zzz')
    const filters = parseFilters(params)
    expect(filters).toEqual({ q: 'excel', cat: ['office'], level: [], format: ['online'], time: ['evening'] })
    expect(toSearchParams(filters).toString()).toBe('q=excel&cat=office&format=online&time=evening')
    expect(activeCount(filters)).toBe(4)
    expect(toSearchParams(emptyFilters).toString()).toBe('')
  })

  it('toggles a facet value', () => {
    expect(toggle(['day'], 'evening')).toEqual(['day', 'evening'])
    expect(toggle(['day', 'evening'], 'day')).toEqual(['evening'])
  })
})

describe('filterCourses', () => {
  it('returns the whole catalogue without filters', () => {
    expect(filterCourses(courses, emptyFilters)).toHaveLength(courses.length)
  })

  it('combines facets (AND between facets, OR inside one)', () => {
    expect(slugs(filterCourses(courses, { ...emptyFilters, cat: ['languages'] }))).toEqual(['anglais-communication', 'espagnol-debutant', 'francais-professionnel'])
    expect(slugs(filterCourses(courses, { ...emptyFilters, time: ['day'] }))).toEqual(['informatique-premiers-pas', 'bureautique-essentielle'])
    expect(slugs(filterCourses(courses, { ...emptyFilters, cat: ['it', 'office'], level: ['beginner'] }))).toEqual(['informatique-premiers-pas', 'bureautique-essentielle'])
  })

  it('searches without accents and across languages', () => {
    expect(normalize('Français Élève')).toBe('francais eleve')
    expect(slugs(filterCourses(courses, { ...emptyFilters, q: 'FRANCAIS' }))).toContain('francais-professionnel')
    expect(slugs(filterCourses(courses, { ...emptyFilters, q: 'إنجليزية' }))).toContain('anglais-communication')
  })

  it('suggests which filter to remove when nothing matches', () => {
    const f = { ...emptyFilters, cat: ['languages' as const], level: ['advanced' as const] }
    expect(filterCourses(courses, f)).toHaveLength(0)
    expect(relaxations(courses, f)).toEqual([
      { key: 'level', count: 3 },
      { key: 'cat', count: 1 },
    ])
  })
})

describe('sessions', () => {
  it('computes upcoming dates, soonest first, never in the past', () => {
    const english = courses.find((c) => c.slug === 'anglais-communication')!
    expect(upcomingSessions(english, FROM).map((s) => s.id)).toEqual(['2026-12-05-weekend', '2026-12-07-evening', '2027-01-05-evening'])
    for (const c of courses) for (const s of upcomingSessions(c, FROM)) expect(s.date.getTime()).toBeGreaterThan(FROM.getTime())
  })

  it('lists the next sessions across the catalogue', () => {
    const next = nextSessions(FROM, 4)
    expect(next).toHaveLength(4)
    const times = next.map((n) => n.session.date.getTime())
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })
})

describe('catalogue content', () => {
  it('has ~8 seeded courses with unique slugs and at least one session', () => {
    expect(courses.length).toBeGreaterThanOrEqual(8)
    expect(new Set(slugs(courses)).size).toBe(courses.length)
    for (const c of courses) expect(c.sessions.length).toBeGreaterThan(0)
  })

  it('is fully translated (no empty string in any language)', () => {
    for (const c of courses) {
      for (const value of [c.title, c.tagline, c.imageAlt, c.rhythm, ...c.objectives, ...c.prerequisites, ...c.audience]) {
        expect(value.fr && value.ar && value.en, `${c.slug}: ${value.fr}`).toBeTruthy()
      }
    }
  })

  it('never claims accreditation, state diplomas or job guarantees', () => {
    const text = JSON.stringify({ courses, fr, en }).toLowerCase()
    for (const banned of ['accrédité', 'diplôme d’état', 'emploi garanti', 'taux de réussite de', '100 %', 'certifié par l’état']) {
      expect(text).not.toContain(banned)
    }
  })

  it('has the same dictionary shape in every language', () => {
    const keys = (o: object): string[] =>
      Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keys(v).map((s) => `${k}.${s}`) : [k]))
    expect(keys(en).sort()).toEqual(keys(fr).sort())
    expect(keys(ar).sort()).toEqual(keys(fr).sort())
  })
})
