import { useTranslation } from 'react-i18next'
import type { MouseEvent } from 'react'
import { ContactIcon } from '../ui/ContactIcon'

export function Footer({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const { t } = useTranslation()
  const openEmail = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const address = ['sondre.kile', 'hotmail.com'].join('@')
    window.location.href = `mailto:${address}`
  }

  return <footer id="site-footer" className={`site-footer site-footer--${tone}`}>
    <div className="site-footer__inner">
      <nav aria-label={t('footer.contact')}>
        <p className="site-footer__item"><ContactIcon name="location" />{t('footer.location')}</p>
        <a className="site-footer__item" href="#email" onClick={openEmail}><ContactIcon name="email" />{t('footer.email')}</a>
        <a className="site-footer__item" href="https://www.linkedin.com/in/sondre-kile-andersen-797105a1/" target="_blank" rel="noopener noreferrer"><span className="site-footer__linkedin-icon" aria-hidden="true">in</span>LinkedIn</a>
        <a className="site-footer__item site-footer__cv" href="/cv/Sondre-Kile-Andersen-CV.pdf"><ContactIcon name="document" />{t('footer.cv')}</a>
        <small>{t('footer.references')}</small>
      </nav>
    </div>
  </footer>
}
