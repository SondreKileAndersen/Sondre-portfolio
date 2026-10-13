import type { TeachingInstitutionCardsSection } from '../../types/page'

export function TeachingInstitutionCardsBlock({ cards, subjectsLabel, variant = 'three', tone = 'light' }: TeachingInstitutionCardsSection & {
  tone?: 'light' | 'dark'
}) {
  return (
    <section className={`teaching-institution-cards teaching-institution-cards--${variant} section-tone--${tone}`}>
      <div className="teaching-institution-cards__grid">
        {cards.map((card) => (
          <article key={card.id} className="institution-card teaching-institution-card" data-institution={card.id}>
            <div className="teaching-institution-card__identity">
              <div className="teaching-institution-card__logo-frame">
                <img className="institution-card__logo" src={card.logoSrc} alt={card.logoAlt} loading="lazy" decoding="async" />
              </div>
              <div className="teaching-institution-card__body">
                <div className="institution-card__content">
                  <h2>{card.title}</h2>
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
          </article>
        ))}
      </div>
    </section>
  )
}
