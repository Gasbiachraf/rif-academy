import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react'
import { LANGS, LANG_LABELS, useI18n, type Lang } from '../i18n'
import { CATEGORIES } from '../data/courses'
import { whatsappLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui'

function Mark({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 44 44" className="size-11 shrink-0" aria-hidden="true">
      <rect width="44" height="44" rx="14" fill={light ? '#ffffff' : '#0b5d5e'} />
      <circle cx="31.5" cy="12.5" r="5.5" fill="#ffc83d" />
      <path d="M10 16.5c4.8-2 9-1.4 12 1.4V34c-3-2.8-7.2-3.4-12-1.4z" fill={light ? '#0b5d5e' : '#ffffff'} />
      <path d="M34 23v9.6c-4.8-2-9-1.4-12 1.4V17.9" fill="none" stroke={light ? '#0b5d5e' : '#ffffff'} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}

function Logo({ light = false }: { light?: boolean }) {
  const { t, path } = useI18n()
  return (
    <Link to={path()} aria-label={t.nav.home} className="flex items-center gap-2.5 rounded-2xl" dir="ltr">
      <Mark light={light} />
      <span className="leading-none">
        <span className={`block font-['Bricolage_Grotesque'] text-[1.35rem] font-extrabold tracking-[-0.03em] ${light ? 'text-white' : 'text-deep'}`}>
          Rif Academy
        </span>
        <span className={`mt-0.5 block text-[11px] font-semibold ${light ? 'text-white/65' : 'text-muted'}`}>Al Hoceima</span>
      </span>
    </Link>
  )
}

function LangSwitcher({ onPick, dark = false }: { onPick?: () => void; dark?: boolean }) {
  const { lang, t } = useI18n()
  const { pathname, search, hash } = useLocation()
  const swap = (to: Lang) => pathname.replace(/^\/(fr|ar|en)(?=\/|$)/, `/${to}`) + search + hash

  return (
    <nav aria-label={t.nav.language} className={`flex items-center rounded-full p-1 ${dark ? 'bg-white/10' : 'bg-mint-50 ring-1 ring-line'}`}>
      {LANGS.map((code) => (
        <Link
          key={code}
          to={swap(code)}
          onClick={onPick}
          lang={code}
          hrefLang={code}
          aria-current={code === lang ? 'true' : undefined}
          title={LANG_LABELS[code].name}
          className={`grid h-8 min-w-9 place-items-center rounded-full px-2 text-xs font-bold transition ${
            code === lang ? 'bg-teal text-white shadow-sm' : dark ? 'text-white/75 hover:text-white' : 'text-muted hover:text-teal'
          }`}
        >
          {LANG_LABELS[code].short}
        </Link>
      ))}
    </nav>
  )
}

function DemoBanner() {
  const { t } = useI18n()
  return (
    <div className="bg-sun-50 text-[#5c4300]">
      <p className="container-x flex min-h-9 items-center justify-center gap-2 py-1.5 text-center text-xs font-semibold">
        <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
        {t.banner}
      </p>
    </div>
  )
}

function Header() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { to: path('/formations'), label: t.nav.courses, page: true },
    { to: path('/#sessions'), label: t.nav.sessions },
    { to: path('/#methode'), label: t.nav.method },
    { to: path('/#faq'), label: t.nav.faq },
    { to: path('/#contact'), label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-line/80 bg-white/90 shadow-card backdrop-blur-md">
        <div className="flex h-[4.25rem] items-center justify-between gap-3 ps-3 pe-2.5 sm:ps-4">
          <Logo />

          <nav aria-label={t.nav.main} className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[15px] font-semibold transition ${
                    isActive && link.page ? 'bg-mint text-teal' : 'text-ink hover:bg-mint-50 hover:text-teal'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <LangSwitcher />
            </div>
            <Link to={path('/inscription')} className="btn-sun hidden min-h-11 px-5 sm:inline-flex">
              {t.nav.cta}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="grid size-11 place-items-center rounded-full bg-mint text-teal lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="border-t border-line px-3 pt-2 pb-4 lg:hidden">
            <nav aria-label={t.nav.main} className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="font-display flex items-center justify-between rounded-2xl px-3 py-3.5 text-lg font-bold text-deep hover:bg-mint-50"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-teal-2 rtl:rotate-180" aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-3">
              <LangSwitcher onPick={() => setOpen(false)} />
              <Link to={path('/inscription')} className="btn-sun min-h-11 px-5 sm:hidden">
                {t.nav.cta}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MobileBar() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  if (pathname.endsWith('/inscription')) return null

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex gap-2 rounded-full border border-line bg-white/95 p-1.5 shadow-pop backdrop-blur-md">
        <Link to={path('/inscription')} className="btn-sun min-h-12 flex-1">
          {t.nav.cta}
        </Link>
        <a
          href={whatsappLink(t.contact.hello)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsappCta}
          className="btn-wa size-12 px-0"
        >
          <WhatsAppIcon className="size-6" />
        </a>
      </div>
    </div>
  )
}

function Footer() {
  const { t, path } = useI18n()
  return (
    <footer className="bg-dots-light mt-10 rounded-t-[2.5rem] bg-deep pt-14 pb-28 text-white/75 md:pb-10">
      <div className="container-x">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-teal p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-3xl leading-tight font-extrabold text-balance text-white sm:text-4xl">{t.home.ctaTitle}</p>
            <p className="mt-2 max-w-xl text-white/80">{t.home.ctaText}</p>
          </div>
          <Link to={path('/inscription')} className="btn-sun shrink-0">
            {t.nav.cta}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.tagline}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-sun">{t.nav.courses}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link to={path(`/formations?cat=${c}`)} className="hover:text-white">
                    {t.categories[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-sun">{t.footer.explore}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to={path('/inscription')} className="hover:text-white">
                  {t.nav.cta}
                </Link>
              </li>
              <li>
                <Link to={path('/#sessions')} className="hover:text-white">
                  {t.home.sessionsTitle}
                </Link>
              </li>
              <li>
                <a href={whatsappLink(t.contact.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <WhatsAppIcon className="size-4" />
                  {t.contact.whatsappCta}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 pt-6 text-xs leading-relaxed">
          <p className="font-semibold text-sun">{t.legal.disclaimer}</p>
          <p>{t.legal.pricing}</p>
          <p className="max-w-3xl">{t.footer.concept}</p>
          <div className="flex flex-wrap justify-between gap-3 pt-3 text-white/60">
            <p>
              © {new Date().getFullYear()} Rif Academy — Concept Demo · {t.footer.photos}
            </p>
            <p>
              {t.footer.madeBy}{' '}
              <a href="https://innovatechs.vercel.app/" className="font-semibold text-white hover:text-sun">
                Innovatechs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

/** Scrolls to the hash target, or to the top when the page changes. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function Layout({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <>
      <ScrollManager />
      <a href="#main" className="sr-only z-50 rounded-full bg-deep px-4 py-2 text-white focus:not-sr-only focus:fixed focus:start-3 focus:top-3">
        {t.nav.skip}
      </a>
      <DemoBanner />
      <Header />
      <main id="main">{children ?? <Outlet />}</main>
      <Footer />
      <MobileBar />
    </>
  )
}
