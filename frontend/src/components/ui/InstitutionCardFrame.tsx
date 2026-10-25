import type { ReactNode } from 'react'

export function InstitutionCardFrame({ id, logoSrc, appearance = 'default', className = '', children }: {
  id: string
  logoSrc: string
  appearance?: 'default' | 'branded'
  className?: string
  children: ReactNode
}) {
  return <article className={`institution-card teaching-institution-card ${className}`} data-institution={id}>
    {appearance === 'branded' && <span className="institution-card__watermark" aria-hidden="true" style={{ maskImage: `url("${logoSrc}")`, WebkitMaskImage: `url("${logoSrc}")` }} />}
    {children}
  </article>
}
