import type { CardGridSection } from '../../types/page'

export function CardGridBlock({ heading, cards }: CardGridSection) {
  return (
    <section className="card-grid-block">
      {heading && <h2>{heading}</h2>}
      <div className="card-grid-block__grid">
        {cards.map((card) => {
          const content = (
            <>
              <img src={card.imageSrc} alt={card.imageAlt} loading="lazy" decoding="async" />
              <div className="card-grid-block__content">
                <strong>{card.title}</strong>
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
