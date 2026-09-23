import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CarouselArrow } from './CarouselArrow'

type CollageImage = {
  id: string
  src: string
  alt: string
}

type AutoImageCollageProps = {
  images: CollageImage[]
  interval?: number
}

export function AutoImageCollage({ images, interval = 4000 }: AutoImageCollageProps) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [incomingReady, setIncomingReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const changeImage = (direction: 1 | -1) => {
    if (incomingIndex !== null) return

    const nextIndex = (activeIndex + direction + images.length) % images.length

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveIndex(nextIndex)
      return
    }

    setIncomingReady(false)
    setIncomingIndex(nextIndex)
  }

  useEffect(() => {
    if (
      images.length <= 1 ||
      isPaused ||
      incomingIndex !== null
    ) {
      return
    }

    const timer = window.setTimeout(() => {
      changeImage(1)
    }, interval)

    return () => window.clearTimeout(timer)
  }, [activeIndex, images.length, incomingIndex, interval, isPaused])

  if (images.length === 0) return null

  const activeImage = images[activeIndex]
  const incomingImage = incomingIndex === null ? null : images[incomingIndex]

  const showPrevious = () => {
    changeImage(-1)
  }

  const showNext = () => {
    changeImage(1)
  }

  return (
    <div
      className="auto-image-collage"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
    >
      <img
        className="auto-image-collage__image auto-image-collage__image--current"
        src={activeImage.src}
        alt={activeImage.alt}
        loading="lazy"
      />
      {incomingImage && (
        <img
          className={`auto-image-collage__image auto-image-collage__image--incoming${incomingReady ? ' auto-image-collage__image--ready' : ''}`}
          src={incomingImage.src}
          alt={incomingImage.alt}
          loading="eager"
          onLoad={() => setIncomingReady(true)}
          onError={() => {
            setIncomingIndex(null)
            setIncomingReady(false)
          }}
          onAnimationEnd={() => {
            if (incomingIndex === null) return
            setActiveIndex(incomingIndex)
            setIncomingIndex(null)
            setIncomingReady(false)
          }}
        />
      )}
      {images.length > 1 && (
        <>
          <CarouselArrow
            direction="previous"
            onClick={showPrevious}
            label={t('gallery.previous')}
          />
          <CarouselArrow
            direction="next"
            onClick={showNext}
            label={t('gallery.next')}
          />
        </>
      )}
    </div>
  )
}
