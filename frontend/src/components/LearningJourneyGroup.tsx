import { useRef } from 'react'
import { LearningJourneyPath } from './LearningJourneyPath'
import type { LearningJourneyStepSection } from '../types/page'
import { SectionRenderer } from './SectionRenderer'
import { sectionTone } from '../lib/sectionTone'

type Props = {
  sections: LearningJourneyStepSection[]
  startIndex: number
  startTone: 'light' | 'dark'
}

export function LearningJourneyGroup({ sections, startIndex, startTone }: Props) {
  const groupRef = useRef<HTMLDivElement>(null)
  const heading = sections[0]?.groupHeading
  const groupTone = sections[0]?.tone ?? sectionTone(startIndex, startTone)
  const footerImage = sections.at(-1)?.footerImage

  return <div ref={groupRef} className={`learning-journey-group rendered-section--${groupTone}`}>
    {heading && <h2 className="learning-journey-group__heading"><span className="learning-journey-group__heading-circle" aria-hidden="true" />{heading}</h2>}
    <LearningJourneyPath groupRef={groupRef} sections={sections} />
    {sections.map((section, index) => <SectionRenderer
      key={section.id}
      section={section}
      tone={sectionTone(startIndex + index, startTone)}
    />)}
    {footerImage && <figure className="learning-journey-group__footer-image">
      <img src={footerImage.src} alt={footerImage.alt} loading="lazy" decoding="async" />
    </figure>}
  </div>
}
