import type { InstitutionCardsSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'

export function InstitutionCardsBlock({ cards, tone = 'light' }: InstitutionCardsSection & {
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`institution-cards-block teaching-institution-cards section-tone--${tone}`}>
      <div className="institution-cards-block__grid teaching-institution-cards__grid">
        {cards.map((card) => (
          <article key={card.id} className="institution-card teaching-institution-card resource-institution-card" data-institution={card.id}>
            <div className="teaching-institution-card__identity">
              <div className="teaching-institution-card__logo-frame">
                <img className="institution-card__logo" src={card.logoSrc} alt={card.logoAlt} loading="lazy" decoding="async" />
              </div>
              <div className="teaching-institution-card__body">
                <div className="institution-card__content">
                  <h2>{card.title}</h2>
                  {card.period && <p className="teaching-institution-card__period">{card.period}</p>}
                  <p className="institution-card__role">{card.role}</p>
                </div>
              </div>
            </div>
            <div className="teaching-institution-card__section resource-institution-card__details">
              <p className="institution-card__description">{card.description}</p>
              <ul className="institution-card__highlights">
                {card.highlights.map((highlight) => (
                  <li key={highlight.id}>
                    <LineIcon name={highlight.icon} />
                    <strong>{highlight.label}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
