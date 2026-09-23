import { useState } from 'react'
import type { LearningJourneyClosingSection, LearningJourneyIntroSection, LearningJourneyStepSection } from '../../types/page'
import { FeatureImageMosaic } from '../ui/FeatureImageMosaic'
import { LineIcon } from '../ui/LineIcon'

export function LearningJourneyIntroBlock({ eyebrow, heading, paragraphs, imageSrc, imageAlt }: LearningJourneyIntroSection) {
  return <section className="learning-journey-intro">
    <div className="learning-journey-intro__copy">
      <p className="learning-journey__eyebrow">{eyebrow}</p>
      <h1>{heading}</h1>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <img src={imageSrc} alt={imageAlt} loading="eager" fetchPriority="high" decoding="async" />
  </section>
}

function StarterCardsVisual({ cards }: { cards: LearningJourneyStepSection['cards'] }) {
  const [topCardId, setTopCardId] = useState<string | null>(null)

  return <div className="learning-journey__starter-cards">
    <div className="learning-journey__starter-cards-stack">
      {cards?.map((card) => <article
        key={card.id}
        className={`learning-journey__starter-card learning-journey__starter-card--${card.id}${topCardId === card.id ? ' learning-journey__starter-card--on-top' : ''}`}
        onMouseEnter={() => setTopCardId(card.id)}
      >
        <div className="learning-journey__starter-card-preview teaching-resource-card__media" data-category={card.categoryId}>
          <img src={card.imageSrc} alt="" loading="lazy" decoding="async" />
          <span>{card.label}</span>
          {card.logoSrc && <img className="learning-journey__starter-card-logo" src={card.logoSrc} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />}
        </div>
        <span className="learning-journey__starter-card-title">{card.title}</span>
      </article>)}
    </div>
  </div>
}

function JourneyVisual({ step }: { step: LearningJourneyStepSection }) {
  if (step.visual === 'starterCards') return <StarterCardsVisual cards={step.cards} />
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
  return step.imageSrc && <img className={`learning-journey__visual-image learning-journey__visual-image--${step.imageFit ?? 'cover'}`} src={step.imageSrc} alt={step.imageAlt ?? ''} loading="lazy" decoding="async" />
}

export function LearningJourneyStepBlock(step: LearningJourneyStepSection) {
  return <section className={`learning-journey-step learning-journey-step--${step.imagePosition}${step.visual === 'starterCards' ? ' learning-journey-step--starter-cards' : ''}`}>
    <div className="learning-journey-step__copy">
      <p className="learning-journey__eyebrow">{step.eyebrow}</p>
      <h2>{step.heading}</h2>
      {step.highlights && <div className="learning-journey-step__highlights">{step.highlights.map((item) => <div key={item.id}><strong>{item.heading}</strong><p>{item.description}</p></div>)}</div>}
      {step.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
    <div className="learning-journey-step__marker" aria-hidden="true"><span>{step.number}</span></div>
    <div className="learning-journey-step__visual"><JourneyVisual step={step} /></div>
  </section>
}

export function LearningJourneyClosingBlock({ eyebrow, quote, footer, imageSrc, imageAlt }: LearningJourneyClosingSection) {
  return <section className="learning-journey-closing">
    <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
    <div className="learning-journey-closing__content">
      <p className="learning-journey__eyebrow">{eyebrow}</p>
      <blockquote>{quote}</blockquote>
      <p className="learning-journey-closing__footer">{footer}</p>
    </div>
  </section>
}
