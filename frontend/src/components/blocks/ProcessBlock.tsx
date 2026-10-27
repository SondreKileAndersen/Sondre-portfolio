import type { ProcessSection } from '../../types/page'
import type { CSSProperties } from 'react'

export function ProcessBlock({ heading, paragraphs, steps, outcome, variant = 'default' }: ProcessSection) {
  return (
    <section className={`process-block process-block--${variant}`}>
      <div className="process-block__intro">
        <h2>{heading}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ol className="process-block__steps">
        {steps.map((step) => (
          <li key={step.id} data-card-span={step.columnSpan} style={step.columnSpan ? { '--process-card-span': step.columnSpan } as CSSProperties : undefined}>
            {step.image && <figure className="process-block__image">
              <picture>
                {step.image.mobileSrc && <source media="(width < 650px)" srcSet={step.image.mobileSrc} />}
                <img src={step.image.src} alt={step.image.alt} loading="lazy" />
              </picture>
              {step.image.overlay && <img className="process-block__image-overlay" src={step.image.overlay.src} alt={step.image.overlay.alt} loading="lazy" />}
            </figure>}
            <div className="process-block__step-copy"><strong>{step.label}</strong><p>{step.description}</p></div>
          </li>
        ))}
      </ol>
      {outcome && <p className="process-block__outcome">{outcome}</p>}
    </section>
  )
}
