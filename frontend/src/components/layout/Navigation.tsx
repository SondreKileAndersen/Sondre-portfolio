import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PortfolioPage } from '../../types/page'

type NavigationProps = {
  id?: string
  includeHome?: boolean
  pages: PortfolioPage[]
  currentPath: string
  onNavigate: (path: string) => void
}

export function Navigation({ id, pages, currentPath, onNavigate, includeHome = false }: NavigationProps) {
  const { t } = useTranslation()
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    const currentPage = pages.find((page) => page.path === currentPath)
    return currentPage?.parentId ?? null
  })

  const topLevelPages = pages.filter(
    (page) => (page.showInNav !== false || (includeHome && page.id === 'home')) && !page.parentId,
  )

  const pageLink = (page: PortfolioPage) => (
    <a
      key={page.id}
      href={page.path}
      aria-current={currentPath === page.path ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(page.path)
      }}
    >
      <span className="nav-label">{page.navTitle}</span>
    </a>
  )

  return (
    <nav id={id} aria-label={t('accessibility.mainNavigation')}>
      <ul>
        {topLevelPages.map((page) => {
          const childPages = pages.filter(
            (candidate) =>
              candidate.parentId === page.id && candidate.showInNav !== false,
          )

          return (
            <li key={page.id}>
              <div className="nav-item">
                {pageLink(page)}
                {childPages.length > 0 && (
                  <button
                    className="submenu-toggle"
                    type="button"
                    aria-label={t('accessibility.toggleMenu', {
                      action: t(
                        openMenu === page.id ? 'actions.close' : 'actions.open',
                      ),
                      title: page.navTitle,
                    })}
                    aria-expanded={openMenu === page.id}
                    aria-controls={`${page.id}-submenu`}
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === page.id ? null : page.id,
                      )
                    }
                  >
                    <span aria-hidden="true" />
                  </button>
                )}
              </div>
              {childPages.length > 0 && openMenu === page.id && (
                <ul
                  id={`${page.id}-submenu`}
                  aria-label={t('accessibility.pageSubmenu', {
                    title: page.navTitle,
                  })}
                >
                  {childPages.map((childPage) => (
                    <li key={childPage.id}>{pageLink(childPage)}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
