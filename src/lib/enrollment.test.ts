import { describe, expect, it } from 'vitest'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { FLEXIBLE, buildMessage, emptyEnrollment, isMinor, parseAge, prefill, summaryRows, validate, type Enrollment } from './enrollment'

// Friday 6 November 2026: the first English session is Saturday 5 December.
const FROM = new Date(2026, 10, 6)

const adult: Enrollment = {
  ...emptyEnrollment,
  course: 'anglais-communication',
  session: '2026-12-05-weekend',
  level: 'basics',
  availability: ['evening', 'saturday'],
  name: 'Salma B.',
  age: '24',
  phone: '+212 6 00 00 00 00',
  consent: true,
}

const minor: Enrollment = {
  ...adult,
  age: '15',
  guardianName: 'Karim B.',
  guardianRelation: 'parent',
  guardianPhone: '06 00 00 00 01',
}

describe('validate', () => {
  it('accepts a complete adult request', () => {
    expect(validate(adult, FROM)).toEqual({})
  })

  it('reports every required field on an empty form', () => {
    expect(Object.keys(validate(emptyEnrollment, FROM)).sort()).toEqual(['age', 'availability', 'consent', 'course', 'level', 'name', 'phone'].sort())
  })

  it('rejects an unknown or past session but accepts "flexible"', () => {
    expect(validate({ ...adult, session: '2020-01-01-evening' }, FROM).session).toBe('session')
    expect(validate({ ...adult, session: '' }, FROM).session).toBe('session')
    expect(validate({ ...adult, session: FLEXIBLE }, FROM)).toEqual({})
  })

  it('requires parent / guardian fields when the learner is a minor', () => {
    const errors = validate({ ...minor, guardianName: '', guardianRelation: '', guardianPhone: '' }, FROM)
    expect(errors).toEqual({ guardianName: 'guardianName', guardianRelation: 'guardianRelation', guardianPhone: 'phone' })
    expect(validate(minor, FROM)).toEqual({})
  })

  it('does not ask guardian fields for adults', () => {
    expect(validate({ ...adult, age: '18' }, FROM)).toEqual({})
  })

  it('enforces the minimum age of the course', () => {
    expect(validate({ ...minor, age: '12' }, FROM).age).toBe('ageMin')
    expect(validate({ ...adult, age: 'abc' }, FROM).age).toBe('age')
  })

  it('checks phone, optional email, message length and consent', () => {
    expect(validate({ ...adult, phone: '0600' }, FROM).phone).toBe('phone')
    expect(validate({ ...adult, phone: 'call me' }, FROM).phone).toBe('phone')
    expect(validate({ ...adult, email: 'salma@' }, FROM).email).toBe('email')
    expect(validate({ ...adult, email: 'salma@example.com' }, FROM)).toEqual({})
    expect(validate({ ...adult, message: 'x'.repeat(601) }, FROM).message).toBe('message')
    expect(validate({ ...adult, consent: false }, FROM).consent).toBe('consent')
  })
})

describe('age helpers', () => {
  it('parses plausible ages only', () => {
    expect(parseAge(' 17 ')).toBe(17)
    expect(parseAge('3')).toBeNull()
    expect(parseAge('')).toBeNull()
    expect(isMinor({ age: '17' })).toBe(true)
    expect(isMinor({ age: '18' })).toBe(false)
    expect(isMinor({ age: '' })).toBe(false)
  })
})

describe('prefill', () => {
  it('pre-selects a valid course and session from the URL', () => {
    const params = new URLSearchParams('formation=anglais-communication&session=2026-12-07-evening')
    expect(prefill(params, FROM)).toEqual({ course: 'anglais-communication', session: '2026-12-07-evening' })
  })

  it('drops an invalid session and ignores unknown courses', () => {
    expect(prefill(new URLSearchParams('formation=anglais-communication&session=nope'), FROM)).toEqual({ course: 'anglais-communication', session: '' })
    expect(prefill(new URLSearchParams('formation=pilotage&session=x'), FROM)).toEqual({ course: '', session: '' })
  })
})

describe('WhatsApp message', () => {
  it('summarises an adult request in French', () => {
    const text = buildMessage({ ...adult, message: 'Plutôt le samedi' }, fr, 'fr', FROM)
    expect(text.startsWith('Bonjour Rif Academy,')).toBe(true)
    expect(text).toContain('• Formation : Anglais : communiquer au quotidien')
    expect(text).toContain('samedi 5 décembre 2026')
    expect(text).toContain('(indicatif)')
    expect(text).toContain('• Niveau actuel : J’ai quelques bases')
    expect(text).toContain('• Âge : 24 ans')
    expect(text).toContain('• Message : Plutôt le samedi')
    expect(text).not.toContain('Parent / tuteur')
    expect(text).not.toContain('E-mail')
    expect(text).toContain('Merci de me confirmer la disponibilité.')
  })

  it('includes the guardian for a minor', () => {
    const rows = summaryRows(minor, fr, 'fr', FROM)
    expect(rows).toContainEqual(['Parent / tuteur', 'Karim B. (Parent) · 06 00 00 00 01'])
  })

  it('is localised in English and Arabic', () => {
    expect(buildMessage(adult, en, 'en', FROM)).toContain('English for everyday communication')
    expect(buildMessage(adult, ar, 'ar', FROM)).toContain('الإنجليزية: التواصل في الحياة اليومية')
  })

  it('uses the "flexible" label when no date is chosen', () => {
    expect(buildMessage({ ...adult, session: FLEXIBLE }, fr, 'fr', FROM)).toContain(fr.form.flexible)
  })
})
