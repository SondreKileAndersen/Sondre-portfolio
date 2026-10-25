import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { conceptById, dataset, deriveRelationRows, momentIds, overviewCellStatus, originalMatrixVisible, processVisible, rowIds, scopeComparison, type Filters, type Pair, type Relation } from '../../lib/researchVisualization/model'
import type { SourceSelection } from './SourceInspector'
import { momentColors, networkLayout, processMomentIds } from '../../data/researchVisualizationPresentation'
import { connection, fitBox, momentStyle, useDiagramCanvas, useDraggableNode, type Box, type DiagramLayoutProps } from './diagramLayout'
import { overviewSourceOrder } from '../../data/researchVisualizationPresentation'
import { ColumnHeadingPath } from './ColumnHeadingPath'
import { OverviewHoverGuide, type GuideTarget } from './OverviewHoverGuide'

type Inspect = (selection: SourceSelection) => void
const label = (id: string) => conceptById.get(id)?.label ?? id
function activate(event: KeyboardEvent<SVGGElement>, callback: () => void) {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); callback() }
}
function SvgButton({ children, name, onClick }: { children: ReactNode; name: string; onClick: () => void }) {
  return <g className="research-viz__svg-button" role="button" tabIndex={0} aria-label={name} onClick={onClick} onKeyDown={event => activate(event, onClick)}><title>{name}</title>{children}</g>
}
function DiagramNode({ id, name, box, canvas, height, onMove, onClick, children, style }: DiagramLayoutProps & {
  id: string; name: string; box: Box; canvas: RefObject<SVGSVGElement | null>; height: number;
  onClick: () => void; children: ReactNode; style?: CSSProperties
}) {
  const drag = useDraggableNode({ id, box, canvas, height, onMove })
  return <g {...drag} transform={`translate(${box.x} ${box.y})`} style={style} data-node-id={id}
    className="research-viz__svg-button research-viz__draggable" role="button" tabIndex={0} aria-label={name}
    onClick={onClick} onKeyDown={event => { drag.onKeyDown(event); if (!event.defaultPrevented) activate(event, onClick) }}>
    <title>{name}</title><rect width={box.width} height={box.height} rx="6" />{children}
  </g>
}
export function Empty({ analytical = false }: { analytical?: boolean }) {
  const { t } = useTranslation()
  return <p className="research-viz__empty" role="status">{t(analytical ? 'research.analyticalEmpty' : 'research.empty')}</p>
}
export function ConceptFigure({ active, filters, inspect, positions, onMove }: { active: Relation[]; filters: Filters; inspect: Inspect } & DiagramLayoutProps) {
  const { t } = useTranslation()
  const { ref, width, sizes } = useDiagramCanvas(940)
  const height = 460
  const synthesisVisible = processVisible(filters)
  const center: Box = { x: width / 2 - 15, y: height / 2 - 15, width: 30, height: 30 }
  const boxFor = (id: string, index: number): Box => {
    const size = sizes[id] ?? { width: 328, height: 155 }
    const fallback = { x: index % 2 ? width - size.width - 24 : 24, y: index < 2 ? 24 : height - size.height - 24 }
    return fitBox(positions[id] ?? fallback, size, width, height)
  }
  return <><p>{t('research.modelDefinition')}</p><p className="research-viz__muted">{t('research.dragHint')}</p>
    <div className="research-viz__scroll" tabIndex={0} aria-label={t('research.diagram')}>
      <svg ref={ref} className="research-viz__concept-model" viewBox={`0 0 ${width} ${height}`} role="group" aria-label={t('research.diagram')}>
        {synthesisVisible && momentIds.map((id, index) => <path key={id} style={momentStyle(id)} className="research-viz__edge research-viz__edge--analytical" d={connection(boxFor(id, index), center)} />)}
        {synthesisVisible && <SvgButton name={t('research.conceptual')} onClick={() => inspect({ label: t('research.conceptual'), memoIds: ['MEMO-SYNTH'], global: true })}><circle cx={width / 2} cy={height / 2} r="15" fill="var(--theme-light-blue)" /></SvgButton>}
        {momentIds.map((id, index) => {
          const box = boxFor(id, index)
          return <DiagramNode key={id} id={id} name={t('research.inspect', { label: label(id) })} box={box} canvas={ref} height={height} positions={positions} onMove={onMove} style={momentStyle(id)}
            onClick={() => inspect({ label: label(id), conceptId: id, relations: active.filter(r => r.source_id === id || r.target_id === id), memoIds: synthesisVisible ? ['MEMO-SYNTH'] : [], global: synthesisVisible })}>
            <foreignObject x="14" y="12" width="300" height={box.height - 24}><div data-node-description={id} className="research-viz__concept-label"><strong>{label(id)}</strong><p>{conceptById.get(id)?.description}</p></div></foreignObject>
          </DiagramNode>
        })}
      </svg>
    </div>{!active.length && <Empty />}</>
}
export function NetworkFigure({ pairs, inspect, positions, onMove }: { pairs: Pair[]; inspect: Inspect } & DiagramLayoutProps) {
  const { t } = useTranslation()
  const { ref, width, sizes } = useDiagramCanvas(940, pairs.length > 0)
  const height = Math.max(540, Math.round(width * networkLayout.height / networkLayout.width))
  const boxFor = (id: string): Box => {
    const size = sizes[id] ?? { width: 220, height: 42 }
    const center = networkLayout.centers[id]
    const fallback = { x: center.x / networkLayout.width * width - size.width / 2, y: center.y / networkLayout.height * height - size.height / 2 }
    return fitBox(positions[id] ?? fallback, size, width, height)
  }
  if (!pairs.length) return <Empty />
  return <><p className="research-viz__muted">{t('research.dragHint')}</p><div className="research-viz__scroll" tabIndex={0} aria-label={t('research.network')}>
    <svg ref={ref} className="research-viz__network" viewBox={`0 0 ${width} ${height}`} role="group" aria-label={t('research.network')}>
      {pairs.map(pair => <g key={pair.id} style={momentStyle(pair.target)} data-pair-id={pair.id}>
        {[...new Set(pair.relations.map(r => r.tier))].map((tier, index) => {
          const path = connection(boxFor(pair.source), boxFor(pair.target), index * 14)
          return <SvgButton key={tier} name={`${label(pair.source)} → ${label(pair.target)} · ${t(`research.${tier}`)}`} onClick={() => inspect({ label: `${label(pair.source)} → ${label(pair.target)}`, relations: pair.relations })}>
            <path className="research-viz__edge-hit" d={path} />
            <path className={`research-viz__edge research-viz__edge--${tier}`} d={path} />
          </SvgButton>
        })}
      </g>)}
      {[...rowIds, ...momentIds].map(id => {
        const box = boxFor(id)
        return <DiagramNode key={id} id={id} name={t('research.inspect', { label: label(id) })} box={box} canvas={ref} height={height} positions={positions} onMove={onMove} style={momentStyle(id)}
          onClick={() => inspect({ label: label(id), conceptId: id, relations: pairs.filter(p => p.source === id || p.target === id).flatMap(p => p.relations) })}>
          <text data-node-label={id} x="14" y={box.height / 2} dominantBaseline="central">{label(id)}</text>
        </DiagramNode>
      })}
    </svg>
  </div></>
}
export function RelationRowsFigure({ pairs, inspect, filters, selection }: { selection: SourceSelection | null; pairs: Pair[]; inspect: Inspect; filters: Filters }) {
  const { t } = useTranslation()
  const [hoveredSource, setHoveredSource] = useState<string | null>(null)
  const [focusedSource, setFocusedSource] = useState<string | null>(null)
  const [hoveredMoment, setHoveredMoment] = useState<string | null>(null)
  const [focusedMoment, setFocusedMoment] = useState<string | null>(null)
  const [guideTarget, setGuideTarget] = useState<GuideTarget>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  useLayoutEffect(() => {
    const table = tableRef.current
    const stage = table?.parentElement
    if (!table || !stage) return
    const headings = [...table.querySelectorAll<HTMLElement>('[data-source-heading]')]
    const canvas = document.createElement('canvas').getContext('2d')
    let frame = 0
    const measure = () => {
      frame = 0
      const right = table.getBoundingClientRect().right
      const overflow = Math.max(0, ...headings.map(heading => {
        const button = heading.querySelector('button')!
        const style = getComputedStyle(button)
        const fontSize = parseFloat(getComputedStyle(heading).fontSize) * 1.04
        if (canvas) canvas.font = `700 ${fontSize}px ${style.fontFamily}`
        const width = (canvas?.measureText(button.textContent ?? '').width ?? button.offsetWidth)
          + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
        const transform = new DOMMatrixReadOnly(style.transform)
        const box = heading.getBoundingClientRect()
        return box.left + box.width / 2 + width * Math.abs(transform.a) + 8 - right
      }))
      const reserve = `${Math.ceil(overflow)}px`
      if (stage.style.getPropertyValue('--research-heading-overhang') !== reserve) {
        stage.style.setProperty('--research-heading-overhang', reserve)
      }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    const observer = new ResizeObserver(schedule)
    observer.observe(table)
    headings.forEach(heading => observer.observe(heading))
    void document.fonts.ready.then(schedule)
    document.fonts.addEventListener('loadingdone', schedule)
    schedule()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      document.fonts.removeEventListener('loadingdone', schedule)
    }
  }, [pairs, filters])
  useLayoutEffect(() => {
    const table = tableRef.current
    const column = table?.querySelector<HTMLElement>('.research-viz__moment-column')
    const buttons = [...(table?.querySelectorAll<HTMLButtonElement>('tbody th button') ?? [])]
    if (!column || !buttons.length) return
    const measure = () => {
      const width = Math.max(...buttons.map(button => {
        const cell = getComputedStyle(button.parentElement!)
        return button.offsetWidth + parseFloat(cell.paddingLeft) + parseFloat(cell.paddingRight)
      }))
      column.style.width = `${Math.ceil(width)}px`
    }
    const observer = new ResizeObserver(measure)
    buttons.forEach(button => observer.observe(button))
    measure()
    return () => observer.disconnect()
  }, [tableRef, filters, pairs])
  const activeSource = hoveredSource ?? (hoveredMoment ? null : focusedSource) ?? (guideTarget === 'source' ? 'P_EMAIL' : null)
  const activeMoment = hoveredMoment ?? (hoveredSource ? null : focusedMoment) ?? (guideTarget === 'moment' ? 'M_FORM' : null)
  const sourceHeading = (id: string) => t(`research.sourceHeadings.${id}`, { defaultValue: label(id) })
  const sourceLabel = (id: string) => sourceHeading(id).replaceAll('\u00ad', '')
  if (!originalMatrixVisible(filters)) return <Empty analytical />
  const sourceData = deriveRelationRows(pairs)
  const sources = overviewSourceOrder.flatMap(id => sourceData.filter(source => source.id === id))
  if (!sources.length) return <Empty />
  const dimColumn = (source: string) => {
    if (!activeMoment) return undefined
    const cell = dataset.matrix.find(cell => cell.row_id === source && cell.column_id === activeMoment)
    return !(cell && overviewCellStatus(cell, filters) === 'clear') || undefined
  }
  return <><div className="research-viz__scroll" tabIndex={0} aria-label={t('research.upset')}>
    <div className="research-viz__table-stage"><table ref={tableRef} aria-label={t('research.perParatext')} data-focused-moment={activeMoment ?? undefined} className="research-viz__table research-viz__relation-rows">

      <colgroup><col className="research-viz__moment-column" /><col span={sources.length} /></colgroup>


      <thead><tr><th scope="col" aria-label={t('research.assessmentMoments')} />{sources.map(source =>
        <th key={source.id} scope="col" data-source-heading={source.id} data-column-deemphasized={dimColumn(source.id)}><ColumnHeadingPath /><button type="button" className="research-viz__column-label" data-guide-hover={guideTarget === 'source' && source.id === 'P_EMAIL' || undefined} aria-pressed={selection?.conceptId === source.id} aria-label={sourceLabel(source.id)}
          onPointerEnter={event => { if (event.pointerType !== 'touch') { setHoveredSource(source.id) } }}
          onPointerLeave={() => setHoveredSource(null)}
          onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { setFocusedSource(source.id) } }}
          onBlur={() => setFocusedSource(null)}
          onClick={() => inspect({ label: sourceLabel(source.id), conceptId: source.id, relations: source.relations, matrixIds: dataset.matrix.filter(cell => cell.row_id === source.id && ['clear','possible'].includes(overviewCellStatus(cell, filters))).map(cell => cell.id), global: true })}>{sourceLabel(source.id)}</button></th>
      )}</tr></thead>
      <tbody>{momentIds.map(moment => {
        const coloredIndices = sources.flatMap((source, index) => {
          const cell = dataset.matrix.find(cell => cell.row_id === source.id && cell.column_id === moment)!
          return overviewCellStatus(cell, filters) === 'clear' ? [index] : []
        })
        const first = coloredIndices[0], last = coloredIndices[coloredIndices.length - 1]
        const activeCell = activeSource ? dataset.matrix.find(cell => cell.row_id === activeSource && cell.column_id === moment) : undefined
        const dimmed = activeMoment ? moment !== activeMoment : !!activeSource && !(activeCell && overviewCellStatus(activeCell, filters) === 'clear')
        return <tr key={moment} data-moment-id={moment} data-deemphasized={dimmed || undefined}>
          <th scope="row" className="research-viz__moment" style={momentStyle(moment)}><button type="button" data-guide-hover={guideTarget === 'moment' && moment === 'M_FORM' || undefined} aria-pressed={selection?.conceptId === moment}
            onPointerEnter={event => { if (event.pointerType !== 'touch') { setHoveredMoment(moment) } }}
            onPointerLeave={() => setHoveredMoment(null)}
            onFocus={event => { if (event.currentTarget.matches(':focus-visible')) { setFocusedMoment(moment) } }}
            onBlur={() => setFocusedMoment(null)}
            onClick={() => inspect({ label: label(moment), conceptId: moment, relations: pairs.filter(pair => pair.target === moment).flatMap(pair => pair.relations), matrixIds: dataset.matrix.filter(cell => cell.column_id === moment && ['clear','possible'].includes(overviewCellStatus(cell, filters))).map(cell => cell.id), global: true })}><span className="research-viz__stable-label" data-label={label(moment)}><span>{label(moment)}</span></span></button></th>
          {sources.map((source, index) => {
            const relations = source.relations.filter(relation => relation.target_id === moment)
            const cell = dataset.matrix.find(cell => cell.row_id === source.id && cell.column_id === moment)!
            const status = overviewCellStatus(cell, filters)
            const description = `${sourceLabel(source.id)} → ${label(moment)}: ${t(`research.connection.${status}`)}`
            const segment = coloredIndices.length < 2 || index < first || index > last ? undefined : index === first ? 'start' : index === last ? 'end' : 'middle'
            return <td key={source.id} style={momentStyle(moment)} data-source-id={source.id} data-column-deemphasized={dimColumn(source.id)} data-row-connection={segment} data-connection-status={status} aria-label={description}>{status === 'clear' || status === 'possible' ?
              <button type="button" className="research-viz__membership" data-guide-hover={guideTarget === 'point' && moment === 'M_FORM' && source.id === 'P_EMAIL' || undefined} aria-pressed={!selection?.conceptId && selection?.matrixIds?.length === 1 && selection.matrixIds[0] === cell.id} aria-label={description} onClick={() => inspect({ label: description, relations, matrixIds: [cell.id], global: true })}><span className={`research-viz__dot${status === 'clear' ? ' research-viz__dot--active' : ' research-viz__dot--possible'}`} /></button> : status === 'filtered' ? <span className="research-viz__muted">{t('research.filtered')}</span> : null}</td>
          })}
        </tr>
      })}</tbody>
      <tfoot><tr className="research-viz__axis-headings"><th scope="col"><span className="research-viz__paratext-bracket research-viz__moment-bracket"><span>{t('research.assessmentMoments')}</span></span></th><th scope="colgroup" colSpan={sources.length}><span className="research-viz__paratext-bracket"><span>{t('research.withParatexts')}</span></span></th></tr></tfoot>
    </table><OverviewHoverGuide tableRef={tableRef} onTarget={setGuideTarget} enabled={!selection} /></div>
  </div></>
}
export function ComparisonFigure({ filters, inspect }: { filters: Filters; inspect: Inspect }) {
  const { t }=useTranslation()
  const cells=scopeComparison(filters)
  if (!cells.length) return <>{filters.informant==='Z'?<p>{t('research.noExpertCells')}</p>:<Empty />}</>
  const topics=[...new Set(cells.map(c=>c.concept_id))],people=[...new Set(cells.map(c=>c.informant_id))]
  return <div className="research-viz__scroll" tabIndex={0} aria-label={t('research.informant')}><table className="research-viz__table research-viz__comparison"><caption>{t('research.qualification')}</caption><thead><tr><th scope="col">{t('research.informant')}</th>{people.map(person=><th key={person} scope="col">{person}</th>)}</tr></thead><tbody>{topics.map(topic=><tr key={topic}><th scope="row">{cells.find(c=>c.concept_id===topic)?.topic_label}</th>{people.map(person=>{const cell=cells.find(c=>c.concept_id===topic&&c.informant_id===person)!;const positions=cell.activeStances.map(s=>s.stance);return <td key={person}>{positions.length?<button type="button" onClick={()=>inspect({label:`${cell.topic_label} · ${person}`,observationIds:cell.visibleObservationIds,positions,stanceIds:cell.activeStances.map(s=>s.id)})}>{positions.map(position=><span key={position}>{t(`research.positions.${position}`)}</span>)}</button>:<span className="research-viz__muted">{t(cell.status==='not_coded_in_this_comparison'?'research.notCoded':'research.filtered')}</span>}</td>})}</tr>)}</tbody></table></div>
}
export function ProcessFigure({ filters, inspect, positions, onMove }: { filters: Filters; inspect: Inspect } & DiagramLayoutProps) {
  const { t } = useTranslation()
  const markerId = useId().replaceAll(':', '')
  const visible = processVisible(filters)
  const { ref, width, sizes } = useDiagramCanvas(1040, visible)
  const height = 660
  const types = [...new Set(dataset.process.nodes.map(node => node.type))]
  const boxFor = (id: string): Box => {
    const node = dataset.process.nodes.find(item => item.id === id)!
    const siblings = dataset.process.nodes.filter(item => item.type === node.type)
    const size = sizes[id] ?? { width: 218, height: 90 }
    const fallback = { x: 20 + types.indexOf(node.type) * ((width - 258) / (types.length - 1)), y: 25 + siblings.findIndex(item => item.id === id) * 165 }
    return fitBox(positions[id] ?? fallback, size, width, height)
  }
  const nodeLabel = (id: string) => dataset.process.nodes.find(node => node.id === id)?.label
  if (!visible) return <Empty analytical />
  return <><p className="research-viz__muted">{t('research.dragHint')}</p><div className="research-viz__scroll" tabIndex={0} aria-label={t('research.diagram')}>
    <svg ref={ref} className="research-viz__process" viewBox={`0 0 ${width} ${height}`} role="group" aria-label={t('research.diagram')}>
      <defs>{[...Object.keys(momentColors), 'neutral'].map(id => <marker key={id} id={`${markerId}-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill={momentColors[id] ?? '#627b8d'} /></marker>)}</defs>
      {dataset.process.edges.map(edge => {
        const colorId = processMomentIds[edge.to] ?? processMomentIds[edge.from]
        const path = connection(boxFor(edge.from), boxFor(edge.to), boxFor(edge.from).x === boxFor(edge.to).x ? 60 : 0)
        return <g key={`${edge.from}|${edge.to}`} style={momentStyle(colorId)}>
          <SvgButton name={`${nodeLabel(edge.from)} → ${nodeLabel(edge.to)}: ${edge.condition}`} onClick={() => inspect({ label: edge.condition, memoIds: edge.memo_ids, global: true })}>
            <path className="research-viz__edge-hit" d={path} />
            <path className="research-viz__edge research-viz__edge--analytical" markerEnd={`url(#${markerId}-${colorId ?? 'neutral'})`} d={path} />
          </SvgButton>
        </g>
      })}
      {dataset.process.nodes.map(node => {
        const box = boxFor(node.id)
        return <DiagramNode key={node.id} id={node.id} name={t('research.inspect', { label: node.label })} box={box} canvas={ref} height={height} positions={positions} onMove={onMove} style={momentStyle(processMomentIds[node.id])}
          onClick={() => inspect({ label: node.label, memoIds: [...new Set(dataset.process.edges.filter(edge => edge.from === node.id || edge.to === node.id).flatMap(edge => edge.memo_ids))], global: true })}>
          <foreignObject x="14" y="12" width={box.width - 28} height={box.height - 24}><div data-node-description={node.id} className="research-viz__process-label">{node.label}</div></foreignObject>
        </DiagramNode>
      })}
    </svg>
    <details><summary>{t('research.source')}</summary><ul>{dataset.process.edges.map(edge => <li key={`${edge.from}|${edge.to}`}><button type="button" onClick={() => inspect({ label: edge.condition, memoIds: edge.memo_ids, global: true })}>{nodeLabel(edge.from)} → {nodeLabel(edge.to)}: {edge.condition}</button></li>)}</ul></details>
  </div></>
}
