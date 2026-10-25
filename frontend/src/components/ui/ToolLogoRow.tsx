import type { ToolLogo } from '../../types/page'

export function ToolLogoRow({ logos }: { logos: ToolLogo[] }) {
  if (logos.length === 0) return null

  return (
    <ul className="tool-logo-row">
      {logos.map((logo) => (
        <li key={logo.id} data-tool-id={logo.id}>
          <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  )
}
