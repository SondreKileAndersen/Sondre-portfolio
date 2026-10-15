import type { HeroSection } from '../../types/page'

export function HeroBlock({
  heading,
  headingHighlight,
  imageSrc,
  imageAlt,
  paragraphs,
  actions,
}: HeroSection) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <figure className="hero-portrait">
        <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
      </figure>
      <div className="hero-content">
        <h1 id="hero-heading">
          {headingHighlight && heading.includes(headingHighlight)
            ? <>{heading.split(headingHighlight)[0]}<span className="hero-heading__highlight">{headingHighlight}</span>{heading.slice(heading.indexOf(headingHighlight) + headingHighlight.length)}</>
            : heading}
        </h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {actions && <div className="hero-actions">
          {actions.map((action) => <a key={action.id} className="hero-action" href={action.href}>{action.label}</a>)}
        </div>}
      </div>
    </section>
  )
}
