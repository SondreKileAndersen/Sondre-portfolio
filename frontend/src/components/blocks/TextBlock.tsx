import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { TextSection } from '../../types/page'
import { LineIcon } from '../ui/LineIcon'
import { PrinciplesFlowPath } from '../ui/PrinciplesFlowPath'

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
    const timer = window.setTimeout(() => setTitleRevealed(true), 1400)
    return () => window.clearTimeout(timer)
  }, [hasIntroSequence, portraitReady])

  if (variant === 'principles') {
    return (
      <section ref={principlesRef} className={`principles-block principles-block--animated${leadImage ? ' principles-block--with-portrait' : ''}${hasIntroSequence ? ' principles-block--intro-sequence' : ''}${portraitReady ? ' principles-block--portrait-ready' : ''}${titleRevealed ? ' principles-block--title-revealed' : ''}${sequenceComplete ? ' principles-block--sequence-complete' : ''}`}>
        <header>
          {leadImage && <div ref={portraitStageRef} className="principles-block__portrait-stage">
            {hasIntroSequence && <span className="principles-block__loader" aria-hidden="true" />}
            <div className="principles-block__portrait">
              <img ref={portraitRef} src={leadImage.src} alt={leadImage.alt} width={leadImage.width} height={leadImage.height} loading="eager" fetchPriority={leadImage.fetchPriority} decoding="async" onLoad={(event) => { void markPortraitReady(event.currentTarget) }} onError={() => setPortraitReady(true)} style={{ transform: `translate(${leadImage.positionX ?? 0}%, ${leadImage.positionY ?? 0}%) scale(${Math.max(0.01, leadImage.zoom ?? 1)}) scaleX(${leadImage.flipHorizontal ? -1 : 1})` }} />
            </div>
          </div>}
          <div className="principles-block__heading" onAnimationEnd={event => {
            if (event.target === event.currentTarget && event.animationName === 'principles-heading-unmask') setSequenceComplete(true)
          }}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {heading && <h2>{heading}</h2>}
          </div>
        </header>
        {features && (
          <ul className="principles-block__items">
            {features.map((feature) => (
              <li key={feature.id} data-icon-tone={feature.iconTone}>
                <LineIcon name={feature.icon} />
                <div className="principles-block__feature-copy">
                  <strong>{feature.heading}</strong>
                  <p>{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <PrinciplesFlowPath sectionRef={principlesRef} ready={sequenceComplete} />
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
