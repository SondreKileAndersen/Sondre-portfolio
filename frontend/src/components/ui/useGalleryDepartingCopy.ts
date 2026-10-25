import { useLayoutEffect, useRef, type RefObject } from 'react'
import { crossfadeLayers } from '../../lib/crossfadeLayers'

// Keep a front copy while the outgoing focus moves into its background layer.
export function useGalleryDepartingCopy(carouselRef: RefObject<HTMLDivElement | null>, activeId?: string) {
  const previousId = useRef(activeId)
  useLayoutEffect(() => {
    const outgoingId = previousId.current
    previousId.current = activeId
    const carousel = carouselRef.current
    if (!carousel || !outgoingId || outgoingId === activeId) return
    const source = carousel.querySelector<HTMLElement>(`.image-compare-carousel__track > [data-figure-id="${CSS.escape(outgoingId)}"]`)
    const host = carousel.querySelector<HTMLElement>('.image-compare-carousel__copies')
    if (!source || !host) return
    const copy = source.cloneNode(true) as HTMLElement
    copy.inert = true
    copy.setAttribute('aria-hidden', 'true')
    copy.removeAttribute('data-figure-id')
    copy.querySelectorAll<HTMLElement>('*').forEach(element => {
      element.removeAttribute('id')
      element.style.transition = 'none'
      if (element.matches('a, button, [tabindex]')) element.tabIndex = -1
    })
    host.appendChild(copy)
    const sourceCard = source.querySelector<HTMLElement>('.image-compare-carousel__card')
    const copyCard = copy.querySelector<HTMLElement>('.image-compare-carousel__card')
    const sourceMotion = source.querySelector<HTMLElement>('.image-pair__motion')
    const copyMotion = copy.querySelector<HTMLElement>('.image-pair__motion')
    const sourceImage = source.querySelector<HTMLElement>('.image-pair__item--after a')
    const copyImage = copy.querySelector<HTMLElement>('.image-pair__item--after a')
    const sourceBefore = source.querySelector<HTMLElement>('.image-pair__item--before')
    const copyBefore = copy.querySelector<HTMLElement>('.image-pair__item--before')
    const synchronize = () => {
      for (const [original, duplicate] of [[sourceCard, copyCard], [sourceMotion, copyMotion], [sourceImage, copyImage], [sourceBefore, copyBefore]]) {
        if (!original || !duplicate) continue
        const style = getComputedStyle(original)
        for (const property of ['top', 'left', 'width', 'height', 'transform', 'transform-origin', 'translate', 'rotate', 'scale', 'box-shadow', 'border-radius', 'clip-path', 'opacity', 'visibility']) {
          duplicate.style.setProperty(property, style.getPropertyValue(property))
        }
      }
      if (sourceImage && copyCard) {
        copyCard.style.setProperty('--carousel-tint-opacity', getComputedStyle(sourceImage, '::after').opacity)
      }
    }
    const stop = crossfadeLayers({
      incoming: source, outgoing: copy, styleSource: source, synchronize,
      properties: {
        fadeInDuration: '--research-gallery-copy-fade-in-duration',
        fadeOutDelay: '--research-gallery-copy-fade-out-delay',
        fadeOutDuration: '--research-gallery-copy-fade-out-duration',
      },
      onFinish: () => copy.remove(),
    })
    return () => { stop(); copy.remove() }
  }, [activeId, carouselRef])
}
