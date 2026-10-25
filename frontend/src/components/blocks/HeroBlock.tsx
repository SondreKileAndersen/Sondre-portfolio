import type { HeroSection } from '../../types/page'

export function HeroBlock({
  heading,
  headingHighlight,
  subtitle,
  imageSrc,
  imageAlt,
  paragraphs,
  actions,
}: HeroSection) {
  return (
    <section className={`hero${imageSrc ? '' : ' hero--text-only'}`} aria-labelledby="hero-heading">
      {imageSrc && <figure className="hero-portrait">
        <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
      </figure>}
      <div className="hero-content">
        <header className="hero-heading">
        {subtitle && <p className="hero-heading__subtitle">{subtitle}</p>}
        <h1 id="hero-heading">
          {headingHighlight && heading.includes(headingHighlight)
            ? <>{heading.split(headingHighlight)[0]}<span className="hero-heading__highlight">{headingHighlight}</span>{heading.slice(heading.indexOf(headingHighlight) + headingHighlight.length)}</>
            : heading}
        </h1>
        </header>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {actions && <div className="hero-actions">
          {actions.map((action) => <a key={action.id} className="hero-action" href={action.href}>{action.label}{action.icon === 'arrowDown' && <svg className="hero-action__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>}</a>)}
        </div>}
      </div>
    </section>
  )
}
