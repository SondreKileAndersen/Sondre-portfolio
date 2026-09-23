import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { LogoMarqueeSection } from '../../types/page'
import { PointingHandIcon } from '../ui/PointingHandIcon'

export function LogoMarqueeBlock({ heading, introduction, logos }: LogoMarqueeSection) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const measuredGroupRef = useRef<HTMLUListElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<number | null>(null)
  const pointerSpeedRef = useRef(0)
  const offsetRef = useRef(0)
  const focusedRef = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    const viewport = viewportRef.current
    const measuredGroup = measuredGroupRef.current
    const track = trackRef.current
    if (!viewport || !measuredGroup || !track) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let groupWidth = 0
    let automaticSpeed = 40
    let lastTime = 0
    let frame = 0

    const measure = () => {
      // Two copies cover the viewport in either direction, even with few logos.
      const minimumWidth = `${viewport.clientWidth}px`
      for (const group of track.children) {
        const element = group as HTMLElement
        if (element.style.minWidth !== minimumWidth) element.style.minWidth = minimumWidth
      }
      groupWidth = measuredGroup.getBoundingClientRect().width
      const configuredSpeed = Number.parseFloat(window.getComputedStyle(viewport)
        .getPropertyValue('--logo-marquee-speed'))
      automaticSpeed = Number.isFinite(configuredSpeed) ? configuredSpeed : 40
    }
    const animate = (time: number) => {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
      lastTime = time
      const speed = anchorRef.current !== null
        ? pointerSpeedRef.current
        : focusedRef.current || reducedMotion.matches ? 0 : automaticSpeed
      if (groupWidth > 0) {
        offsetRef.current = ((offsetRef.current + speed * elapsed) % groupWidth + groupWidth) % groupWidth
        track.style.transform = `translateX(${-offsetRef.current}px)`
      }
      frame = window.requestAnimationFrame(animate)
    }
    measure()
    frame = window.requestAnimationFrame(animate)
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(measuredGroup)
    resizeObserver.observe(viewport)
    return () => {
      resizeObserver.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [logos])

  const renderLogos = (duplicate = false) => (
    <ul
      ref={duplicate ? undefined : measuredGroupRef}
      className="logo-marquee__group"
      aria-hidden={duplicate || undefined}
    >
      {logos.map((logo) => (
          <li key={`${duplicate ? 'duplicate-' : ''}${logo.id}`}>
            <span className="logo-marquee__logo">
            <img
              src={logo.src}
              alt={duplicate ? '' : logo.alt}
              loading="lazy"
              decoding="async"
            />
              <span
                className="logo-marquee__silhouette"
                aria-hidden="true"
                style={{ maskImage: `url(${JSON.stringify(logo.src)})` }}
              />
            </span>
          </li>
      ))}
    </ul>
  )

  return (
    <section className="logo-marquee-block">
      {(heading || introduction) && (
        <header className="logo-marquee__header">
          {heading && <h2>{heading}</h2>}
          {introduction && <p>{introduction}</p>}
        </header>
      )}
      <div
        className="logo-marquee__controls"
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse') return
          const bounds = event.currentTarget.getBoundingClientRect()
          anchorRef.current = bounds.left + bounds.width / 2
          const sensitivity = Number.parseFloat(window.getComputedStyle(event.currentTarget)
            .getPropertyValue('--logo-marquee-pointer-sensitivity')) || 1
          const distance = event.clientX - anchorRef.current
          pointerSpeedRef.current = Math.sign(distance)
            * Math.max(0, Math.abs(distance) - 10) * sensitivity
        }}
        onPointerMove={(event) => {
          if (anchorRef.current === null) return
          const bounds = event.currentTarget.getBoundingClientRect()
          anchorRef.current = bounds.left + bounds.width / 2
          const sensitivity = Number.parseFloat(window.getComputedStyle(event.currentTarget)
            .getPropertyValue('--logo-marquee-pointer-sensitivity')) || 1
          const distance = event.clientX - anchorRef.current
          const deadZone = 10
          pointerSpeedRef.current = Math.sign(distance)
            * Math.max(0, Math.abs(distance) - deadZone) * sensitivity
        }}
        onPointerLeave={() => {
          anchorRef.current = null
          pointerSpeedRef.current = 0
        }}
        onFocusCapture={() => { focusedRef.current = true }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) focusedRef.current = false
        }}
      >
      <div ref={viewportRef} className="logo-marquee__viewport">
        <div ref={trackRef} className="logo-marquee__track">
          {renderLogos()}
          {renderLogos(true)}
        </div>
      </div>
      </div>
      <div className="logo-marquee__hint" role="img" aria-label={t('logoMarquee.mouseHint')}>
        <span aria-hidden="true">{'<'}</span>
        <PointingHandIcon />
        <span aria-hidden="true">{'>'}</span>
      </div>
    </section>
  )
}
