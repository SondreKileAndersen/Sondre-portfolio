import type { SplitSection } from '../../types/page'

export function SplitBlock({
  heading,
  paragraphs,
  imageSrc,
  imageAlt,
  caption,
  imagePosition,
  imageFit = 'cover',
}: SplitSection) {
  return (
    <section className={`split-block split-block--image-${imagePosition}`}>
      <figure
        className={`split-block__media split-block__media--${imageFit}`}
      >
        <img src={imageSrc} alt={imageAlt} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      <div className="split-block__content">
        {heading && <h3>{heading}</h3>}
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
