import { OverviewAnnotations } from '../research/OverviewAnnotations'
import { useOverviewLayout } from '../research/useOverviewLayout'
import type { CSSProperties } from 'react'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { PointingHandIcon } from '../ui/PointingHandIcon'
import type { ResearchVisualizationsSection } from '../../types/page'
import { ConceptFigure, ComparisonFigure, NetworkFigure, ProcessFigure, RelationRowsFigure } from '../research/ResearchFigures'
import { SourceInspector, type SourceSelection } from '../research/SourceInspector'
import { canShowGlobal, dataset, defaultFilters, projectPairs, selectRelations, type Filters, type Tier } from '../../lib/researchVisualization/model'
import './researchVisualizations.css'
import './researchFigureTypography.css'
import type { Point } from '../research/diagramLayout'

const tiers: Tier[] = ['direct','analytical','exploratory']
export function ResearchVisualizationsBlock({id,heading,paragraphs,views,presentation}: ResearchVisualizationsSection) {
  const {t}=useTranslation()
  const [filterState,setFilters]=useState<Filters>(()=>structuredClone(defaultFilters))
  const filters = presentation === 'overview' ? defaultFilters : filterState
  const [viewId,setViewId]=useState(views[0].id)
  const relationView = presentation === 'overview' ? 'upset' : 'network'
  const [selection,setSelection]=useState<SourceSelection|null>(null)
  const [diagramPositions,setDiagramPositions]=useState<Record<string, Record<string, Point>>>({})
  const figure=useRef<HTMLDivElement>(null)
  const overviewLayout = useOverviewLayout(figure, presentation === 'overview')
  const sourceSlot = useRef<HTMLDivElement>(null)
  const [sourceBounds, setSourceBounds] = useState({ top: 0, height: 0, fontSize: '' })
  useLayoutEffect(() => {
    if (presentation !== 'overview') return
    const stage = figure.current?.querySelector<HTMLElement>('.research-viz__stage')
    const plot = stage?.querySelector<HTMLElement>('.research-viz__plot')
    const body = plot?.querySelector('tbody')
    const legend = stage?.querySelector('.research-viz__annotations .research-viz__legend')
    const label = plot?.querySelector('[data-source-heading] button')
    const description = stage?.querySelector('.research-viz__annotations > p:last-child') ?? legend
    if (!stage || !plot || !body || !legend || !label) {
      setSourceBounds({ top: 0, height: 0, fontSize: '' })
      return
    }
    const measure = () => {
      const top = body.getBoundingClientRect().top - stage.getBoundingClientRect().top
      const height = description!.getBoundingClientRect().bottom - body.getBoundingClientRect().top
      const fontSize = getComputedStyle(label.parentElement!).fontSize
      setSourceBounds(previous => previous.top === top && previous.height === height && previous.fontSize === fontSize ? previous : { top, height, fontSize })
    }
    measure()
    const observer = new ResizeObserver(measure)
    for (const element of [plot, body, legend, description!]) observer.observe(element)
    return () => observer.disconnect()
  }, [presentation, filters, overviewLayout.stacked])
  const view=views.find(v=>v.id===viewId)??views[0]
  const layout = {
    positions: diagramPositions[view.kind] ?? {},
    onMove: (nodeId: string, point: Point) => setDiagramPositions(previous => ({ ...previous, [view.kind]: { ...previous[view.kind], [nodeId]: point } })),
  }
  const active=useMemo(()=>selectRelations(filters),[filters])
  const pairs=useMemo(()=>projectPairs(active),[active])
  function update(patch: Partial<Filters>) { setSelection(null);setFilters(previous=>({...previous,...patch})) }
  const formats=dataset.contexts.filter(c=>c.axis==='publication_format'&&dataset.relations.some(r=>(r.context_ids as string[]).includes(c.id)))
  const contexts=dataset.contexts.filter(c=>c.axis!=='publication_format'&&(dataset.relations.some(r=>(r.context_ids as string[]).includes(c.id))||dataset.stances.some(s=>(s.context_ids as string[]).includes(c.id))))
  return <section id={id} className="research-viz" aria-labelledby={`${id}-title`}>
    {presentation === 'overview' ? <header className="research-viz__intro section-heading--ruled" data-heading-accent="turquoise"><h2 id={`${id}-title`}>{heading}</h2>{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</header> : <h2 id={`${id}-title`}>{heading}</h2>}
    {presentation !== 'overview' && <><details className="research-viz__method" open><summary>{t('research.method')}</summary>{paragraphs.map(p=><p key={p}>{p}</p>)}<p>{t('research.directNote')}</p></details>
    <fieldset className="research-viz__filters"><legend>{t('research.filters')}</legend>
      <fieldset><legend>{t('research.levels')}</legend>{tiers.map(tier=><label key={tier}><input type="checkbox" checked={filters.tiers[tier]} onChange={event=>update({tiers:{...filters.tiers,[tier]:event.target.checked}})}/>{t(`research.${tier}`)}</label>)}</fieldset>
      <fieldset><legend>{t('research.matrixStatuses')}</legend>{(['clear','possible'] as const).map(status=><label key={status}><input type="checkbox" checked={filters.statuses[status]} onChange={event=>update({statuses:{...filters.statuses,[status]:event.target.checked}})}/>{t(`research.${status}`)}</label>)}</fieldset>
      <label>{t('research.informant')}<select value={filters.informant} onChange={event=>update({informant:event.target.value as Filters['informant']})}><option value="all">{t('research.all')}{filters.includeExpert?' + Z':''}</option>{['A','B','C','D','E',...(filters.includeExpert?['Z']:[])].map(person=><option key={person} value={person}>{person}</option>)}</select></label>
      <label><input type="checkbox" checked={filters.includeExpert} onChange={event=>update({includeExpert:event.target.checked,...(!event.target.checked&&filters.informant==='Z'?{informant:'all' as const}:{})})}/>{t('research.expert')}</label>
      {filters.informant!=='all'&&<label><input type="checkbox" checked={filters.crossInformant} onChange={event=>update({crossInformant:event.target.checked})}/>{t('research.cross')}</label>}
      <label>{t('research.context')}<select value={filters.context} onChange={event=>update({context:event.target.value})}><option value="all">{t('research.allContexts')}</option><option value="unclassified">{t('research.unclassified')}</option>{contexts.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label>{t('research.format')}<select value={filters.format} onChange={event=>update({format:event.target.value})}><option value="all">{t('research.allFormats')}</option><option value="unclassified">{t('research.unclassified')}</option>{formats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
    </fieldset>
    <p className="research-viz__muted">{t('research.contextNote')}</p></>}
    {filters.tiers.exploratory&&<p className="research-viz__notice">{t('research.hypothesis')}</p>}
    {filters.informant!=='all'&&<p className="research-viz__notice">{t(canShowGlobal(filters)?'research.global':'research.noGlobal')}</p>}
    {views.length > 1 && <div className="research-viz__tabs" role="group" aria-label={t('research.view')}>{views.map(v=><button type="button" key={v.id} aria-pressed={v.id===view.id} onClick={()=>{setSelection(null);setViewId(v.id)}}>{v.heading}</button>)}</div>}
    <div ref={figure} className="research-viz__figure" aria-labelledby={`${view.id}-title`}>
      <h2 id={`${view.id}-title`} hidden={presentation === 'overview'}>{view.heading}</h2>{presentation !== 'overview' && view.paragraphs.map(p=><p key={p}>{p}</p>)}
      {presentation !== 'overview' && (view.kind==='relations'||view.kind==='concepts')&&<><p aria-live="polite">{t('research.selectionCount',{count:active.length})}</p><ul className="research-viz__legend">{tiers.filter(tier=>filters.tiers[tier]).map(tier=><li key={tier}><span className={`research-viz__legend-line research-viz__legend-line--${tier}`}/>{t(`research.${tier}`)}</li>)}</ul><p className="research-viz__muted">{t('research.colorHint')}</p></>}
      {(['concepts','process'].includes(view.kind)||(view.kind==='relations'&&relationView==='network'))&&<button type="button" onClick={()=>setDiagramPositions(previous=>({...previous,[view.kind]:{}}))}>{t('research.resetLayout')}</button>}
      <div className={`research-viz__stage${presentation === 'overview' ? ' research-viz__stage--overview' : ''}`} data-layout={presentation === 'overview' ? (overviewLayout.stacked ? 'stacked' : 'side-by-side') : undefined} style={presentation === 'overview' && overviewLayout.figureWidth ? { gridTemplateColumns: overviewLayout.stacked ? 'minmax(0,1fr)' : `${overviewLayout.figureWidth}px minmax(0,1fr)` } : undefined}><div className="research-viz__plot">
      {view.kind==='concepts'&&<ConceptFigure active={active} filters={filters} inspect={setSelection} {...layout}/>}
      {view.kind==='relations'&&(relationView==='network'?<NetworkFigure pairs={pairs} inspect={setSelection} {...layout}/>:<RelationRowsFigure selection={selection} pairs={pairs} inspect={setSelection} filters={filters}/>)}
      {view.kind==='comparison'&&<ComparisonFigure filters={filters} inspect={setSelection}/>}
      {view.kind==='process'&&<ProcessFigure filters={filters} inspect={setSelection} {...layout}/>}
      </div><div ref={sourceSlot} className="research-viz__source-slot" style={presentation === 'overview' && sourceBounds.height ? { marginTop: overviewLayout.stacked ? 0 : sourceBounds.top, height: overviewLayout.stacked ? '26rem' : sourceBounds.height, fontSize: sourceBounds.fontSize, '--research-source-font-size': sourceBounds.fontSize } as CSSProperties : undefined}>
        {selection ? <SourceInspector selection={selection} filters={filters} onClose={()=>setSelection(null)}/> : presentation === 'overview' ? <aside className="research-source research-source--empty"><p><Trans i18nKey="research.sourceHint" components={{ hand: <span className="research-source__hint-hand" aria-hidden="true"><PointingHandIcon /></span> }} /></p></aside> : null}
      </div>{presentation === 'overview' && <OverviewAnnotations />}</div>
    </div>
  </section>
}
