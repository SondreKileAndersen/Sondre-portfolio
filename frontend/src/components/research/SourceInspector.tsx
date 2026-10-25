import { CuratedEvidence, formatEvidenceSentence } from './CuratedEvidence'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { conceptById, curatedEvidenceCells, scopedObservations, type Filters, type Relation } from '../../lib/researchVisualization/model'

export type SourceSelection = {
  label: string; conceptId?: string; relations?: Relation[]; observationIds?: string[];
  memoIds?: string[]; matrixIds?: string[]; positions?: string[]; stanceIds?: string[]; global?: boolean
}
export function SourceInspector({ selection, filters, onClose }: { selection: SourceSelection; filters: Filters; onClose: () => void }) {
  const { t } = useTranslation()
  const scroll = useRef<HTMLDivElement>(null)
  const rows = selection.relations ?? []
  const cells = curatedEvidenceCells(selection.matrixIds ?? [], rows)
  const observations = [...new Map(scopedObservations([...new Set([
    ...(selection.observationIds ?? []), ...rows.flatMap(row => row.evidence_observation_ids),
  ])], filters).map(observation => [`${observation.informant}|${observation.text_normalized}`, observation])).values()]
  const concept = selection.conceptId ? conceptById.get(selection.conceptId) : undefined
  const summaries = [...new Set(rows.filter(row => row.provenance_scope !== 'researcher_matrix').map(row => row.label))]
  useEffect(() => { scroll.current?.scrollTo(0, 0) }, [selection])
  useEffect(() => {
    const element = scroll.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      if (element.scrollHeight <= element.clientHeight) return
      event.preventDefault()
      const unit = event.deltaMode === 1
        ? parseFloat(getComputedStyle(element).lineHeight) || 16
        : event.deltaMode === 2 ? element.clientHeight : 1
      element.scrollTop += event.deltaY * unit * 0.5
    }
    element.addEventListener('wheel', wheel, { passive: false })
    return () => element.removeEventListener('wheel', wheel)
  }, [])
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [onClose])
  return <aside className="research-source" aria-label={t('research.source')}>
    <div ref={scroll} className="research-source__content" tabIndex={0}>
      {cells.length > 0 ? <CuratedEvidence cells={cells} filters={filters} /> : <>
      {concept && <p>{concept.description}</p>}
      {selection.positions?.map(position => <p key={position}><strong>{t(`research.positions.${position}`)}</strong></p>)}
      {rows.some(row => row.tier === 'exploratory') && <p className="research-viz__notice">{t('research.hypothesis')}</p>}
      {summaries.map(summary => <p key={summary}>{summary}</p>)}
      {observations.length > 0 && <><ul>{observations.map(observation => <li key={observation.id} className="research-source__record">
        <strong>{t(observation.informant === 'Z' ? 'research.expertName' : 'research.informantName', { id: observation.informant })}</strong>
        <ul><li><p>{formatEvidenceSentence(observation.text)}</p></li></ul>
        {!!observation.flags.length && <p className="research-viz__notice">{t('research.sourceNeedsReview')}</p>}
      </li>)}</ul></>}
      {!concept && !observations.length && !summaries.length && !selection.positions?.length && <p>{t('research.noInformantText')}</p>}
      </>}
    </div>
  </aside>
}
