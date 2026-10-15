import type { NavigationCardsSection } from '../../types/page'

export function NavigationCardsBlock({ cards }: NavigationCardsSection) {
  return (
    <section className="navigation-cards" aria-label="Veier videre">
      {cards.map((card) => (
        <a key={card.id} className="navigation-cards__card" href={card.href}>
          <img className="navigation-cards__image" src={card.imageSrc} alt="" aria-hidden="true" />
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
