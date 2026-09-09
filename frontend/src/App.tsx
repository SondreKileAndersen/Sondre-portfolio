import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionRenderer } from './components/SectionRenderer'
import { Header } from './components/layout/Header'
import { getPages } from './data/pages'
import {
  defaultLanguage,
  isSupportedLanguage,
} from './i18n/config'

const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/$/, '') : path

export function App() {
  const { t, i18n } = useTranslation()
  const resolvedLanguage = i18n.resolvedLanguage
  const language = resolvedLanguage && isSupportedLanguage(resolvedLanguage)
    ? resolvedLanguage
    : defaultLanguage
  const pages = getPages(language)
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () =>
      setCurrentPath(normalizePath(window.location.pathname))

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(normalizePath(path))
    window.scrollTo(0, 0)
  }

  const page = pages.find((candidate) => candidate.path === currentPath)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = page?.title ?? t('errors.notFound')
  }, [language, page, t])

  return (
    <>
      <Header
        pages={pages}
        currentPath={currentPath}
        onNavigate={navigate}
      />
      <main aria-label={t('accessibility.mainContent')}>
        {page ? (
          page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
        ) : (
          <h1>{t('errors.notFound')}</h1>
        )}
      </main>
    </>
  )
}
