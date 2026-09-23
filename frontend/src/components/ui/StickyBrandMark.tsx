import type { BrandMark } from '../../types/page'

type StickyBrandMarkProps = {
  brand?: BrandMark
}

export function StickyBrandMark({ brand }: StickyBrandMarkProps) {
  if (!brand) return null

  return (
    <div className={`sticky-brand sticky-brand--${brand.groupId}`}>
      <img src={brand.src} alt={brand.alt} loading="lazy" decoding="async" />
    </div>
  )
}
