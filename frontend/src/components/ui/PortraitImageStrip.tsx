import type { GalleryImage } from '../../types/page'

export function PortraitImageStrip({ images }: { images: GalleryImage[] }) {
  return <div className="portrait-image-strip">
    {images.map(image => <figure key={image.id}>
      <img src={image.src} alt={image.alt}
        style={{ objectPosition: `${Math.max(0, Math.min(100, image.cropX ?? 50))}% center` }} loading="lazy" decoding="async" />
    </figure>)}
  </div>
}
