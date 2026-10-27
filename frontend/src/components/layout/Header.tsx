import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PortfolioPage } from '../../types/page'
import { Navigation } from './Navigation'
import { ContactIcon } from '../ui/ContactIcon'
import { MobileNavigationDialog } from './MobileNavigationDialog'
import { MenuIcon } from '../ui/MenuIcon'

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
  const contactDialogRef = useRef<HTMLDialogElement>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [contactClosing, setContactClosing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [headerOutOfView, setHeaderOutOfView] = useState(false)
  const [backToTopMounted, setBackToTopMounted] = useState(false)
  const [backToTopDismissed, setBackToTopDismissed] = useState(false)
  const backToTopVisible = headerOutOfView && !backToTopDismissed

  useEffect(() => {
    if (backToTopVisible) {
      setBackToTopMounted(true)
      return
    }
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 250
    const timer = window.setTimeout(() => setBackToTopMounted(false), delay)
    return () => window.clearTimeout(timer)
  }, [backToTopVisible])

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const observer = new IntersectionObserver(([entry]) => {
      const outOfView = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0
      setHeaderOutOfView(outOfView)
      if (!outOfView) setBackToTopDismissed(false)
    })
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  const closeContact = () => {
    if (contactClosing) return
    setContactClosing(true)
    window.setTimeout(() => {
      setContactOpen(false)
      setContactClosing(false)
    }, 320)
  }

  useEffect(() => {
    const dialog = contactDialogRef.current
    if (!dialog) return
    if (contactOpen && !dialog.open) dialog.showModal()
    if (!contactOpen && dialog.open) dialog.close()
  }, [contactOpen])

  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const address = ['sondre.kile', 'hotmail.com'].join('@')
    window.location.href = `mailto:${address}`
  }

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
    <header ref={headerRef} className={`site-header site-header--${tone}${currentPath === '/' ? ' site-header--home' : ''}`}>
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
          <span>Sondre Kile Andersen</span>
        </strong>
      </a>
      <button ref={menuButtonRef} className="site-header__menu-toggle" type="button"
        aria-label={`${t(mobileMenuOpen ? 'actions.close' : 'actions.open')} ${t('accessibility.mainNavigation')}`}
        aria-expanded={mobileMenuOpen} aria-controls="mobile-header-navigation"
        onClick={() => setMobileMenuOpen(open => !open)}>
        <MenuIcon />
      </button>
      <Navigation
        id="header-navigation"
        pages={pages}
        currentPath={currentPath}
        onNavigate={path => { setMobileMenuOpen(false); onNavigate(path) }}
      />
      <button className="site-header__contact" type="button" onClick={() => { setContactClosing(false); setContactOpen(true) }}>{t('footer.contact')}</button>
      <MobileNavigationDialog triggerRef={menuButtonRef} open={mobileMenuOpen} onClose={() => {
        setMobileMenuOpen(false)
        if (matchMedia('(max-width: 760px)').matches) menuButtonRef.current?.focus()
      }}
        pages={pages} currentPath={currentPath} onNavigate={onNavigate}
        onContact={() => { setContactClosing(false); setContactOpen(true) }} />
      <dialog
        ref={contactDialogRef}
        className={`contact-dialog${contactClosing ? ' contact-dialog--closing' : ''}`}
        aria-label={t('footer.contact')}
        onClose={() => { setContactOpen(false); setContactClosing(false) }}
        onCancel={(event) => { event.preventDefault(); closeContact() }}
        onClick={(event) => { if (event.target === event.currentTarget) closeContact() }}
      >
        <button className="contact-dialog__close" type="button" onClick={closeContact} aria-label={t('actions.close')}>×</button>
        <h2>{t('footer.contact')}</h2>
        <div className="contact-dialog__details">
          <p className="contact-dialog__item"><ContactIcon name="location" />{t('footer.location')}</p>
          <a className="contact-dialog__item" href="#email" onClick={openEmail}><ContactIcon name="email" />{t('footer.email')}</a>
          <a className="contact-dialog__item" href="https://www.linkedin.com/in/sondre-kile-andersen-797105a1/" target="_blank" rel="noopener noreferrer"><span className="contact-dialog__linkedin-icon" aria-hidden="true">in</span>LinkedIn</a>
        </div>
        <small>{t('footer.references')}</small>
      </dialog>
      {backToTopMounted && <button className={`floating-control back-to-top${backToTopVisible ? '' : ' back-to-top--leaving'}`} type="button"
        aria-hidden={!backToTopVisible} tabIndex={backToTopVisible ? 0 : -1}
        aria-label={t('actions.backToTop')} title={t('actions.backToTop')}
        onClick={() => {
          setBackToTopDismissed(true)
          window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
        }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 7-7 7 7M12 5v15" /></svg>
      </button>}
    </header>
  )
}
