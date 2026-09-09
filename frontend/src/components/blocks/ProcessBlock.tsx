import type { ProcessSection } from '../../types/page'

export function ProcessBlock({ heading, paragraphs, steps }: ProcessSection) {
  return (
    <section className="process-block">
      <div className="process-block__intro">
        <h3>{heading}</h3>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ol className="process-block__steps">
        {steps.map((step) => (
          <li key={step.id}>
            <h4>{step.label}</h4>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
