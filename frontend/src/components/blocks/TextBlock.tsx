import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { TextSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'

export function TextBlock({ heading, paragraphs, items, variant = 'default', eyebrow, features, actionLabel, actionHref, leadImage, introSequence = false }: TextSection) {
  const principlesRef = useRef<HTMLElement>(null)
  const portraitStageRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLImageElement>(null)
  const hasIntroSequence = variant === 'principles' && introSequence && Boolean(leadImage)
  const [portraitReady, setPortraitReady] = useState(!hasIntroSequence)
  const [titleRevealed, setTitleRevealed] = useState(!hasIntroSequence)
  const [sequenceComplete, setSequenceComplete] = useState(!hasIntroSequence)

  const markPortraitReady = useCallback(async (image: HTMLImageElement) => {
    try {
      await image.decode()
    } catch {
      // Continue if decoding is unavailable; the browser can still render the image.
    }
    setPortraitReady(true)
  }, [])

  useEffect(() => {
    if (!hasIntroSequence || !portraitRef.current?.complete) return
    void markPortraitReady(portraitRef.current)
  }, [hasIntroSequence, markPortraitReady])

  useLayoutEffect(() => {
    if (!hasIntroSequence || !portraitStageRef.current) return
    const stage = portraitStageRef.current
    const setStartPosition = () => {
      const bounds = stage.getBoundingClientRect()
      const x = window.innerWidth / 2 - (bounds.left + bounds.width / 2)
      stage.style.setProperty('--principles-portrait-start-x', `${x}px`)
    }
    setStartPosition()
    window.addEventListener('resize', setStartPosition)
    return () => window.removeEventListener('resize', setStartPosition)
  }, [hasIntroSequence])

  useEffect(() => {
    if (!hasIntroSequence || !portraitReady) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTitleRevealed(true)
      setSequenceComplete(true)
      return
    }
    const timer = window.setTimeout(() => setTitleRevealed(true), 1200)
    return () => window.clearTimeout(timer)
  }, [hasIntroSequence, portraitReady])

  useEffect(() => {
    if (!hasIntroSequence || !titleRevealed || sequenceComplete) return
    const timer = window.setTimeout(() => setSequenceComplete(true), 400)
    return () => window.clearTimeout(timer)
  }, [hasIntroSequence, sequenceComplete, titleRevealed])

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
    if (variant !== 'principles' || !principlesRef.current || !sequenceComplete) return

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
  }, [variant, sequenceComplete])

  if (variant === 'principles') {
    return (
      <section ref={principlesRef} className={`principles-block principles-block--animated${leadImage ? ' principles-block--with-portrait' : ''}${hasIntroSequence ? ' principles-block--intro-sequence' : ''}${portraitReady ? ' principles-block--portrait-ready' : ''}${titleRevealed ? ' principles-block--title-revealed' : ''}${sequenceComplete ? ' principles-block--sequence-complete' : ''}`}>
        <header>
          {leadImage && <div ref={portraitStageRef} className="principles-block__portrait-stage">
            {hasIntroSequence && <span className="principles-block__loader" aria-hidden="true" />}
            <img ref={portraitRef} className="principles-block__portrait" src={leadImage.src} alt={leadImage.alt} width={leadImage.width} height={leadImage.height} loading="eager" fetchPriority={leadImage.fetchPriority} decoding="async" onLoad={(event) => { void markPortraitReady(event.currentTarget) }} onError={() => setPortraitReady(true)} />
          </div>}
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
          <ul className={variant === 'education' ? 'text-block__education-list' : undefined}>
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
