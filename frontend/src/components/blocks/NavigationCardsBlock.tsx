import type { NavigationCardsSection } from '../../types/page'
import { useTranslation } from 'react-i18next'

export function NavigationCardsBlock({ cards }: NavigationCardsSection) {
  const { t } = useTranslation()
  return (
    <section className="navigation-cards" aria-label={t('accessibility.pageNavigation')}>
      {cards.map((card) => (
        <a key={card.id} data-card-id={card.id} className="navigation-cards__card" href={card.href}>
          {card.imageSrc && <img className="navigation-cards__image" src={card.imageSrc} alt="" aria-hidden="true" />}
          <div className="navigation-cards__content">
            <div className="navigation-cards__heading">
              <h2>{card.title}</h2>
            </div>
            <p>{card.description}</p>
            <span aria-hidden="true">→</span>
          </div>
        </a>
      ))}
    </section>
  )
}
