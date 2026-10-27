import { useEffect, useRef, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { PortfolioPage } from '../../types/page'
import { Navigation } from './Navigation'
import { MenuIcon } from '../ui/MenuIcon'

export function MobileNavigationDialog({ open, onClose, pages, currentPath, onNavigate, onContact, triggerRef }: {
  triggerRef: RefObject<HTMLButtonElement | null>
  open: boolean
  onClose: () => void
  pages: PortfolioPage[]
  currentPath: string
  onNavigate: (path: string) => void
  onContact: () => void
}) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && dialog && triggerRef.current) {
      const bounds = triggerRef.current.getBoundingClientRect()
      dialog.style.setProperty('--menu-toggle-top', `${bounds.top}px`)
      dialog.style.setProperty('--menu-toggle-right', `${document.documentElement.clientWidth - bounds.right}px`)
    }
    if (open && dialog && !dialog.open) { setClosing(false); dialog.showModal() }
    if (!open && dialog?.open) dialog.close()
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [open, triggerRef])
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    const desktop = matchMedia('(min-width: 761px)')
    const reset = () => { if (desktop.matches && open) { clearTimeout(timer.current); onClose() } }
    desktop.addEventListener('change', reset)
    return () => desktop.removeEventListener('change', reset)
  }, [open, onClose])

  const close = (after?: () => void) => {
    if (closing) return
    setClosing(true)
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300
    timer.current = setTimeout(() => {
      dialogRef.current?.close()
      onClose()
      after?.()
    }, duration)
  }

  return <dialog ref={dialogRef} id="mobile-header-navigation"
    className={`mobile-navigation-dialog${closing ? ' mobile-navigation-dialog--closing' : ''}`}
    aria-label={t('accessibility.mainNavigation')}
    onCancel={event => { event.preventDefault(); close() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close()
    }}>
    <button className="mobile-navigation-dialog__close" type="button" onClick={() => close()} aria-label={t('actions.close')} autoFocus><MenuIcon close /></button>
    <Navigation includeHome pages={pages} currentPath={currentPath} onNavigate={path => close(() => onNavigate(path))} />
    <button className="site-header__contact" type="button" onClick={() => close(onContact)}>{t('footer.contact')}</button>
  </dialog>
}
