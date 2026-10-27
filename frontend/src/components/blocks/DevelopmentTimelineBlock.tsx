import type { DevelopmentTimelineSection } from '../../types/page'
import { QuestionMarkBadge } from '../ui/QuestionMarkBadge'
import './developmentTimeline.css'
import './researchFigureTypography.css'

export function DevelopmentTimelineBlock({ id, heading, labels, stages }: DevelopmentTimelineSection) {
  return <section id={id} className="development-timeline" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`} hidden>{heading}</h2>
    <div className="development-timeline__layout">
      <div className="development-timeline__labels">{labels.map(label => <div key={label.id}>
        <span className="development-timeline__label-icon" aria-hidden="true" style={{ maskImage: `url("${label.iconSrc}")`, WebkitMaskImage: `url("${label.iconSrc}")` }} />
        <h3>{label.label}</h3>
      </div>)}</div>
      <ol className="development-timeline__stages">{stages.map(stage => <li key={stage.id}>
        <h3><span className="development-timeline__stage-label">{stage.label}</span>{stage.note && <small className="development-timeline__stage-note">{stage.note}</small>}</h3>
        <div className="development-timeline__milestone">
          <img src={stage.src} alt={stage.alt} loading="lazy" />
          {stage.caption && <span className="development-timeline__caption">{stage.caption}</span>}
        </div>
        <div className={`development-timeline__info development-timeline__info--${stage.appearance}`}>
          {stage.items?.length ? <ul>{stage.items.map(item => <li key={item}>{item}</li>)}</ul> : <QuestionMarkBadge className={stage.focus ? 'development-timeline__focus-badge' : undefined} />}
        </div>
        {stage.focus && <div className="development-timeline__focus-note">
          <svg viewBox="0 0 80 80" aria-hidden="true"><path d="M65 3 C15 25 9 55 33 76" /></svg>
          <span>{stage.focus.label}</span>
        </div>}
      </li>)}</ol>
    </div>
  </section>
}
