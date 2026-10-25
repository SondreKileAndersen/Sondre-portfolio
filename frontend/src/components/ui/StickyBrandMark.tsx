import type { BrandMark } from '../../types/page'
import { useEffect, useRef } from 'react'

type StickyBrandMarkProps = {
  brand?: BrandMark
}

export function StickyBrandMark({ brand }: StickyBrandMarkProps) {
  const markRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mark = markRef.current
    const rail = mark?.parentElement
    if (!mark || !rail) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      if (motion.matches) {
        mark.style.removeProperty('translate')
        return
      }
      const styles = getComputedStyle(mark)
      const railBounds = rail.getBoundingClientRect()
      const naturalTop = railBounds.top + parseFloat(getComputedStyle(rail).paddingTop)
      const pinTop = parseFloat(styles.top)
      const configuredDistance = parseFloat(styles.getPropertyValue('--brand-follow-distance'))
      const distance = Number.isFinite(configuredDistance) ? Math.max(0, configuredDistance) : 400
      if (distance === 0) {
        mark.style.removeProperty('translate')
        return
      }
      const startTop = pinTop + distance
      const endTop = pinTop - distance
      const progress = Math.max(0, Math.min(1, (naturalTop - endTop) / (2 * distance)))
      // Match normal scroll velocity at entry and slow continuously to pinned.
      const softTop = naturalTop >= startTop ? naturalTop : pinTop + distance * progress ** 2
      const bottomLimit = railBounds.bottom - mark.offsetHeight
      const stickyTop = Math.min(Math.max(naturalTop, pinTop), bottomLimit)
      const offset = Math.max(0, Math.min(softTop, bottomLimit) - stickyTop)
      mark.style.translate = `0 ${offset}px`
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(rail)
    observer.observe(mark)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    update()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
    }
  }, [brand])
  if (!brand) return null

  return (
    <div ref={markRef} className={`sticky-brand sticky-brand--${brand.groupId}${brand.badgeColor ? ' sticky-brand--badge' : ''}`} style={brand.badgeColor ? { backgroundColor: brand.badgeColor } : undefined}>
      <img src={brand.src} alt={brand.alt} loading="lazy" decoding="async" />
    </div>
  )
}
