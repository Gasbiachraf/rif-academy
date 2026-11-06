import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export function NotFound() {
  const { t, path } = useI18n()
  return (
    <section className="bg-dots">
      <div className="container-x py-24 text-center sm:py-32">
        <p className="font-display text-7xl font-extrabold text-deep">
          <span className="hl">404</span>
        </p>
        <h1 className="font-display mt-6 text-3xl font-extrabold text-deep">{t.notFound.title}</h1>
        <p className="mt-3 text-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={path()} className="btn-teal">
            {t.notFound.home}
          </Link>
          <Link to={path('/formations')} className="btn-ghost text-deep">
            {t.notFound.catalog}
          </Link>
        </div>
      </div>
    </section>
  )
}
