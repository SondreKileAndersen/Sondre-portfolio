import type { InstitutionCardsSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'

export function InstitutionCardsBlock({ cards, tone = 'light' }: InstitutionCardsSection & {
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`institution-cards-block section-tone--${tone}`}>
      <div className="institution-cards-block__grid">
        {cards.map((card) => (
          <article key={card.id} className="institution-card">
            <img className="institution-card__logo" src={card.logoSrc} alt={card.logoAlt} loading="lazy" decoding="async" />
            <div className="institution-card__content">
              <h2>{card.title}</h2>
              <p className="institution-card__role">{card.role}</p>
              <p className="institution-card__description">{card.description}</p>
            </div>
            <ul className="institution-card__highlights">
              {card.highlights.map((highlight) => (
                <li key={highlight.id}>
                  <LineIcon name={highlight.icon} />
                  <strong>{highlight.label}</strong>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
