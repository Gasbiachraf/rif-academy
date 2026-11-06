import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, Search, SlidersHorizontal, X } from 'lucide-react'
import { courses } from '../data/courses'
import { useI18n } from '../i18n'
import { FACETS, activeCount, emptyFilters, filterCourses, parseFilters, relaxations, toSearchParams, toggle, type FacetKey, type Filters } from '../lib/filters'
import { whatsappLink } from '../lib/whatsapp'
import { CourseCard } from '../components/CourseCard'
import { PageHeader, WhatsAppIcon } from '../components/ui'
import type { Dict } from '../i18n/fr'

function facetLabels(t: Dict, key: FacetKey): Record<string, string> {
  return { cat: t.categories, level: t.levels, format: t.formats, time: t.schedules }[key]
}

function FacetGroups({ filters, onToggle }: { filters: Filters; onToggle: (key: FacetKey, value: string) => void }) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      {FACETS.map(({ key, values }) => {
        const labels = facetLabels(t, key)
        return (
          <fieldset key={key}>
            <legend className="mb-3 text-sm font-bold text-deep">{t.catalog.facets[key]}</legend>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <label key={value} className="chip">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(filters[key] as string[]).includes(value)}
                    onChange={() => onToggle(key, value)}
                  />
                  {labels[value]}
                </label>
              ))}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}

export function Courses() {
  const { t } = useI18n()
  const [params, setParams] = useSearchParams()
  const filters = parseFilters(params)
  const [query, setQuery] = useState(filters.q)
  const [panelOpen, setPanelOpen] = useState(false)
  const c = t.catalog

  const update = (next: Filters) => setParams(toSearchParams(next), { replace: true, preventScrollReset: true })

  // Keep the input in sync when the URL changes (back button, popular-search links).
  useEffect(() => setQuery(filters.q), [filters.q])

  // Debounced search → URL.
  useEffect(() => {
    if (query === filters.q) return
    const id = window.setTimeout(() => update({ ...filters, q: query }), 250)
    return () => window.clearTimeout(id)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  const onToggle = (key: FacetKey, value: string) => update({ ...filters, [key]: toggle(filters[key] as string[], value) })

  const results = filterCourses(courses, filters)
  const active = activeCount(filters)
  const chips = FACETS.flatMap(({ key }) => (filters[key] as string[]).map((value) => ({ key, value, label: facetLabels(t, key)[value] })))

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle}>
        <form role="search" onSubmit={(e) => (e.preventDefault(), update({ ...filters, q: query }))} className="mt-8 max-w-2xl">
          <label htmlFor="catalog-search" className="sr-only">
            {c.searchLabel}
          </label>
          <div className="flex items-center gap-2 rounded-full border-2 border-line bg-white p-1.5 shadow-card focus-within:border-teal">
            <Search className="ms-3 size-5 shrink-0 text-muted" aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={c.searchPlaceholder}
              className="min-h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button type="button" onClick={() => (setQuery(''), update({ ...filters, q: '' }))} className="grid size-10 place-items-center rounded-full text-muted hover:bg-mint-50" aria-label={c.clearSearch}>
                <X className="size-4" />
              </button>
            )}
          </div>
        </form>
      </PageHeader>

      <section className="container-x grid gap-8 pt-8 pb-16 lg:grid-cols-[280px_1fr] lg:gap-10">
        <aside className="hidden lg:block" aria-label={c.filters}>
          <div className="sticky top-28 rounded-3xl border border-line bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-extrabold text-deep">{c.filters}</p>
              {active > 0 && (
                <button type="button" onClick={() => (setQuery(''), update(emptyFilters))} className="text-sm font-bold text-teal underline underline-offset-4">
                  {c.reset}
                </button>
              )}
            </div>
            <FacetGroups filters={filters} onToggle={onToggle} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setPanelOpen((v) => !v)}
              aria-expanded={panelOpen}
              aria-controls="filters-panel"
              className="btn-ghost w-full text-deep"
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {c.filters}
              {active - (filters.q ? 1 : 0) > 0 && (
                <span className="grid size-6 place-items-center rounded-full bg-teal text-xs text-white">{active - (filters.q ? 1 : 0)}</span>
              )}
            </button>
            {panelOpen && (
              <div id="filters-panel" className="mt-3 rounded-3xl border border-line bg-white p-5">
                <FacetGroups filters={filters} onToggle={onToggle} />
                <button type="button" onClick={() => setPanelOpen(false)} className="btn-teal mt-6 w-full">
                  {c.showResults(results.length)}
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 lg:mt-0">
            <p className="me-2 font-display text-lg font-extrabold text-deep" aria-live="polite" aria-atomic="true">
              {c.results(results.length)}
              {filters.q && <span className="font-sans text-base font-semibold text-muted"> {c.resultsFor(filters.q)}</span>}
            </p>
            {chips.map((chip) => (
              <button
                key={chip.key + chip.value}
                type="button"
                onClick={() => onToggle(chip.key, chip.value)}
                className="inline-flex items-center gap-1.5 rounded-full bg-mint py-1.5 ps-3 pe-2 text-sm font-semibold text-teal hover:bg-teal hover:text-white"
                aria-label={c.remove(chip.label)}
              >
                {chip.label}
                <X className="size-3.5" aria-hidden="true" />
              </button>
            ))}
            {active > 0 && (
              <button type="button" onClick={() => (setQuery(''), update(emptyFilters))} className="text-sm font-bold text-muted underline underline-offset-4 hover:text-teal lg:hidden">
                {c.reset}
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((course) => (
                <li key={course.slug}>
                  <CourseCard course={course} headingLevel="h2" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-[2rem] border-2 border-dashed border-line bg-white p-7 sm:p-10">
              <span className="grid size-14 place-items-center rounded-2xl bg-sun-soft text-deep">
                <SearchX className="size-7" aria-hidden="true" />
              </span>
              <h2 className="font-display mt-5 text-2xl font-extrabold text-deep">{c.emptyTitle}</h2>
              {relaxations(courses, filters).length > 0 && (
                <>
                  <p className="mt-2 text-muted">{c.emptyText}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {relaxations(courses, filters).map(({ key, count }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          if (key === 'q') setQuery('')
                          update({ ...filters, [key]: key === 'q' ? '' : [] })
                        }}
                        className="btn-ghost min-h-11 text-sm text-deep"
                      >
                        {c.relaxPrefix} {c.relax[key]} <span className="text-muted">· {c.relaxCount(count)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted">{c.emptyAsk}</p>
                <a href={whatsappLink(c.emptyAskMessage(filters.q))} target="_blank" rel="noopener noreferrer" className="btn-wa shrink-0">
                  <WhatsAppIcon />
                  {c.emptyAskCta}
                </a>
              </div>
            </div>
          )}
          <p className="mt-8 text-xs text-muted">
            {t.common.priceNote} {t.common.datesNote}
          </p>
        </div>
      </section>
    </>
  )
}
