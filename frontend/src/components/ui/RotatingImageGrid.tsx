import { useEffect, useMemo, useRef, useState } from 'react'
import type { GalleryImage } from '../../types/page'

const GRID_SIZE = 4

function initialIndexes(imageCount: number) {
  return Array.from({ length: Math.min(GRID_SIZE, imageCount) }, (_, index) => index)
}

function RotatingImageCell({ image }: { image: GalleryImage }) {
  const [displayedImage, setDisplayedImage] = useState(image)
  const [incomingImage, setIncomingImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    if (image.id === displayedImage.id) return
    setIncomingImage(image)
  }, [displayedImage.id, image])

  const finishTransition = () => {
    if (!incomingImage) return
    setDisplayedImage(incomingImage)
    setIncomingImage(null)
  }

  return (
    <div className="rotating-image-grid__item">
      {incomingImage ? (
        <span
          className="rotating-image-grid__track"
          key={incomingImage.id}
          onAnimationEnd={finishTransition}
        >
          <img src={displayedImage.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span className="rotating-image-grid__spacer" aria-hidden="true" />
          <img src={incomingImage.src} alt={incomingImage.alt} loading="lazy" decoding="async" />
        </span>
      ) : (
        <img className="rotating-image-grid__base" src={displayedImage.src} alt={displayedImage.alt} loading="lazy" decoding="async" />
      )}
    </div>
  )
}

export function RotatingImageGrid({
  images,
  interval = 4000,
}: {
  images: GalleryImage[]
  interval?: number
}) {
  const imageIdentity = useMemo(() => images.map((image) => image.id).join('|'), [images])
  const [visibleIndexes, setVisibleIndexes] = useState(() => initialIndexes(images.length))
  const visibleIndexesRef = useRef(visibleIndexes)
  const lastChangedSlot = useRef<number | null>(null)

  useEffect(() => {
    const initial = initialIndexes(images.length)
    visibleIndexesRef.current = initial
    setVisibleIndexes(initial)
    lastChangedSlot.current = null
  }, [imageIdentity, images.length])

  useEffect(() => {
    if (images.length <= GRID_SIZE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      const current = visibleIndexesRef.current
      const availableSlots = current
        .map((_, index) => index)
        .filter((index) => index !== lastChangedSlot.current)
      const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)]
      if (slot === undefined) return

      const hiddenImages = images
        .map((_, index) => index)
        .filter((index) => !current.includes(index))
      const candidates = hiddenImages.length > 0
        ? hiddenImages
        : images.map((_, index) => index).filter((index) => index !== current[slot])
      const replacement = candidates[Math.floor(Math.random() * candidates.length)]
      if (replacement === undefined) return

      const next = [...current]
      next[slot] = replacement
      lastChangedSlot.current = slot
      visibleIndexesRef.current = next
      setVisibleIndexes(next)
    }, interval)

    return () => window.clearInterval(timer)
  }, [imageIdentity, images, interval])

  return (
    <div className="rotating-image-grid">
      {visibleIndexes.map((imageIndex, slot) => {
        const image = images[imageIndex]
        if (!image) return null
        return <RotatingImageCell image={image} key={`slot-${slot}`} />
      })}
    </div>
  )
}
