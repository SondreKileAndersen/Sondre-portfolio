import type { TeachingInstitutionCardsSection } from '../../types/page'
import { InstitutionCardFrame } from '../ui/InstitutionCardFrame'

export function TeachingInstitutionCardsBlock({ cards, subjectsLabel, variant = 'three', appearance = 'default', tone = 'light' }: TeachingInstitutionCardsSection & {
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`teaching-institution-cards teaching-institution-cards--${variant} teaching-institution-cards--${appearance} section-tone--${tone}`}>
      <div className="teaching-institution-cards__grid">
        {cards.map((card) => (
          <InstitutionCardFrame key={card.id} id={card.id} logoSrc={card.logoSrc} appearance={appearance}>
            <div className="teaching-institution-card__identity">
              <div className="teaching-institution-card__logo-frame">
                <img className="institution-card__logo" src={card.logoSrc} alt={card.logoAlt} loading="lazy" decoding="async" />
              </div>
              <div className="teaching-institution-card__body">
                <div className="institution-card__content">
                  <p className="institution-card__title"><strong>{card.title}</strong></p>
                  <p className="teaching-institution-card__period">{card.period}</p>
                  <ul className="teaching-institution-card__roles">
                    {card.roles.map((role) => <li key={role}>{role}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            <div className="teaching-institution-card__section teaching-institution-card__subjects">
              <h3>{subjectsLabel}</h3>
              <ul>{card.subjects.map((subject) => <li key={subject}>{subject}</li>)}</ul>
            </div>
          </InstitutionCardFrame>
        ))}
      </div>
    </section>
  )
}
