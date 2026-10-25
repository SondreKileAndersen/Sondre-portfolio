import type { QuoteSection } from '../../types/page'

export function QuoteBlock({ id, heading, quote, title, role, imageSrc, imageAlt }: QuoteSection) {
  return (
    <section className="quote-block" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>{heading}</h2>
      <figure className="quote-block__reference">
        <img className="quote-block__portrait" src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
        <div className="quote-block__content">
          <blockquote><p>{quote}</p></blockquote>
          <figcaption>
            <strong>{title}</strong>
            <span>{role}</span>
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
