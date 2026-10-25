import type { InstitutionCardsSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'
import { InstitutionCardFrame } from '../ui/InstitutionCardFrame'

export function InstitutionCardsBlock({ cards, appearance = 'default', tone = 'light' }: InstitutionCardsSection & {
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`institution-cards-block teaching-institution-cards teaching-institution-cards--${appearance} section-tone--${tone}`}>
      <div className="institution-cards-block__grid teaching-institution-cards__grid">
        {cards.map((card) => (
          <InstitutionCardFrame key={card.id} id={card.id} logoSrc={card.logoSrc} appearance={appearance} className="resource-institution-card">
            <div className="teaching-institution-card__identity">
              <div className="teaching-institution-card__logo-frame">
                <img className="institution-card__logo" src={card.logoSrc} alt={card.logoAlt} loading="lazy" decoding="async" />
              </div>
              <div className="teaching-institution-card__body">
                <div className="institution-card__content">
                  <p className="institution-card__title"><strong>{card.title}</strong></p>
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
          </InstitutionCardFrame>
        ))}
      </div>
    </section>
  )
}
