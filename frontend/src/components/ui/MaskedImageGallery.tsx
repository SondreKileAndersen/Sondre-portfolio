import { useEffect, useState } from 'react'
import type { GalleryImage } from '../../types/page'

export function MaskedImageGallery({ images, interval = 4000, autoplay = false }: {
  images: GalleryImage[]
  interval?: number
  autoplay?: boolean
}) {
  const [activeId, setActiveId] = useState(images[0]?.id)
  const [paused, setPaused] = useState(false)
  const activeIndex = Math.max(0, images.findIndex(image => image.id === activeId))

  useEffect(() => {
    if (!autoplay || paused || images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => setActiveId(images[(activeIndex + 1) % images.length].id), interval)
    return () => window.clearTimeout(timer)
  }, [activeIndex, autoplay, images, interval, paused])

  if (!images.length) return null
  const previewWidth = images.length > 1 ? Math.min(6, 25 / (images.length - 1)) : 0
  const mainWidth = 100 - previewWidth * (images.length - 1)

  return <div className="masked-image-gallery" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
    }}>
    {images.map((image, index) => {
      const left = index * previewWidth + (index > activeIndex ? mainWidth - previewWidth : 0)
      const right = 100 - left - (index === activeIndex ? mainWidth : previewWidth)
      return <div key={image.id} className="masked-image-gallery__layer" data-active={index === activeIndex}>
        <button type="button" className="masked-image-gallery__panel" aria-pressed={index === activeIndex}
          onClick={() => setActiveId(image.id)} style={{ clipPath: `inset(0 calc(${right}% + var(--masked-gallery-gap) / 2) 0 calc(${left}% + var(--masked-gallery-gap) / 2))` }}>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
            style={{ left: `calc(${index * previewWidth}% + var(--masked-gallery-gap) / 2)`, width: `calc(${mainWidth}% - var(--masked-gallery-gap))` }} />
        </button>
      </div>
    })}
  </div>
}
