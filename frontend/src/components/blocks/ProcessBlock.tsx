import type { ProcessSection } from '../../types/page'

export function ProcessBlock({ heading, paragraphs, steps }: ProcessSection) {
  return (
    <section className="process-block">
      <div className="process-block__intro">
        <h2>{heading}</h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <ol className="process-block__steps">
        {steps.map((step) => (
          <li key={step.id}>
            <strong>{step.label}</strong>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
