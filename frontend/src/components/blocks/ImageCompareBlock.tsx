import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { ImageCompareSection } from '../../types/page'
import { ImagePreviewDialog, type ImagePreviewSelection } from '../ui/ImagePreviewDialog'
import { useGalleryDepartingCopy } from '../ui/useGalleryDepartingCopy'

function ImagePair({ group, active = true, imageStyle, onImageLoad, onPreview }: {
  group: ImageCompareSection['groups'][number]
  active?: boolean
  imageStyle: CSSProperties
  onImageLoad: (image: HTMLImageElement) => void
  onPreview: (kind: 'before' | 'after') => void
}) {
  return (
    <div className="image-pair-group" role="group" aria-label={group.heading}>
      <div className="image-pair">
        <div className="image-pair__frame">
        <div className="image-pair__motion" style={imageStyle}>
        {group.images.map(image => (
          <figure key={image.id} className={`image-pair__item image-pair__item--${image.id}`}>
            <a href={image.src} tabIndex={active ? undefined : -1}
              onClick={event => { event.preventDefault(); if (active) onPreview(image.id) }}
              >
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
                onLoad={image.id === 'after' ? event => onImageLoad(event.currentTarget) : undefined}
              />
              {image.label && <span className="image-pair__label">{image.label}</span>}
            </a>
          </figure>
        ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export function ImageCompareBlock({ id, heading, introduction, groups }: ImageCompareSection) {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartRef = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const pointerPosition = useRef<{ x: number; y: number } | null>(null)
  const [layout, setLayout] = useState({ width: 0, height: 0, scale: .7, spread: .5, focusScale: 1, maxFocusScale: 1, tintStrength: .85, tintCurve: 1.4, autoplayInterval: 3000 })
  const [ratios, setRatios] = useState<Record<string, number>>({})
  const [preview, setPreview] = useState<ImagePreviewSelection | null>(null)
  const [hoverSide, setHoverSide] = useState<-1 | 0 | 1>(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [autoplayAllowed, setAutoplayAllowed] = useState(false)
  useGalleryDepartingCopy(carouselRef, groups[activeIndex]?.id)

  const updatePointerHover = useCallback(() => {
    const carousel = carouselRef.current
    const pointer = pointerPosition.current
    if (!carousel || !pointer) { setHoverSide(0); return }
    // Hit-test the current rendered image, not the target from the last mouse event.
    // This also respects masks, overlap and moving images under a stationary cursor.
    const target = document.elementFromPoint(pointer.x, pointer.y)
    const link = target?.closest('.image-pair__item a')
    if (!link || !carousel.contains(link) || link.closest('[data-active="true"]')) { setHoverSide(0); return }
    const image = carousel.querySelector<HTMLImageElement>('[data-active="true"] .image-pair__item--after img')
    if (!image) { setHoverSide(0); return }
    const rect = image.getBoundingClientRect()
    setHoverSide(pointer.x < rect.left ? -1 : pointer.x > rect.right ? 1 : 0)
  }, [])

  useEffect(() => {
    if (!isHovered || preview) { setHoverSide(0); return }
    let frame = 0
    const follow = () => { updatePointerHover(); frame = requestAnimationFrame(follow) }
    frame = requestAnimationFrame(follow)
    return () => cancelAnimationFrame(frame)
  }, [isHovered, preview, updatePointerHover])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setAutoplayAllowed(!motion.matches && document.visibilityState === 'visible')
    motion.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      motion.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useEffect(() => {
    if (!autoplayAllowed || isHovered || hasFocus || preview || groups.length < 2 || layout.autoplayInterval <= 0) return
    const timer = window.setTimeout(() => setActiveIndex(current => (current + 1) % groups.length), layout.autoplayInterval)
    return () => window.clearTimeout(timer)
  }, [activeIndex, autoplayAllowed, isHovered, hasFocus, preview, groups.length, layout.autoplayInterval])

  useLayoutEffect(() => {
    const carousel = carouselRef.current
    const frame = carousel?.querySelector<HTMLElement>('.image-pair__frame')
    if (!carousel || !frame) return
    const measure = () => {
      const styles = getComputedStyle(carousel)
      const scale = Number.parseFloat(styles.getPropertyValue('--research-gallery-scale'))
      const spread = Number.parseFloat(styles.getPropertyValue('--research-gallery-spread'))
      const tintStrength = Number.parseFloat(styles.getPropertyValue('--research-gallery-tint-strength'))
      const tintCurve = Number.parseFloat(styles.getPropertyValue('--research-gallery-tint-curve'))
      const intervalText = styles.getPropertyValue('--research-gallery-autoplay-interval').trim()
      const interval = Number.parseFloat(intervalText) * (intervalText.endsWith('ms') ? 1 : intervalText.endsWith('s') ? 1000 : 1)
      const focused = carousel.querySelector<HTMLElement>('[data-active="true"]')
      const focusScale = focused ? Number.parseFloat(getComputedStyle(focused).getPropertyValue('--research-gallery-focus-scale')) : 1
      const maxFocusScale = Math.max(1, ...Array.from(carousel.querySelectorAll<HTMLElement>('.image-compare-carousel__track > [data-figure-id]'), slide => {
        const value = Number.parseFloat(getComputedStyle(slide).getPropertyValue('--research-gallery-focus-scale'))
        return Number.isFinite(value) ? Math.max(.1, Math.min(3, value)) : 1
      }))
      const next = {
        width: frame.offsetWidth,
        height: frame.offsetHeight,
        scale: Number.isFinite(scale) ? Math.max(.1, Math.min(.95, scale)) : .7,
        spread: Number.isFinite(spread) ? Math.max(0, Math.min(1, spread)) : .5,
        focusScale: Number.isFinite(focusScale) ? Math.max(.1, Math.min(3, focusScale)) : 1,
        maxFocusScale,
        tintStrength: Number.isFinite(tintStrength) ? Math.max(0, Math.min(1, tintStrength)) : .85,
        tintCurve: Number.isFinite(tintCurve) ? Math.max(.1, tintCurve) : 1.4,
        autoplayInterval: Number.isFinite(interval) ? Math.max(0, interval) : 3000,
      }
      setLayout(previous => Object.keys(next).every(key => next[key as keyof typeof next] === previous[key as keyof typeof next]) ? previous : next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(carousel)
    observer.observe(frame)
    const styleObserver = new MutationObserver(measure)
    styleObserver.observe(document.head, { subtree: true, childList: true, characterData: true })
    styleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    measure()
    return () => { observer.disconnect(); styleObserver.disconnect() }
  }, [activeIndex, groups])

  const select = (index: number) => {
    if (groups.length) setActiveIndex((index % groups.length + groups.length) % groups.length)
  }
  const visibleDepth = 4
  const slides = groups.flatMap((group, index) => {
    let offset = (index - activeIndex + groups.length) % groups.length
    if (offset > groups.length / 2) offset -= groups.length
    return Math.abs(offset) <= visibleDepth ? [{ group, index, offset, key: group.id }] : []
  })
  // A circular set with eight figures needs one repeated far-end figure
  // to provide four layers on both sides of the focused figure.
  if (groups.length > 1) {
    for (let offset = -visibleDepth; offset <= visibleDepth; offset += 1) {
      if (slides.some(slide => slide.offset === offset)) continue
      const index = ((activeIndex + offset) % groups.length + groups.length) % groups.length
      slides.push({ group: groups[index], index, offset, key: `${groups[index].id}-repeat-${offset}` })
    }
  }

  return (
    <section className="image-compare-block" aria-labelledby={`${id}-heading`}>
      <div className="image-compare-block__intro">
        <h2 id={`${id}-heading`}>{heading}</h2>
        {introduction && <p>{introduction}</p>}
      </div>
      <div ref={carouselRef} className="image-compare-carousel" tabIndex={0} aria-label={heading}
        onMouseEnter={event => {
          pointerPosition.current = { x: event.clientX, y: event.clientY }
          setIsHovered(true)
        }}
        onFocusCapture={event => setHasFocus(event.target.matches(':focus-visible'))}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false)
        }}
        onMouseMove={event => {
          pointerPosition.current = { x: event.clientX, y: event.clientY }
          updatePointerHover()
        }}
        onMouseLeave={() => { pointerPosition.current = null; setHoverSide(0); setIsHovered(false) }}
        style={layout.height > 0 ? {
          '--carousel-max-focus-scale': layout.maxFocusScale,
        } as CSSProperties : undefined}
        onClickCapture={event => {
          if (event.detail === 0) return
          const target = event.target as HTMLElement
          if (!target.closest('.image-pair__item a')) return
          if (target.closest('[data-active="true"] .image-pair__item--before')) return
          const image = event.currentTarget.querySelector<HTMLImageElement>('[data-active="true"] .image-pair__item--after img')
          if (!image || groups.length < 2) return
          const rect = image.getBoundingClientRect()
          if (event.clientX >= rect.left && event.clientX <= rect.right) return
          event.preventDefault()
          event.stopPropagation()
          setHoverSide(0)
          select(activeIndex + (event.clientX < (rect.left + rect.right) / 2 ? -1 : 1))
        }}
        onTouchStart={event => {
          touchStartRef.current = (event.target as HTMLElement).closest('.image-pair__item a') ? event.touches[0].clientX : null
        }}
        onTouchEnd={event => {
          if (touchStartRef.current === null) return
          const movement = event.changedTouches[0].clientX - touchStartRef.current
          touchStartRef.current = null
          if (Math.abs(movement) > 40) select(activeIndex + (movement < 0 ? 1 : -1))
        }}
        onTouchCancel={() => { touchStartRef.current = null }}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          select(activeIndex + (event.key === 'ArrowRight' ? 1 : -1))
        }}>
        <div className="image-compare-carousel__track">
          {slides.map(({ group, index, offset, key }) => {
            const distance = Math.abs(offset)
            const tint = distance === visibleDepth ? 1 : layout.tintStrength * (distance / visibleDepth) ** layout.tintCurve
            const isActive = offset === 0
            const scale = layout.scale ** distance
            const exposedWidths = Array.from({ length: distance }, (_, level) => layout.scale ** (level + 1) * layout.spread)
              .reduce((sum, width) => sum + width, 0)
            // Each outward edge extends by the same fraction of that card's scaled width.
            const horizontalOffset = distance ? Math.sign(offset) * (.5 + exposedWidths - scale / 2) : 0
            const imageWidth = layout.height * (ratios[group.id] ?? 1)
            const fit = distance || !imageWidth ? 1 : Math.min(1, layout.width / imageWidth) * layout.focusScale
            const imageLeft = distance ? (offset < 0 ? 0 : layout.width - imageWidth) : (layout.width - imageWidth) / 2
            return <div key={key} className="image-compare-carousel__slide"
              data-active={isActive} data-depth={distance} data-figure-id={group.id} data-side={offset < 0 ? 'left' : 'right'} style={{ zIndex: visibleDepth + 1 - distance }}>
              <div className="image-compare-carousel__card" style={{
                transform: `translateX(${-50 + horizontalOffset * 100}%) scale(calc(${scale} * ${distance === 1 && Math.sign(offset) === hoverSide ? 'var(--research-gallery-hover-scale)' : 1}))`,
                '--carousel-tint-opacity': tint,
              } as CSSProperties}
                role={isActive ? 'group' : 'button'} tabIndex={isActive ? -1 : 0} aria-label={group.heading}
                onClickCapture={event => {
                  if (isActive) return
                  event.preventDefault()
                  event.stopPropagation()
                  select(activeIndex + Math.sign(offset))
                }}
                onKeyDown={event => {
                  if (isActive || (event.key !== 'Enter' && event.key !== ' ')) return
                  event.preventDefault()
                  event.stopPropagation()
                  select(activeIndex + Math.sign(offset))
                }}>
                <ImagePair group={group} active={isActive}
                  onPreview={kind => { setHoverSide(0); setPreview({ index, kind }) }}
                  imageStyle={layout.height ? { width: imageWidth, height: layout.height, left: imageLeft, transform: `translateY(-50%) scale(${fit})` } : {}}
                  onImageLoad={image => {
                    const ratio = image.naturalWidth / image.naturalHeight
                    if (Number.isFinite(ratio) && ratio > 0) setRatios(previous => previous[group.id] === ratio ? previous : { ...previous, [group.id]: ratio })
                  }} />
              </div>
            </div>
          })}
          <div className="image-compare-carousel__copies" aria-hidden="true" />
        </div>
      </div>
      {preview && <ImagePreviewDialog groups={groups} selection={preview} onChange={setPreview} onClose={() => setPreview(null)} />}
    </section>
  )
}
