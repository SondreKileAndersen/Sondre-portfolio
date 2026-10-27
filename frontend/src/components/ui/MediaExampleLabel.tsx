/** Separate the directional marker from localized copy so layout can rotate it. */
export function MediaExampleLabel({ label }: { label: string }) {
  const hasArrow = /[→↓]\s*$/.test(label)
  return <>{hasArrow ? label.replace(/\s*[→↓]\s*$/, '') : label}{hasArrow && <span className="media-example-arrow" aria-hidden="true">→</span>}</>
}
