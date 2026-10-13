import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { LearningJourneyClosingSection, LearningJourneyIntroSection, LearningJourneyStepSection } from '../../types/page'
import { FeatureImageMosaic } from '../ui/FeatureImageMosaic'
import { LineIcon } from '../ui/LineIcon'
import { TeachingResourceCard, ResourceFilesDialog } from './TeachingResourcesBlock'
import type { TeachingResource } from '../../types/teachingResource'

export function LearningJourneyIntroBlock({ eyebrow, heading, paragraphs, imageSrc, imageAlt }: LearningJourneyIntroSection) {
  return <section className="learning-journey-intro">
    <div className="learning-journey-intro__copy">
      {eyebrow && <p className="learning-journey__eyebrow">{eyebrow}</p>}
      <h1>{heading}</h1>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
  </section>
}

type StarterInteraction = {
  highlightedId: string | null
  expandedId: string | null
  onHighlight: (id: string | null) => void
  onToggle: (id: string) => void
  onClose: (id: string) => void
}

function ResourcePreviewLink({ resource, className, children }: { resource?: TeachingResource; className?: string; children: ReactNode }) {
  const previewUrl = resource?.previewUrl ?? resource?.resourceUrl
  if (!previewUrl) return <>{children}</>

  return <a className={className} href={previewUrl} target="_blank" rel="noreferrer" aria-label={resource?.title}>{children}</a>
}

function StarterCardsVisual({ step, highlightedId, expandedId, onHighlight, onToggle, onClose }: { step: LearningJourneyStepSection } & StarterInteraction) {
  const [selectedResource, setSelectedResource] = useState<TeachingResource | null>(null)
  const [cardWidth, setCardWidth] = useState<number>()
  const pointerCardId = useRef<string | null>(null)
  const openingUntil = useRef(0)
  const stackRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [frontCardId, setFrontCardId] = useState<string | null>(null)
  const [cardOrder, setCardOrder] = useState(() =>
    [...(step.cards ?? [])]
      .sort((first, second) => (first.stackZ ?? 0) - (second.stackZ ?? 0))
      .map(card => card.id),
  )
  const promoteCard = useCallback((id: string) => {
    setFrontCardId(id)
    setCardOrder(current => [...current.filter(cardId => cardId !== id), id])
  }, [])
  const [fadeCardId, setFadeCardId] = useState<string | null>(null)
  const resolveResource = (card: NonNullable<LearningJourneyStepSection['cards']>[number]) => {
    const resource = step.resources?.find(item => item.id === card.resourceId)
    return resource && card.imageSrc ? { ...resource, thumbnailSrc: card.imageSrc, thumbnailAlt: card.imageAlt ?? resource.thumbnailAlt } : resource
  }
  useEffect(() => {
    if (highlightedId && highlightedId !== frontCardId && highlightedId !== expandedId) setFadeCardId(highlightedId)
  }, [highlightedId, frontCardId, expandedId])
  const highlightedCard = step.cards?.find(card => card.id === fadeCardId)
  const highlightedResource = highlightedCard && resolveResource(highlightedCard)
  useLayoutEffect(() => {
    const copy = overlayRef.current
    const source = stackRef.current?.querySelector<HTMLElement>(`[data-starter-card="${fadeCardId}"]`)
    if (!copy || !source || !fadeCardId) return
    copy.querySelectorAll('button, a').forEach(element => {
      element.setAttribute('tabindex', '-1')
      element.removeAttribute('aria-controls')
    })
    let frame = 0
    const synchronize = () => {
      const style = getComputedStyle(source)
      // Mirror the rendered geometry, including entrance, scale and float.
      for (const property of ['top', 'left', 'right', 'width', 'height', 'transform', 'transform-origin', 'translate', 'rotate', 'scale']) {
        copy.style.setProperty(property, style.getPropertyValue(property))
      }
      frame = requestAnimationFrame(synchronize)
    }
    synchronize()
    const fade = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? undefined
      : copy.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease', fill: 'forwards' })
    const finish = () => { promoteCard(fadeCardId); setFadeCardId(null) }
    if (fade) fade.onfinish = finish
    else finish()
    return () => {
      cancelAnimationFrame(frame)
      fade?.cancel()
    }
  }, [fadeCardId, expandedId, promoteCard])
  useEffect(() => {
    openingUntil.current = performance.now() + 400
  }, [expandedId])
  useEffect(() => {
    const libraryCard = document.querySelector<HTMLElement>('.teaching-resources__grid .teaching-resource-card')
    if (!libraryCard) return
    const updateWidth = () => setCardWidth(libraryCard.offsetWidth)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(libraryCard)
    return () => observer.disconnect()
  }, [])
  return <div className="learning-journey__starter-cards teaching-resources">
    <div ref={stackRef} className="learning-journey__starter-cards-stack" style={cardWidth ? { '--starter-card-width': `${cardWidth}px` } as CSSProperties : undefined}>
      {step.cards?.map((card) => {
        const resource = resolveResource(card)
        if (!resource) return null
        const expanded = expandedId === card.id
        const highlighted = highlightedId === card.id || expanded
        return <div
        key={card.id}
        data-starter-card={card.id}
        style={{ '--card-stack-z': cardOrder.indexOf(card.id) + 1, '--card-enter-delay': card.enterDelay ? `${card.enterDelay}ms` : undefined } as CSSProperties}
        className={`learning-journey__starter-card learning-journey__starter-card--${card.id}${highlighted ? ' learning-journey__starter-card--on-top' : ''}${frontCardId === card.id ? ' learning-journey__starter-card--front' : ''}${expanded ? ' learning-journey__starter-card--expanded' : ''}`}
        onMouseEnter={() => { pointerCardId.current = card.id; onHighlight(card.id) }}
        onMouseLeave={(event) => {
          if (event.relatedTarget instanceof Element && event.relatedTarget.closest(`[data-starter-overlay="${card.id}"]`)) return
          // Repositioning beneath a stationary pointer can itself emit leave.
          // Allow the opening transition to finish before interpreting exits.
          if (pointerCardId.current === card.id && expanded && !selectedResource && performance.now() >= openingUntil.current) onClose(card.id)
          pointerCardId.current = null
          onHighlight(null)
        }}
        onFocus={() => onHighlight(card.id)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onHighlight(null) }}
      >
        <TeachingResourceCard resource={resource} plainMedia={card.plainMedia} expanded={expanded} onToggle={() => onToggle(card.id)} detailsId={`${step.id}-${card.id}-details`} onChooseFiles={setSelectedResource} />
      </div>})}
      {fadeCardId && fadeCardId !== expandedId && highlightedResource && <div
        key={`overlay-${fadeCardId}`}
        ref={overlayRef}
        className={`learning-journey__starter-card learning-journey__starter-card--${fadeCardId} learning-journey__starter-card--overlay`}
        data-starter-overlay={fadeCardId}
        aria-hidden="true"
        onMouseEnter={() => { pointerCardId.current = fadeCardId; onHighlight(fadeCardId) }}
        onMouseLeave={event => {
          if (event.relatedTarget instanceof Element && event.relatedTarget.closest(`[data-starter-card="${fadeCardId}"]`)) return
          pointerCardId.current = null
          onHighlight(null)
        }}
      >
        <TeachingResourceCard resource={highlightedResource} plainMedia={highlightedCard?.plainMedia} expanded={false} onToggle={() => { promoteCard(fadeCardId); setFadeCardId(null); onToggle(fadeCardId) }} onChooseFiles={setSelectedResource} />
      </div>}
    </div>
    <ResourceFilesDialog resource={selectedResource} onClose={() => setSelectedResource(null)} />
  </div>
}

function JourneyVisual({ step, ...interaction }: { step: LearningJourneyStepSection } & StarterInteraction) {
  if (step.visual === 'starterCards') return <StarterCardsVisual step={step} {...interaction} />
  if (step.visual === 'mosaic') return <FeatureImageMosaic images={step.images ?? []} />
  if (step.visual === 'resourceScreen') return <div className="learning-journey__resource-scene">
    <div className="learning-journey__laptop">
      <div className="learning-journey__screen">
        <strong>{step.heading}</strong>
        <div className="learning-journey__screen-grid">
          {step.screenItems?.map((item) => <div key={item.id}>
            <LineIcon name={item.icon} /><strong>{item.title}</strong><small>{item.label}</small>
          </div>)}
        </div>
      </div>
      <span className="learning-journey__laptop-base" />
    </div>
  </div>
  const previewResource = step.resources?.find(resource => resource.id === step.previewResourceId)
  const image = step.imageSrc && <img className={`learning-journey__visual-image learning-journey__visual-image--${step.imageFit ?? 'cover'}`} src={step.imageSrc} alt={step.imageAlt ?? ''} loading="lazy" decoding="async" />
  return image && <ResourcePreviewLink resource={previewResource} className="learning-journey__visual-preview">{image}</ResourcePreviewLink>
}

export function LearningJourneyStepBlock(step: LearningJourneyStepSection) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const toggleCard = useCallback((id: string) => setExpandedId(id), [])
  const closeCard = useCallback((id: string) => setExpandedId(current => current === id ? null : current), [])
  const highlightExample = (id: string) => {
    setExpandedId(current => current === id ? current : null)
    setHighlightedId(id)
  }
  const spacingBeforeClass = step.spacingBefore && step.spacingBefore !== 'default'
    ? ` learning-journey-step--before-${step.spacingBefore}`
    : ''
  const spacingAfterClass = step.spacingAfter && step.spacingAfter !== 'default'
    ? ` learning-journey-step--after-${step.spacingAfter}`
    : ''

  return <section className={`learning-journey-step learning-journey-step--${step.imagePosition}${step.visual === 'starterCards' ? ' learning-journey-step--starter-cards' : ''}${spacingBeforeClass}${spacingAfterClass}${step.variant === 'accented' ? ' learning-journey-step--accented' : ''}`}>
    <div className="learning-journey-step__copy">
      {step.eyebrow && <p className="learning-journey__eyebrow">{step.eyebrow}</p>}
      {step.heading && <h2>{step.heading}</h2>}
      {(step.lead || step.body) && <p className="learning-journey-step__lead">{step.lead && <strong>{step.lead}</strong>} {step.body}</p>}
      {step.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {step.inlineParagraphs?.map(paragraph => <p key={paragraph.id}>{paragraph.parts.map(part => part.categoryId
        ? <strong key={part.id} className="learning-journey__inline-emphasis" data-category={part.categoryId}>{part.text}</strong>
        : <span key={part.id}>{part.text}</span>)}</p>)}
      {step.highlights && <div className="learning-journey-step__highlights">{step.highlights.map((item) => <div key={item.id}><strong>{item.heading}</strong><p>{item.descriptionParts ? item.descriptionParts.map(part => part.resourceId
        ? <ResourcePreviewLink key={part.id} resource={step.resources?.find(resource => resource.id === part.resourceId)} className="learning-journey-step__inline-preview">{part.text}</ResourcePreviewLink>
        : <span key={part.id}>{part.text}</span>) : item.description}</p></div>)}</div>}
      {step.examples?.length && <div className="learning-journey-step__examples">
        {step.examplesLabel && <strong>{step.examplesLabel}</strong>}
        <ol>{step.examples.map((example) => <li key={example.id}>
          {example.prefix && <>{example.prefix} </>}
          <button className="learning-journey-step__inline-action" data-category={example.categoryId} type="button"
            onMouseEnter={() => highlightExample(example.id)} onMouseLeave={() => setHighlightedId(null)}
            onFocus={() => highlightExample(example.id)} onBlur={() => setHighlightedId(null)}
            onClick={() => toggleCard(example.id)}
            aria-expanded={expandedId === example.id}
            aria-controls={`${step.id}-${example.id}-details`}
          >{example.label}</button>
          <span>{example.description}</span>
        </li>)}</ol>
      </div>}
      {step.ctaLabel && <a className="learning-journey-step__cta" href="#teaching-resources-library">{step.ctaLabel}</a>}
    </div>
    <div className="learning-journey-step__marker" aria-hidden="true"><span>{step.number}</span></div>
    <div className="learning-journey-step__visual"><JourneyVisual step={step} highlightedId={highlightedId} expandedId={expandedId} onHighlight={setHighlightedId} onToggle={toggleCard} onClose={closeCard} /></div>
  </section>
}

export function LearningJourneyClosingBlock({ eyebrow, quote, footer, imageSrc, imageAlt }: LearningJourneyClosingSection) {
  return <section className="learning-journey-closing">
    <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
    <div className="learning-journey-closing__content">
      {eyebrow && <p className="learning-journey__eyebrow">{eyebrow}</p>}
      <blockquote>{quote}</blockquote>
      {footer && <p className="learning-journey-closing__footer">{footer}</p>}
    </div>
  </section>
}
