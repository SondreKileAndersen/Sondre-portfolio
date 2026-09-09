import type { TextSection } from '../../types/page'

export function TextBlock({ heading, paragraphs, items }: TextSection) {
  return (
    <section className="text-block">
      {heading && <h3>{heading}</h3>}
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
      </div>
    </section>
  )
}
