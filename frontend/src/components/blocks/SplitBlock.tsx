import type { SplitSection } from '../../types/page'
import { ToolLogoRow } from '../ui/ToolLogoRow'

export function SplitBlock({
  heading,
  paragraphs,
  imageSrc,
  imageAlt,
  caption,
  imagePosition = 'left',
  imageFit = 'cover',
  secondaryImageSrc,
  secondaryImageAlt,
  variant = 'default',
  eyebrow,
  tone,
  note,
  actionLabel,
  actionHref,
  toolLogos,
  outcome,
}: SplitSection) {
  const resolvedTone = tone ?? (imagePosition === 'right' ? 'dark' : 'light')
  return (
    <section className={`split-block split-block--image-${imagePosition} split-block--${variant} section-tone--${resolvedTone}`}>
      {secondaryImageSrc ? <div className="split-block__media split-block__media--pair">
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
        <img src={secondaryImageSrc} alt={secondaryImageAlt ?? ''} loading="lazy" />
      </div> : <figure
        className={`split-block__media split-block__media--${imageFit}`}
      >
        <img src={imageSrc} alt={imageAlt} loading="lazy" />
        {caption && variant !== 'caseStudy' && <figcaption>{caption}</figcaption>}
      </figure>}
      <div className="split-block__content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <h2>{heading}</h2>}
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {toolLogos && <ToolLogoRow logos={toolLogos} />}
        {actionLabel && actionHref && <a className="case-study__action" href={actionHref}>{actionLabel} <span aria-hidden="true">→</span></a>}
      </div>
      {note && <p className="case-study__note">{note}</p>}
    </section>
  )
}
