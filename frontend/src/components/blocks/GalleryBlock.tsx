import type { GallerySection } from '../../types/page'
import { AutoImageCollage } from '../ui/AutoImageCollage'
import { VisualTransition } from '../ui/VisualTransition'
import { ToolLogoRow } from '../ui/ToolLogoRow'
import { RotatingImageGrid } from '../ui/RotatingImageGrid'
import { FeatureImageMosaic } from '../ui/FeatureImageMosaic'

export function GalleryBlock({
  heading,
  paragraphs,
  images,
  galleryPosition = 'right',
  variant = 'default',
  eyebrow,
  tone = 'light',
  note,
  actionLabel,
  actionHref,
  autoplay = false,
  interval,
  visualTransition,
  toolLogos,
  galleryMode = 'default',
  outcome,
}: GallerySection) {
  const visibleImages = variant === 'caseStudy' ? images.slice(0, 1) : images

  return (
    <section
      className={`gallery-block gallery-block--gallery-${galleryPosition} gallery-block--${variant} section-tone--${tone}`}
    >
      <div className="gallery-block__content">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{heading}</h2>
        {visualTransition && <VisualTransition {...visualTransition} />}
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {toolLogos && <ToolLogoRow logos={toolLogos} />}
        {actionLabel && actionHref && <a className="case-study__action" href={actionHref}>{actionLabel} <span aria-hidden="true">→</span></a>}
      </div>
      <div className="gallery-block__images">
        {galleryMode === 'rotatingGrid' ? (
          <RotatingImageGrid images={images} interval={interval} />
        ) : galleryMode === 'featureMosaic' ? (
          <FeatureImageMosaic images={images} />
        ) : autoplay ? <AutoImageCollage images={images} interval={interval} /> : (
          <>
        {visibleImages.map((image) => (
          <figure
            key={image.id}
            className={`gallery-block__image gallery-block__image--${image.imageFit ?? 'cover'}`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
            {variant !== 'caseStudy' && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
          </>
        )}
      </div>
      {note && <p className="case-study__note">{note}</p>}
    </section>
  )
}
