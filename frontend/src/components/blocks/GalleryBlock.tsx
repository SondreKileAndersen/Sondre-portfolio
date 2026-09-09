import type { GallerySection } from '../../types/page'

export function GalleryBlock({
  heading,
  paragraphs,
  images,
  galleryPosition,
}: GallerySection) {
  return (
    <section
      className={`gallery-block gallery-block--gallery-${galleryPosition}`}
    >
      <div className="gallery-block__content">
        <h3>{heading}</h3>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="gallery-block__images">
        {images.map((image) => (
          <figure
            key={image.id}
            className={`gallery-block__image gallery-block__image--${image.imageFit ?? 'cover'}`}
          >
            <img src={image.src} alt={image.alt} />
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
