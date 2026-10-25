import { useEffect, useRef } from 'react'
import type { ResearchStudySection } from '../../types/page'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
import { LineIcon } from '../ui/LineIcon'
import { QuestionMarkBadge } from '../ui/QuestionMarkBadge'
import { InlineText } from '../ui/InlineText'
import './researchStudy.css'
import './coverIntroduction.css'
import { SectionRenderer } from '../SectionRenderer'
import { momentCardColors } from '../../data/researchVisualizationPresentation'

const studyImages = import.meta.glob<string>('../../media/forskning/master-*.png', { eager:true, query:'?url', import:'default' })

function StudyImage({ image }: { image: NonNullable<ResearchStudySection['parts'][number]['image']> }) {
  const { t } = useTranslation()
  const src = image.src ?? studyImages[image.file.replace('src/media/', '../../media/')]
  const placeholder = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = placeholder.current
    if (!node || src) return
    const comment = document.createComment(` Legg inn ${image.file} `)
    node.before(comment)
    return () => comment.remove()
  }, [image.file, src])
  return <figure className={`research-study__image research-study__image--${image.variant}`}>
    {src ? image.href ? <a className="research-study__image-link" href={image.href} target="_blank" rel="noopener noreferrer" aria-label={t('research.openImageInNewTab', { label: image.alt })}>
      <img src={src} alt={image.alt} loading="lazy" />
      <span className="research-study__external-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3h7v7M21 3l-10 10"/><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></svg></span>
    </a> : <img src={src} alt={image.alt} loading="lazy" /> :
      <div ref={placeholder} className="research-study__placeholder" role="img" aria-label={image.alt}><span>{image.file}</span></div>}
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>
}

export function ResearchStudyBlock({ id, parts }: ResearchStudySection) {
  return <section id={id} className="research-study"><div className="research-study__inner">
    {parts.map(part => <div key={part.id} id={part.id} data-heading-accent="blue" className={`research-study__part${part.variant === 'cover' ? ' research-study__part--cover' : ' section-heading--ruled'}${part.factsAppearance === 'compact' ? ' research-study__part--methods' : ''}${part.image?.position === 'right' ? ' research-study__part--image-right' : ''}${part.illustration && !part.premise ? ' research-study__part--illustrated' : ''}${part.premise ? ' research-study__part--premise' : ''}`}>
      <div className="research-study__copy">
      <header>
        <h2>{part.heading}</h2>
        {part.subtitle && <p><em>{part.subtitle}</em></p>}
        {part.description && <p className="research-study__metadata">{part.description}</p>}
      </header>
      <div className={`research-study__prose${part.premise ? ' research-study__summary-columns' : ''}`}>
        <div>{part.premise?.heading && <h3>{part.premise.heading}</h3>}{part.paragraphs.map(paragraph => <p key={paragraph}><InlineText text={paragraph} /></p>)}</div>
        <div>
        {part.question && <div className="research-study__question">{part.premise && <QuestionMarkBadge className="research-study__question-icon" />}<p><strong>{part.question.label}</strong> {part.question.text}</p></div>}
        {part.question?.footnote && <p className="research-study__footnote">{part.question.footnote.label} {part.question.footnote.text}</p>}
        {part.practical && <p>{part.practical.text} {part.practical.prefix} <a href={part.practical.href} target="_blank" rel="noopener noreferrer">{part.practical.label}</a> {part.practical.description}</p>}
        </div>
      </div>
      </div>
        {(part.norwegianAbstract || part.abstract) && <div className="research-study__abstracts">
          {part.norwegianAbstract && <details lang="no"><summary>{part.norwegianAbstract.label}<span aria-hidden="true">→</span></summary><p>{part.norwegianAbstract.text}</p></details>}
          {part.abstract && <details lang="en"><summary>{part.abstract.label}<span aria-hidden="true">→</span></summary><p>{part.abstract.text}</p></details>}
        </div>}
      {part.facts && <ul className={`research-study__facts${part.factsAppearance === 'compact' ? ' research-study__facts--compact' : ''}`}>{part.facts.map(fact => <li key={fact.id}>{part.factsAppearance === 'compact' ? <span>{fact.label}</span> : <><span className="research-study__icon"><LineIcon name={fact.icon} /></span><strong>{fact.label}</strong></>}</li>)}</ul>}
      {part.findings && <ul className="research-study__findings">{part.findings.map(finding => {
        const colors = momentCardColors[finding.momentId ?? '']
        return <li key={finding.id} style={{ backgroundColor: colors?.background, '--finding-color': colors?.background, '--body-text-color': colors?.text, '--body-bold-color': colors?.text } as CSSProperties}>{finding.iconSrc && <span className="research-study__finding-icon-circle" aria-hidden="true"><span className="research-study__finding-icon" style={{ maskImage: `url("${finding.iconSrc}")`, WebkitMaskImage: `url("${finding.iconSrc}")` }} /></span>}<strong className="research-study__finding-title">{finding.label}</strong><p><em>{finding.text}</em></p></li>
      })}</ul>}
      {part.outcome && <p className="research-study__prose"><InlineText text={part.outcome} /></p>}
      {part.visualization && <SectionRenderer section={part.visualization} tone="light" />}
      {part.illustration && <div className="research-study__illustration"><SectionRenderer section={part.illustration} tone="light" /></div>}
      {part.image && <StudyImage image={part.image} />}
    </div>)}
  </div></section>
}
