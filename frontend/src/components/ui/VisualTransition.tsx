export type VisualTransitionData = {
  steps: Array<{
    id: string
    src: string
    alt: string
    iconTone?: 'blue' | 'green'
  }>
}

export function VisualTransition({ steps }: VisualTransitionData) {
  if (steps.length === 0) return null

  return (
    <div className="visual-transition">
      {steps.map((item, index) => (
        <div className="visual-transition__step" key={item.id}>
          {index > 0 && (
            <svg className="visual-transition__arrow" viewBox="0 0 64 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12h58M50 3l10 9-10 9" />
            </svg>
          )}
          <span className="visual-transition__badge" data-icon-tone={item.iconTone}>
            <span role="img" aria-label={item.alt} className="visual-transition__symbol"
              style={{ maskImage: `url(${JSON.stringify(item.src)})` }} />
          </span>
        </div>
      ))}
    </div>
  )
}
