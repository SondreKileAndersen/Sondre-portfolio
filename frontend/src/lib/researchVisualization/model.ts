import activeScope from '../../data/research-visualization/data/active_scope.json'
import historicalEvidence from '../../data/research-visualization/data/infobokser_evidens.json'
import historicalConcepts from '../../data/research-visualization/data/concepts.json'
import historicalRelations from '../../data/research-visualization/data/relations.json'
import observations from '../../data/research-visualization/data/observations.json'
import historicalMatrix from '../../data/research-visualization/data/analysis_matrix.json'
import revision from '../../data/research-visualization/data/matrix_revision.json'
import memos from '../../data/research-visualization/data/memos.json'
import stances from '../../data/research-visualization/data/stances.json'
import comparison from '../../data/research-visualization/data/comparison_matrix.json'
import process from '../../data/research-visualization/data/process_model.json'
import contexts from '../../data/research-visualization/data/contexts.json'
import manifest from '../../data/research-visualization/data/manifest.json'

const excludedConceptIds = new Set(activeScope.excluded_concept_ids)
const concepts = historicalConcepts.filter(concept => !excludedConceptIds.has(concept.id))
const relations = historicalRelations.filter(relation => !excludedConceptIds.has(relation.source_id) && !excludedConceptIds.has(relation.target_id))
const matrix = historicalMatrix.filter(cell => !excludedConceptIds.has(cell.row_id) && !excludedConceptIds.has(cell.column_id))
const activeEvidenceCells = historicalEvidence.cells.filter(cell => !activeScope.excluded_evidence_cell_ids.includes(cell.id))
const evidence = { ...historicalEvidence, meta: { ...historicalEvidence.meta, totalCells: activeEvidenceCells.length }, cells: activeEvidenceCells }

export const dataset = { concepts, relations, observations, matrix, revision, memos, stances, comparison, process, contexts, manifest, evidence }
export type Relation = {
  id: string; source_id: string; target_id: string; tier: string; predicate: string; label: string;
  evidence_observation_ids: string[]; memo_ids: string[]; matrix_cell_ids: string[]; context_ids: string[];
  provenance_scope: string; review_status: string; numeric_weight: null
  analysis_included?: boolean
}
export type Observation = typeof observations[number]
export type Tier = 'direct' | 'analytical' | 'exploratory'
export type MatrixStatus = 'clear' | 'possible' | 'none'
export type Filters = {
  tiers: Record<Tier, boolean>
  statuses: Record<'clear' | 'possible', boolean>
  informant: 'all' | 'A' | 'B' | 'C' | 'D' | 'E' | 'Z'
  includeExpert: boolean
  crossInformant: boolean
  context: string
  format: string
}
export const defaultFilters: Filters = {
  tiers: { direct: manifest.filter_defaults.direct, analytical: manifest.filter_defaults.analytical, exploratory: manifest.filter_defaults.exploratory },
  statuses: { clear: true, possible: true }, informant: 'all', includeExpert: false,
  crossInformant: false, context: 'all', format: 'all',
}
export const conceptById = new Map(concepts.map(c => [c.id, c]))
export const observationById = new Map(observations.map(o => [o.id, o]))
export const memoById = new Map(memos.map(m => [m.id, m]))
export const matrixById = new Map(matrix.map(c => [c.id, c]))
export const rowIds = [...new Set(matrix.map(c => c.row_id))]
export const momentIds = [...new Set(matrix.map(c => c.column_id))]

export function filterTiers(rows: Relation[], tiers: Filters['tiers']) {
  return rows.filter(r => !excludedConceptIds.has(r.source_id) && !excludedConceptIds.has(r.target_id) && r.analysis_included !== false && tiers[r.tier as Tier])
}
export function matchesInformant(o: Observation, filters: Filters) {
  if (!['A', 'B', 'C', 'D', 'E', 'Z'].includes(o.informant)) return false
  if (o.informant === 'Z' && !filters.includeExpert) return false
  return filters.informant === 'all' || filters.informant === o.informant
}
export function scopedObservations(ids: string[], filters: Filters) {
  return ids.flatMap(id => {
    const o = observationById.get(id)
    return o && matchesInformant(o, filters) ? [o] : []
  })
}
export function matchesContext(ids: string[], selected: string) {
  return selected === 'all' || (selected === 'unclassified' ? ids.length === 0 : ids.includes(selected))
}
export const canShowGlobal = (f: Filters) => f.informant === 'all' || f.crossInformant

/** Keep provenance rows intact. Scope evidence separately, never assign global synthesis to an individual. */
export function selectRelations(filters: Filters) {
  return filterTiers(relations, filters.tiers).filter(r => {
    if (!matchesContext(r.context_ids, filters.context) || !matchesContext(r.context_ids.filter(id => contexts.some(c => c.id === id && c.axis === 'publication_format')), filters.format)) return false
    if (r.matrix_cell_ids.some(id => {
      const status = matrixById.get(id)?.status
      return status && status !== 'none' && !filters.statuses[status as 'clear' | 'possible']
    })) return false
    if (r.evidence_observation_ids.length) return scopedObservations(r.evidence_observation_ids, filters).length > 0
    return canShowGlobal(filters)
  })
}
export type Pair = { id: string; source: string; target: string; relations: Relation[] }
export function projectPairs(active: Relation[]): Pair[] {
  const pairs = new Map<string, Pair>()
  for (const relation of active) {
    if (!rowIds.includes(relation.source_id) || !momentIds.includes(relation.target_id)) continue
    const id = `${relation.source_id}|${relation.target_id}`
    const pair = pairs.get(id) ?? { id, source: relation.source_id, target: relation.target_id, relations: [] }
    pair.relations.push(relation)
    pairs.set(id, pair)
  }
  return [...pairs.values()]
}
export function deriveRelationRows(pairs: Pair[]) {
  if (!pairs.length) return []
  return rowIds.map(id => {
    const members = pairs.filter(pair => pair.source === id)
    return { id, moments: momentIds.filter(moment => members.some(pair => pair.target === moment)),
      relations: members.flatMap(pair => pair.relations) }
  })
}
export function primaryInformantCount(rows: Relation[], filters: Filters): number | null {
  const evidence = rows.flatMap(r => scopedObservations(r.evidence_observation_ids, filters))
  return evidence.length ? new Set(evidence.filter(o => o.informant !== 'Z').map(o => o.informant)).size : null
}
export function scopeComparison(filters: Filters) {
  // This manually curated A–E matrix is source-based; exploratory/analytical do not create stances.
  if (!filters.tiers.direct) return []
  return comparison.filter(cell => (filters.informant === 'all' || cell.informant_id === filters.informant))
    .map(cell => {
      const activeStances = stances.filter(s => cell.stance_ids.includes(s.id)
        && matchesContext(s.context_ids, filters.context)
        && matchesContext(s.context_ids.filter(id => contexts.some(c => c.id === id && c.axis === 'publication_format')), filters.format))
      return { ...cell, activeStances, visibleObservationIds: [...new Set(activeStances.flatMap(s => s.observation_ids))] }
    })
}
export function originalMatrixVisible(filters: Filters) {
  return filters.tiers.analytical && canShowGlobal(filters) && filters.context === 'all' && filters.format === 'all'
}
export function matrixCellVisible(status: string, filters: Filters) {
  return originalMatrixVisible(filters) && (status === 'none' || filters.statuses[status as 'clear' | 'possible'])
}
export function processVisible(filters: Filters) {
  // Process edges have no context/format annotations. Do not infer them from their wording.
  return originalMatrixVisible(filters)
}
export function exportSelection(filters: Filters) {
  const active = selectRelations(filters)
  return {
    metadata: { dataset_version: manifest.version, tier_filters: filters.tiers, matrix_status_filters: filters.statuses,
      primary_informant_filters: filters.informant, include_expert_z: filters.includeExpert,
      cross_informant_model: filters.crossInformant, context: filters.context, publication_format: filters.format,
      unit: 'relation_records_not_strength_or_interview_frequency', scope: 'active_relation_selection',
      limitations: manifest.counting_policy, provenance_semantics: manifest.provenance_semantics },
    analysis_revision: revision,
    curated_evidence: { meta: evidence.meta, cells: evidence.cells.filter(cell => active.some(row => evidenceForPair(row.source_id, row.target_id)?.id === cell.id) && cell.classification !== 'none').map(cell => ({ ...cell, primaryCodes: scopedEvidenceCodes(cell.primaryCodes, filters), contextCodes: scopedEvidenceCodes(cell.contextCodes, filters), uniquePrimaryInformants: [...new Set(scopedEvidenceCodes(cell.primaryCodes, filters).filter(code => code.informant !== 'Z').map(code => code.informant))] })) },
    relations: active.map(r => ({ ...r,
      active_evidence_observation_ids: scopedObservations(r.evidence_observation_ids, filters).map(o => o.id),
      is_cross_informant_synthesis: r.evidence_observation_ids.length === 0 && r.tier === 'analytical',
    })),
    observations: [...new Map(active.flatMap(r => scopedObservations(r.evidence_observation_ids, filters)).map(o => [o.id, o])).values()],
    memos: memos.filter(m => active.some(r => (r.memo_ids as string[]).includes(m.id))),
    matrix_cells: matrix.filter(c => active.some(r => (r.matrix_cell_ids as string[]).includes(c.id))),
  }
}

// Stable identities only: aliases normalize vocabulary, never assign evidence.
export const evidenceMomentIds: Record<string, string> = { M_FORM: 'formidlingsrammer', M_PROJ: 'prosjektgrunnlag', M_DEV: 'utviklergrunnlag', M_PRESS: 'pressemateriale' }
export const evidenceSourceIds: Record<string, string> = { P_EMAIL: 'epost', P_TRAILER: 'trailer', P_STEAM: 'steam', P_PROJECTWEB: 'project_site', P_DEVELOPERWEB: 'developer_site', P_ACTIVITY: 'activity', P_PRESSKIT: 'presskit' }
export type EvidenceCell = typeof evidence.cells[number]
export type EvidenceCode = EvidenceCell['primaryCodes'][number]
export const evidenceById = new Map(evidence.cells.map(cell => [cell.id, cell]))
export function evidenceForPair(sourceId: string, momentId: string) {
  return evidenceById.get(evidenceMomentIds[momentId] + '__' + evidenceSourceIds[sourceId])
}
export function curatedEvidenceCells(matrixIds: string[], rows: Relation[]) {
  const cells = matrixIds.length ? matrixIds.flatMap(id => {
    const cell = matrixById.get(id)
    return cell ? [evidenceForPair(cell.row_id, cell.column_id)] : []
  }) : rows.map(row => evidenceForPair(row.source_id, row.target_id))
  return [...new Map(cells.filter((cell): cell is EvidenceCell => !!cell && cell.classification !== 'none' && [...cell.primaryCodes, ...cell.contextCodes].some(code => code.text.trim())).map(cell => [cell.id, cell])).values()]
}
export function scopedEvidenceCodes(codes: EvidenceCode[], filters: Filters) {
  return [...new Map(codes.filter(code =>
    (code.informant !== 'Z' || filters.includeExpert) && (filters.informant === 'all' || code.informant === filters.informant)
  ).map(code => [code.codeId, code])).values()].sort((a, b) => a.informant.localeCompare(b.informant) || a.codeId.localeCompare(b.codeId))
}

/** The overview marks only pairs with remaining code text in the current scope. */
export function overviewCellStatus(cell: typeof matrix[number], filters: Filters): MatrixStatus | 'filtered' {
  const evidence = evidenceForPair(cell.row_id, cell.column_id)
  if (cell.status === 'none' || !evidence || !scopedEvidenceCodes([...evidence.primaryCodes, ...evidence.contextCodes], filters).some(code => code.text.trim())) return 'none'
  return matrixCellVisible(cell.status, filters) ? cell.status as MatrixStatus : 'filtered'
}
