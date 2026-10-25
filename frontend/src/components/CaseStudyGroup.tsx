import type { GallerySection, SplitSection } from '../types/page'
import { SectionRenderer } from './SectionRenderer'
import { StickyBrandMark } from './ui/StickyBrandMark'
import { sectionTone } from '../lib/sectionTone'

export type BrandedCaseStudySection = (GallerySection | SplitSection) & {
  brand: NonNullable<GallerySection['brand']>
}

type CaseStudyGroupProps = {
  sections: BrandedCaseStudySection[]
  startIndex: number
  startSectionIndex: number
  startTone: 'light' | 'dark'
}

export function CaseStudyGroup({ sections, startIndex, startSectionIndex, startTone }: CaseStudyGroupProps) {
  const brand = sections[0]?.brand
  const sharedTone = brand?.sharedSurface
    ? sections[0].tone ?? sectionTone(startSectionIndex, startTone)
    : undefined

  return (
    <div className={`case-study-group${sharedTone ? ` case-study-group--shared rendered-section--${sharedTone}` : ''}`}>
      <div className="case-study-group__brand-rail">
        <StickyBrandMark brand={brand} />
      </div>
      {sections.map((section, sectionIndex) => {
        const sequenceIndex = startIndex + sectionIndex
        const position: 'left' | 'right' = sequenceIndex % 2 === 0 ? 'left' : 'right'
        const sharedOverrides = {
          tone: sharedTone ?? section.tone ?? sectionTone(startSectionIndex + sectionIndex, startTone),
        }
        const positionedSection = section.type === 'split'
          ? { ...section, ...sharedOverrides, imagePosition: position }
          : { ...section, ...sharedOverrides, galleryPosition: position }

        return <SectionRenderer key={section.id} section={positionedSection} tone={sharedOverrides.tone} />
      })}
    </div>
  )
}
