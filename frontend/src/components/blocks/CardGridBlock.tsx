import type { CardGridSection } from '../../types/page'

export function CardGridBlock({ heading, cards }: CardGridSection) {
  return (
    <section className="card-grid-block">
      {heading && <h3>{heading}</h3>}
      <div className="card-grid-block__grid">
        {cards.map((card) => {
          const content = (
            <>
              <img src={card.imageSrc} alt={card.imageAlt} />
              <div className="card-grid-block__content">
                <h4>{card.title}</h4>
                <p>{card.text}</p>
                {card.actionLabel && <span>{card.actionLabel}</span>}
              </div>
            </>
          )

          return card.href ? (
            <a key={card.id} href={card.href} className="card-grid-block__card">
              {content}
            </a>
          ) : (
            <article key={card.id} className="card-grid-block__card">
              {content}
            </article>
          )
        })}
      </div>
    </section>
  )
}
