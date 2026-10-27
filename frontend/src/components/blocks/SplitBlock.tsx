import { Fragment } from 'react'
import { InlineText } from '../ui/InlineText'
import { MediaExampleLabel } from '../ui/MediaExampleLabel'
import type { SplitSection } from '../../types/page'
import { ToolLogoRow } from '../ui/ToolLogoRow'
import { LineIcon } from '../ui/LineIcon'
import './coverIntroduction.css'

export function SplitBlock({
  id,
  heading,
  paragraphs,
  imageSrc,
  imageAlt,
  caption,
  imagePosition = 'left',
  imageFit = 'cover',
  objectPosition,
  layout = 'split',
  callout,
  secondaryImageSrc,
  secondaryImageAlt,
  imageStrip,
  variant = 'default',
  eyebrow,
  tone,
  note,
  actionLabel,
  actionHref,
  actionExternal,
  actionAfterParagraph,
  actions,
  toolLogos,
  outcome,
}: SplitSection) {
  const resolvedTone = tone ?? (imagePosition === 'right' ? 'dark' : 'light')
  return (
    <section id={id} className={`split-block split-block--image-${imagePosition} split-block--${variant} split-block--layout-${layout} section-tone--${resolvedTone}`}>
      {imageStrip?.length ? <div className="split-block__media split-block__media--strip">
        {imageStrip.map(image => <img key={image.id} src={image.src} alt={image.alt} style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined} loading="lazy" decoding="async" />)}
      </div> : secondaryImageSrc ? <div className="split-block__media split-block__media--pair">
        <img src={imageSrc} alt={imageAlt} style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
        <img src={secondaryImageSrc} alt={secondaryImageAlt ?? ''} loading="lazy" />
      </div> : <figure
        className={`split-block__media split-block__media--${imageFit}`}
      >
        <img src={imageSrc} alt={imageAlt} style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
        {caption && variant !== 'caseStudy' && <figcaption>{caption}</figcaption>}
      </figure>}
      <div className="split-block__content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <h2>{heading}</h2>}
        {paragraphs.map((paragraph, index) => (
          <Fragment key={paragraph}><p><InlineText text={paragraph} /></p>
          {actionAfterParagraph === index && actionLabel && actionHref && <a className="case-study__action" href={actionHref} target={actionExternal ? '_blank' : undefined} rel={actionExternal ? 'noopener noreferrer' : undefined}>{actionLabel}</a>}
          </Fragment>
        ))}
        {toolLogos && <ToolLogoRow logos={toolLogos} />}
        {callout && <aside className={`split-block__callout content-callout${callout.theme ? ` content-callout--${callout.theme}` : ''}${callout.icon ? ' split-block__callout--with-icon' : ''}`}>
          {callout.icon && <LineIcon name={callout.icon} />}
          <div className="split-block__callout-content">
            {callout.heading ? <div className="learning-journey-step__highlight-header"><strong>{callout.heading}</strong>{callout.label && <span className="split-block__callout-label"><MediaExampleLabel label={callout.label} /></span>}</div> : callout.label && <span className="split-block__callout-label"><MediaExampleLabel label={callout.label} /></span>}
            <p>{callout.text}</p>
            {callout.action && <a className="case-study__action" href={callout.action.href} target={callout.action.external ? '_blank' : undefined} rel={callout.action.external ? 'noopener noreferrer' : undefined}>{callout.action.label}</a>}
          </div>
        </aside>}
        {((actionAfterParagraph === undefined && actionLabel && actionHref) || actions?.length) ? <div className="split-block__actions">
        {actionAfterParagraph === undefined && actionLabel && actionHref && <a className="case-study__action" href={actionHref}>{actionLabel} <span aria-hidden="true">→</span></a>}
        {actions?.map(action => (
          <a
            key={action.id}
            className="case-study__action"
            href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
          >
            {action.label} <span aria-hidden="true">{action.external ? '↗' : '→'}</span>
          </a>
        ))}
        </div> : null}
      </div>
      {note && <p className="case-study__note">{note}</p>}
    </section>
  )
}
