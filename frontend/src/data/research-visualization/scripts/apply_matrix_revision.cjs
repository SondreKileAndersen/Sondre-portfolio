// Reapply the documented review without modifying original observations or source files.
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const write = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data, null, 2) + '\n')
const revision = read('data/matrix_revision.json')
const original = read('data/original_matrix.json')
const reasons = new Map()
const sourceIds = { 'E-post':'P_EMAIL', Trailer:'P_TRAILER', 'Steam-side':'P_STEAM', Prosjektnettside:'P_PROJECTWEB', Utviklerside:'P_DEVELOPERWEB', 'Synlig aktivitet':'P_ACTIVITY', Pressepakke:'P_PRESSKIT' }
let moment
for (const line of fs.readFileSync(path.join(root, revision.review_source), 'utf8').split(/\r?\n/)) {
  if (/^A\. /.test(line)) moment = 'M_FORM'
  if (/^B\. /.test(line)) moment = 'M_PROJ'
  if (/^C\. /.test(line)) moment = 'M_DEV'
  if (/^D\. /.test(line)) moment = 'M_PRESS'
  const fields = line.split('\t')
  if (fields.length === 4 && sourceIds[fields[0]]) reasons.set(`${sourceIds[fields[0]]}|${moment}`, fields[3])
}
if (reasons.size !== 28) throw Error('Expected 28 reviewed cells')
const matrix = original.map(cell => {
  const change = revision.changes.find(change => change.cell_id === cell.id)
  if (change && change.from !== cell.status) throw Error('Revision baseline mismatch: ' + cell.id)
  return { ...cell, status: change?.to ?? cell.status, original_status: cell.status,
    provenance_type: 'researcher_revised_analysis_matrix', source: revision.review_source,
    historical_source: cell.source, revision_id: revision.id,
    note: reasons.get(`${cell.row_id}|${cell.column_id}`),
    qualification: cell.row_id === 'P_ACTIVITY' ? revision.activity_note : '',
    method_source: revision.method_source }
})
write('data/analysis_matrix.json', matrix)
const csv = (file, rows) => {
  const fields = [...new Set(rows.flatMap(row => Object.keys(row)))]
  const quote = value => '"' + String(Array.isArray(value) ? value.join('|') : value ?? '').replaceAll('"', '""') + '"'
  fs.writeFileSync(path.join(root, file), '\ufeff' + [fields.map(quote).join(','), ...rows.map(row => fields.map(field => quote(row[field])).join(','))].join('\r\n') + '\r\n')
}
csv('data/analysis_matrix.csv', matrix)
// Preserve every historical record and its observation links. Withdraw only its
// inclusion in the current synthesis, never the existence of its source evidence.
const relations = read('sources/relations_v1.json').map(relation => {
  const cell = matrix.find(cell => cell.row_id === relation.source_id && cell.column_id === relation.target_id)
  const included = !cell || cell.status !== 'none'
  const reviewed = { ...relation, analysis_included: included, analysis_revision_id: revision.id,
    analysis_review_note: !included ? 'Excluded from current analytical synthesis by user review; historical evidence is retained. ' + cell.note : '' }
  if (cell && relation.provenance_scope === 'researcher_matrix') {
    reviewed.label = 'Revidert analysematrise: ' + ({ clear:'tydelig begrunnet', possible:'indirekte / betinget', none:'ikke tilstrekkelig begrunnet' })[cell.status]
    reviewed.provenance_note = revision.id + ': ' + cell.note + ' This is analytical classification, not an empirical strength score.'
  }
  return reviewed
})
write('data/relations.json', relations)
csv('data/relations.csv', relations)
const manifest = read('data/manifest.json')
manifest.version = revision.version
manifest.active_matrix_file = 'analysis_matrix.json'
manifest.original_matrix_file = 'original_matrix.json'
manifest.active_revision_id = revision.id
manifest.matrix_interpretation = revision.definitions
manifest.analysis_scope = revision.scope
write('data/manifest.json', manifest)
const quality = read('data/quality_report.json')
const active = relations.filter(relation => relation.analysis_included)
const countTiers = rows => Object.fromEntries(['direct','analytical','exploratory'].map(tier => [tier, rows.filter(row => row.tier === tier).length]))
quality.relations_by_tier = countTiers(active)
quality.total_relations = active.length
quality.historical_relations = relations.length
quality.historical_relations_by_tier = countTiers(relations)
quality.withdrawn_relation_ids = relations.filter(row => !row.analysis_included).map(row => row.id)
quality.matrix_nonempty = matrix.filter(cell => cell.status !== 'none').length
quality.matrix_status_counts = Object.fromEntries(['clear','possible','none'].map(status => [status, matrix.filter(cell => cell.status === status).length]))
quality.matrix_revision_id = revision.id
write('data/quality_report.json', quality)
console.log(JSON.stringify({ revision:revision.id, changes:revision.changes.length, statuses:quality.matrix_status_counts, active_relations:active.length, tiers:quality.relations_by_tier, withdrawn:quality.withdrawn_relation_ids }, null, 2))
