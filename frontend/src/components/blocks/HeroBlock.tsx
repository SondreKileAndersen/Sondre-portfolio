import type { HeroSection } from '../../types/page'
import { useState, type CSSProperties } from 'react'
import { EqualWidthLines } from '../ui/EqualWidthLines'

export function HeroBlock({
  heading,
  headingHighlight,
  subtitle,
  imageSrc,
  imageAlt,
  paragraphs,
  paragraphLayout,
  actions,
}: HeroSection) {
  const [textWidth, setTextWidth] = useState<number>()
  return (
    <section className={`hero${imageSrc ? '' : ' hero--text-only'}`} aria-labelledby="hero-heading">
      {imageSrc && <figure className="hero-portrait">
        <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
      </figure>}
      <div className="hero-content" style={textWidth ? { '--hero-copy-width': `${textWidth}px` } as CSSProperties : undefined}>
        <header className="hero-heading">
        {subtitle && <p className="hero-heading__subtitle">{subtitle}</p>}
        <h1 id="hero-heading">
          {headingHighlight && heading.includes(headingHighlight)
            ? <>{heading.split(headingHighlight)[0]}<span className="hero-heading__highlight">{headingHighlight}</span>{heading.slice(heading.indexOf(headingHighlight) + headingHighlight.length)}</>
            : heading}
        </h1>
        </header>
        {paragraphLayout === 'equalWidthLines' ? <EqualWidthLines lines={paragraphs} onWidthChange={setTextWidth} /> : paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {actions && <div className="hero-actions">
          {actions.map((action) => <a key={action.id} className="hero-action" href={action.href}>{action.label}{action.icon === 'arrowDown' && <svg className="hero-action__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>}</a>)}
        </div>}
      </div>
    </section>
  )
}
