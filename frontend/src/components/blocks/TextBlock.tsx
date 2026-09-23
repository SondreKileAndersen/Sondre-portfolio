import { useEffect, useRef } from 'react'
import type { TextSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'

export function TextBlock({ heading, paragraphs, items, variant = 'default', eyebrow, features, actionLabel, actionHref, leadImage }: TextSection) {
  const principlesRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (variant !== 'principles') return
    const section = principlesRef.current
    const title = section?.querySelector('h2')
    const timeline = section?.querySelector<HTMLElement>('.principles-block__timeline')
    const firstIcon = section?.querySelector<SVGElement>('.principles-block__items li > svg')
    if (!section || !title || !timeline || !firstIcon) return
    const measureLineStart = () => {
      const timelineBounds = timeline.getBoundingClientRect()
      const iconBounds = firstIcon.getBoundingClientRect()
      section.style.setProperty('--principles-line-y', `${iconBounds.top + iconBounds.height / 2 - timelineBounds.top}px`)
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT)
      let lastText: Text | null = null
      while (walker.nextNode()) {
        if (walker.currentNode.textContent?.trim()) lastText = walker.currentNode as Text
      }
      if (!lastText) return
      const end = lastText.data.trimEnd().length
      const range = document.createRange()
      range.setStart(lastText, end - 1)
      range.setEnd(lastText, end)
      const lastLetter = range.getBoundingClientRect()
      section.style.setProperty('--principles-line-start', `${lastLetter.right + 12 - timelineBounds.left}px`)
    }
    measureLineStart()
    const observer = new ResizeObserver(measureLineStart)
    observer.observe(section)
    observer.observe(title)
    return () => observer.disconnect()
  }, [variant, heading, leadImage])

  useEffect(() => {
    if (variant !== 'principles' || !principlesRef.current) return

    const section = principlesRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0

    const revealAllFeatures = () => {
      section.querySelectorAll('.principles-block__items li').forEach((item) => {
        item.classList.add('principles-feature--visible')
      })
    }

    const revealFeaturesAtLine = () => {
      const line = section.querySelector<HTMLElement>('.principles-block__line')
      const items = [...section.querySelectorAll<HTMLElement>('.principles-block__items li')]

      if (!line || items.length === 0) return

      if (window.getComputedStyle(line).display === 'none') {
        revealAllFeatures()
        return
      }

      const trackLine = () => {
        const lineEnd = line.getBoundingClientRect().right

        items.forEach((item) => {
          if (item.classList.contains('principles-feature--visible')) return
          const icon = item.querySelector('svg')
          if (!icon) return

          const iconBounds = icon.getBoundingClientRect()
          const iconCenter = iconBounds.left + iconBounds.width / 2

          if (lineEnd >= iconCenter) item.classList.add('principles-feature--visible')
        })

        if (items.some((item) => !item.classList.contains('principles-feature--visible'))) {
          animationFrame = window.requestAnimationFrame(trackLine)
        }
      }

      animationFrame = window.requestAnimationFrame(trackLine)
    }

    if (reducedMotion) {
      section.classList.add('principles-block--visible')
      revealAllFeatures()
      return
    }

    let observer: IntersectionObserver
    let hasStarted = false

    const observeCentralViewport = () => {
      observer?.disconnect()
      if (hasStarted) return

      // Exclude 20% at each edge: trigger inside the central 60% of viewport height.
      const edgeInset = window.innerHeight * 0.2
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          hasStarted = true
          section.classList.add('principles-block--visible')
          revealFeaturesAtLine()
          observer.disconnect()
        },
        { rootMargin: `-${edgeInset}px 0px -${edgeInset}px 0px`, threshold: 0 },
      )
      observer.observe(section)
    }

    observeCentralViewport()
    window.addEventListener('resize', observeCentralViewport)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeCentralViewport)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [variant])

  if (variant === 'principles') {
    return (
      <section ref={principlesRef} className={`principles-block principles-block--animated${leadImage ? ' principles-block--with-portrait' : ''}`}>
        <header>
          {leadImage && <img className="principles-block__portrait" src={leadImage.src} alt={leadImage.alt} width={leadImage.width} height={leadImage.height} loading="eager" fetchPriority={leadImage.fetchPriority} decoding="async" />}
          <div className="principles-block__heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {heading && <h2>{heading}</h2>}
          </div>
        </header>
        {features && (
          <ul className="principles-block__items">
            {features.map((feature) => (
              <li key={feature.id}>
                <LineIcon name={feature.icon} />
                <strong>{feature.heading}</strong>
                <p>{feature.description}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="principles-block__timeline" aria-hidden="true">
          <span className="principles-block__line" />
        </div>
      </section>
    )
  }

  return (
    <section className={`text-block text-block--${variant}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {heading && <h2>{heading}</h2>}
      <div className="text-block__body">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {items && (
          <ul>
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {actionLabel && actionHref && (
          <a className="text-block__action" href={actionHref}>
            <span aria-hidden="true">→</span> {actionLabel}
          </a>
        )}
      </div>
    </section>
  )
}
