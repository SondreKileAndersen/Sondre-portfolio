import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { LearningJourneyClosingSection, LearningJourneyIntroSection, LearningJourneyStepSection } from '../../types/page'
import { FeatureImageMosaic } from '../ui/FeatureImageMosaic'
import { LineIcon } from '../ui/LineIcon'
import { MediaExampleLabel } from '../ui/MediaExampleLabel'
import { TeachingResourceCard, ResourceFilesDialog } from './TeachingResourcesBlock'
import type { TeachingResource } from '../../types/teachingResource'

export function LearningJourneyIntroBlock({ eyebrow, heading, paragraphs, specializationsLabel, specializations, imageSrc, imageAlt }: LearningJourneyIntroSection) {
  return <section className="learning-journey-intro">
    <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
    <div className="learning-journey-intro__copy">
      {eyebrow && <p className="learning-journey__eyebrow">{eyebrow}</p>}
      <h1>{heading}</h1>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {specializationsLabel && specializations && specializations.length > 0 && <div className="learning-journey-intro__specializations content-callout">
        <p>{specializationsLabel}</p>
        <ul>{specializations.map(specialization => <li key={specialization.id}><LineIcon name={specialization.icon} /><span>{specialization.label}</span></li>)}</ul>
      </div>}
    </div>
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
  useLayoutEffect(() => {
    const stack = stackRef.current
    const visual = stack?.parentElement
    const section = stack?.closest<HTMLElement>('.learning-journey-step')
    if (!stack || !visual || !section) return
    const cards = Array.from(stack.querySelectorAll<HTMLElement>('[data-starter-card]'))
    const collapsedBottoms = new Map<HTMLElement, number>()
    const layoutTop = (element: HTMLElement) => {
      let top = 0
      for (let current: HTMLElement | null = element; current; current = current.offsetParent as HTMLElement | null) {
        top += current.offsetTop
      }
      return top
    }
    const measure = () => {
      // Reserve rotated card bounds without following entrance or hover
      // animations, which must not change the space between sections.
      let bottom = stack.offsetHeight
      for (const card of cards) {
        // Opening a card must not resize its section or move its own center.
        if (!card.classList.contains('learning-journey__starter-card--expanded') && !card.hasAttribute('data-card-returning')) {
          const angle = (parseFloat(getComputedStyle(card).rotate) || 0) * Math.PI / 180
          collapsedBottoms.set(card, card.offsetTop
            + Math.max(0, card.offsetWidth * Math.sin(angle))
            + Math.max(0, card.offsetHeight * Math.cos(angle)))
        }
        bottom = Math.max(bottom, collapsedBottoms.get(card) ?? 0)
        if (window.matchMedia('(max-width: 800px)').matches && card.classList.contains('learning-journey__starter-card--expanded')) {
          bottom = Math.max(bottom, card.offsetHeight + 16)
        }
      }
      visual.style.setProperty('--starter-stack-overflow', `${Math.ceil(bottom - stack.offsetHeight)}px`)
      const centerY = layoutTop(section) + section.offsetHeight / 2 - layoutTop(stack)
      stack.style.setProperty('--starter-expanded-center-y', `${centerY}px`)
    }
    let measureFrame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(measure)
    })
    observer.observe(stack)
    observer.observe(section)
    cards.forEach(card => observer.observe(card))
    measure()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(measureFrame)
    }
  }, [])
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
  const resolveResource = (card: NonNullable<LearningJourneyStepSection['cards']>[number]) => {
    const resource = step.resources?.find(item => item.id === card.resourceId)
    return resource && card.imageSrc ? { ...resource, thumbnailSrc: card.imageSrc, thumbnailAlt: card.imageAlt ?? resource.thumbnailAlt } : resource
  }
  // Promote the original card before paint. Swapping a fading duplicate back
  // to its source could briefly reveal the old stacking order or an empty image.
  useLayoutEffect(() => {
    if (highlightedId && highlightedId !== frontCardId && highlightedId !== expandedId) promoteCard(highlightedId)
  }, [highlightedId, frontCardId, expandedId, promoteCard])
  useEffect(() => {
    openingUntil.current = performance.now() + 400
  }, [expandedId])
  useEffect(() => {
    if (!expandedId || selectedResource) return
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('.learning-journey__starter-card--expanded, .learning-journey-step__inline-action, dialog')) return
      onClose(expandedId)
    }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(expandedId) }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
  }, [expandedId, selectedResource, onClose])
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
        style={{ '--card-stack-z': cardOrder.indexOf(card.id) + 1, '--card-enter-delay': card.enterDelay !== undefined ? `${card.enterDelay}ms` : undefined } as CSSProperties}
        className={`learning-journey__starter-card learning-journey__starter-card--${card.id}${highlighted ? ' learning-journey__starter-card--on-top' : ''}${frontCardId === card.id ? ' learning-journey__starter-card--front' : ''}${expanded ? ' learning-journey__starter-card--expanded' : ''}`}
        onMouseEnter={() => { pointerCardId.current = card.id; onHighlight(card.id) }}
        onMouseLeave={() => {
          // Repositioning beneath a stationary pointer can itself emit leave.
          // Allow the opening transition to finish before interpreting exits.
          if (!window.matchMedia('(max-width: 800px)').matches && pointerCardId.current === card.id && expanded && !selectedResource && performance.now() >= openingUntil.current) onClose(card.id)
          pointerCardId.current = null
          onHighlight(null)
        }}
        onFocus={() => onHighlight(card.id)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onHighlight(null) }}
      >
        <TeachingResourceCard resource={resource} plainMedia={card.plainMedia} expanded={expanded} onToggle={() => onToggle(card.id)} detailsId={`${step.id}-${card.id}-details`} onChooseFiles={setSelectedResource} />
      </div>})}
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
  const sectionRef = useRef<HTMLElement>(null)
  const pendingCardTransitions = useRef<Array<{ id: string; start: Keyframe }>>([])
  const expansionProperties = ['top', 'left', 'width', 'transform', 'translate', 'rotate', 'scale'] as const
  const readExpansionFrame = (element: HTMLElement): Keyframe => {
    const style = getComputedStyle(element)
    return Object.fromEntries(expansionProperties.map(property => [property, style.getPropertyValue(property)]))
  }
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const changeExpandedCard = (nextId: string | null) => {
    if (nextId === expandedId) return
    const section = sectionRef.current
    const transitions: Array<{ id: string; start: Keyframe }> = []
    if (expandedId) {
      const outgoing = section?.querySelector<HTMLElement>(`[data-starter-card="${CSS.escape(expandedId)}"]`)
      if (outgoing) {
        transitions.push({ id: expandedId, start: readExpansionFrame(outgoing) })
        outgoing.setAttribute('data-card-returning', '')
      }
    }
    if (nextId) {
      const card = section?.querySelector<HTMLElement>(`[data-starter-card="${CSS.escape(nextId)}"]`)
      if (card) transitions.push({ id: nextId, start: readExpansionFrame(card) })
      // Once opened, this card must never replay its entrance from scale zero.
      card?.setAttribute('data-card-entered', '')
    }
    pendingCardTransitions.current = transitions
    setExpandedId(nextId)
  }
  const toggleCard = (id: string) => changeExpandedCard(id)
  useLayoutEffect(() => {
    const transitions = pendingCardTransitions.current
    pendingCardTransitions.current = []
    const animations: Array<{ card: HTMLElement; animation: Animation }> = []
    for (const { id, start } of transitions) {
      const card = sectionRef.current?.querySelector<HTMLElement>(`[data-starter-card="${CSS.escape(id)}"]`)
      if (!card) continue
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.removeAttribute('data-card-returning')
        continue
      }
      const animation = card.animate([start, readExpansionFrame(card)], { duration: 400, easing: 'ease' })
      animation.onfinish = () => card.removeAttribute('data-card-returning')
      animations.push({ card, animation })
    }
    return () => {
      for (const { card, animation } of animations) {
        animation.cancel()
        if (!pendingCardTransitions.current.some(transition => transition.id === card.dataset.starterCard)) {
          card.removeAttribute('data-card-returning')
        }
      }
    }
  }, [expandedId])
  const closeCard = (id: string) => { if (expandedId === id) changeExpandedCard(null) }
  const highlightExample = (id: string) => {
    if (expandedId && expandedId !== id) changeExpandedCard(null)
    setHighlightedId(id)
  }
  return <section ref={sectionRef} className={`learning-journey-step learning-journey-step--${step.imagePosition}${step.visual === 'starterCards' ? ' learning-journey-step--starter-cards' : ''}${step.variant === 'accented' ? ' learning-journey-step--accented' : ''}`}>
    <div className="learning-journey-step__copy">
      {step.eyebrow && <p className="learning-journey__eyebrow">{step.eyebrow}</p>}
      {step.heading && <h2>{step.heading}</h2>}
      {(step.lead || step.body) && <p className="learning-journey-step__lead">{step.lead && <strong>{step.lead}</strong>} {step.body}</p>}
      {step.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {step.inlineParagraphs?.map(paragraph => <p key={paragraph.id}>{paragraph.parts.map(part => part.categoryId
        ? <strong key={part.id} className="learning-journey__inline-emphasis" data-category={part.categoryId}>{part.text}</strong>
        : part.emphasis ? <strong key={part.id}>{part.text}</strong>
        : <span key={part.id}>{part.text}</span>)}</p>)}
      {step.highlights && <div className="learning-journey-step__highlights">{step.highlights.map((item) => <div key={item.id} className={item.variant === 'callout' ? 'content-callout' : undefined}><div className="learning-journey-step__highlight-header"><strong>{item.heading}</strong>{item.label && <span className="split-block__callout-label"><MediaExampleLabel label={item.label} /></span>}</div><p>{item.descriptionParts ? item.descriptionParts.map(part => part.resourceId
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
      {step.ctaLabel && <a className={`learning-journey-step__cta${step.visual === 'starterCards' ? ' learning-journey-step__cta--beside-cards' : ''}`} href="#teaching-resources-library">{step.ctaLabel}</a>}
    </div>
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
