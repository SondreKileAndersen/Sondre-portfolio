import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { PortfolioPage } from '../../types/page'
import { Navigation } from './Navigation'

type HeaderProps = {
  pages: PortfolioPage[]
  currentPath: string
  onNavigate: (path: string) => void
  tone?: 'light' | 'dark'
}

export function Header({
  pages,
  currentPath,
  onNavigate,
  tone = 'light',
}: HeaderProps) {
  const { t } = useTranslation()
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const header = headerRef.current
    const root = document.getElementById('root')
    if (!header || !root) return

    const updateHeight = () => root.style.setProperty('--site-header-overlay-height', `${header.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    updateHeight()
    return () => {
      observer.disconnect()
      root.style.removeProperty('--site-header-overlay-height')
    }
  }, [])

  return (
    <header ref={headerRef} className={`site-header site-header--${tone}`}>
      <a
        className="site-identity"
        href="/"
        aria-label={t('accessibility.goHome')}
        onClick={(event) => {
          event.preventDefault()
          onNavigate('/')
        }}
      >
        <strong>
          <span>Sondre</span>
          <span>Kile</span>
          <span>Andersen</span>
        </strong>
      </a>
      <Navigation
        pages={pages}
        currentPath={currentPath}
        onNavigate={onNavigate}
      />
    </header>
  )
}
