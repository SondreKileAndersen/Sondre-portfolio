import { useTranslation } from 'react-i18next'
import type { PortfolioPage } from '../../types/page'
import { Navigation } from './Navigation'

type HeaderProps = {
  pages: PortfolioPage[]
  currentPath: string
  onNavigate: (path: string) => void
}

export function Header({
  pages,
  currentPath,
  onNavigate,
}: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="site-header">
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
