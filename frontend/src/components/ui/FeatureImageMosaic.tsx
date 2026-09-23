import type { GalleryImage } from '../../types/page'

export function FeatureImageMosaic({ images }: {
  images: Array<Pick<GalleryImage, 'id' | 'src' | 'alt'>>
}) {
  const [primaryImage, ...secondaryImages] = images
  if (!primaryImage) return null

  return (
    <div className="feature-image-mosaic">
      <figure className="feature-image-mosaic__primary">
        <img src={primaryImage.src} alt={primaryImage.alt} loading="lazy" decoding="async" />
      </figure>
      <div className="feature-image-mosaic__secondary">
        {secondaryImages.slice(0, 2).map((image) => (
          <figure key={image.id}>
            <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  )
}
