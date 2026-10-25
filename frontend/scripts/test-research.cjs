const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const dataRoot = path.join(root, 'src/data/research-visualization')
const crypto = require('node:crypto')
for (const line of fs.readFileSync(path.join(dataRoot,'SHA256SUMS.txt'),'utf8').trim().split(/\r?\n/)) {
  const [,expected,file] = line.match(/^([a-f0-9]+)\s+(.+)$/)
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dataRoot,file))).digest('hex'),expected, 'Original package changed: '+file)
}

const historicalHashes=new Map(fs.readFileSync(path.join(dataRoot,'sources/SHA256SUMS.v1.txt'),'utf8').trim().split(/\r?\n/).map(line=>{const [,hash,file]=line.match(/^([a-f0-9]+)\s+(.+)$/);return [file,hash]}));
for(const file of ['data/observations.json','data/original_matrix.json','sources/Vedlegg for kodebok og koder.pdf','sources/kapittel_5_analyse.md','sources/original_paratekst_matrix.png'])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dataRoot,file))).digest('hex'),historicalHashes.get(file));
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dataRoot,'sources/relations_v1.json'))).digest('hex'),historicalHashes.get('data/relations.json'));
const json = name => JSON.parse(fs.readFileSync(path.join(dataRoot, 'data', name + '.json'), 'utf8'))
const [obs, concepts, rels, matrix, memos, stances, comparison, process, informants, contexts] = ['observations','concepts','relations','analysis_matrix','memos','stances','comparison_matrix','process_model','informants','contexts'].map(json)
const ids = rows => { const result = new Set(rows.map(r => r.id)); assert.equal(result.size, rows.length); return result }
const O=ids(obs), C=ids(concepts), R=ids(rels), MA=ids(matrix), M=ids(memos), S=ids(stances), I=ids(informants), X=ids(contexts)
const subset=(a,b)=>a.every(x=>b.has(x))
// The package's Python invariants, also runnable with the project's Node runtime.
for(const o of obs) {
  assert(o.pdf_page>=1&&o.pdf_page<=11)
  assert(I.has(o.informant)||o.informant==='Samlet')
  assert(o.section_based_moment_id===null||C.has(o.section_based_moment_id))
  assert(subset(o.keyword_matched_concept_ids,C))
  assert.equal(o.source.printed_page,96+o.source.pdf_page)
}
for(const r of rels) {
  assert(['direct','analytical','exploratory'].includes(r.tier))
  assert(C.has(r.source_id)&&C.has(r.target_id))
  assert(subset(r.evidence_observation_ids,O)&&subset(r.memo_ids,M)&&subset(r.matrix_cell_ids,MA)&&subset(r.context_ids,X))
  assert.equal(r.numeric_weight,null)
  if(r.tier==='direct') { assert(r.evidence_observation_ids.length); assert.equal(r.provenance_scope,'codebook_statement') }
  if(r.tier==='analytical') assert(r.memo_ids.length||r.matrix_cell_ids.length)
  if(r.tier==='exploratory') { assert.equal(r.evidence_observation_ids.length,0); assert.equal(r.review_status,'hypothesis_not_validated') }
}
for(const cell of matrix) { assert(['clear','possible','none'].includes(cell.status)); assert(C.has(cell.row_id)&&C.has(cell.column_id)) }
for(const stance of stances) {
  assert(I.has(stance.informant_id)&&C.has(stance.concept_id)&&subset(stance.observation_ids,O))
  assert(stance.observation_ids.every(id=>obs.find(o=>o.id===id).informant===stance.informant_id))
}
assert.equal(comparison.length,50)
assert(comparison.every(c=>['documented_position','not_coded_in_this_comparison'].includes(c.status)&&subset(c.stance_ids,S)))
assert.equal(process.is_universal_order,false)
assert(process.edges.every(e=>e.tier==='analytical'&&subset(e.memo_ids,M)))
assert.equal(obs.length,227)
assert.equal(obs.filter(o=>o.flags.length).length,5)
assert.deepEqual(Object.fromEntries(['A','B','C','D','E','Z','Samlet'].map(id=>[id,obs.filter(o=>o.informant===id).length])),{A:51,B:41,C:21,D:28,E:47,Z:38,Samlet:1})
assert.equal(new Set(obs.map(o=>o.informant+'|'+o.text_normalized)).size,216)
assert.equal(matrix.length,28)
for(const file of ['Vedlegg for kodebok og koder.pdf','kapittel_5_analyse.md','original_paratekst_matrix.png']) assert(fs.existsSync(path.join(dataRoot,'sources',file)))
assert(json('design_traceability').every(row=>row.cosmic_anchor_actual_design_choice===null))
console.log(`PASS: dataset invariants (${obs.length} observations, ${R.size} historical relations, ${matrix.length} cells)`)


const revision=json('matrix_revision'),original=json('original_matrix');
const expected={M_FORM:['clear','possible','clear','possible','none','none','none'],M_PROJ:['clear','clear','clear','clear','none','possible','possible'],M_DEV:['clear','none','possible','possible','clear','clear','none'],M_PRESS:['possible','clear','possible','possible','none','none','clear']};
const sourceOrder=['P_EMAIL','P_TRAILER','P_STEAM','P_PROJECTWEB','P_DEVELOPERWEB','P_ACTIVITY','P_PRESSKIT'];
for(const [moment,statuses] of Object.entries(expected))for(const [i,status] of statuses.entries())assert.equal(matrix.find(c=>c.row_id===sourceOrder[i]&&c.column_id===moment).status,status);
assert.equal(revision.changes.length,10);assert.equal(matrix.filter(c=>c.status==='clear').length,11);assert.equal(matrix.filter(c=>c.status==='none').length,8);
assert.equal(matrix.filter(c=>c.status!==original.find(o=>o.id===c.id).status).length,10);
const activeRelations=rels.filter(r=>r.analysis_included!==false);
assert.equal(activeRelations.length,77);
for(const c of matrix){assert(c.note&&c.revision_id===revision.id);if(c.status==='none')assert(!activeRelations.some(r=>r.source_id===c.row_id&&r.target_id===c.column_id));}
assert.equal(rels.find(r=>r.id==='REL-0022').analysis_included,false);
assert(rels.find(r=>r.id==='REL-0022').evidence_observation_ids.includes('OBS-0187'));
console.log('PASS: all 28 approved revised statuses, 10 changes, excluded pairs absent, original evidence retained');

// Execute the actual production adapter, including JSON imports.
const file=path.join(root,'src/lib/researchVisualization/model.ts'), exportsObject={}
vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{
  exports:exportsObject, require:location=>JSON.parse(fs.readFileSync(path.resolve(path.dirname(file),location),'utf8')),
},{filename:file})
const model=exportsObject
const fresh=()=>structuredClone(model.defaultFilters)
for(let mask=0;mask<8;mask++) {
  const f=fresh();f.includeExpert=true
  f.tiers={direct:!!(mask&1),analytical:!!(mask&2),exploratory:!!(mask&4)}
  const selected=model.selectRelations(f)
  assert.equal(selected.length,[0,37,32,69,3,40,35,72][mask])
  assert(selected.every(r=>f.tiers[r.tier]))
  const pairs=model.projectPairs(selected),upset=model.deriveRelationRows(pairs)
  assert.equal(upset.length,pairs.length?6:0)
  assert.equal(new Set(upset.map(row=>row.id)).size,upset.length)
  for(const row of upset) assert(row.relations.every(relation=>relation.source_id===row.id))
  for(const row of model.rowIds) {
    const membership=pairs.filter(p=>p.source===row).map(p=>p.target).sort().join('|')
    const group=upset.find(g=>g.id===row)
    assert.equal(group?[...group.moments].sort().join('|'):'',membership)
  }
  for(const pair of pairs) assert.equal(pair.relations.length,selected.filter(r=>r.source_id===pair.source&&r.target_id===pair.target).length)
  if(!f.tiers.analytical) { assert.equal(model.processVisible(f),false); assert.equal(model.originalMatrixVisible(f),false) }
}
for(const person of ['A','B','C','D','E','Z']) {
  const f=fresh();f.informant=person;f.includeExpert=true;f.tiers.exploratory=true
  const selected=model.selectRelations(f)
  assert(selected.every(r=>r.evidence_observation_ids.length>0))
  assert(selected.every(r=>model.scopedObservations(r.evidence_observation_ids,f).every(o=>o.informant===person)))
  assert(!model.processVisible(f)&&!model.originalMatrixVisible(f))
  const cells=model.scopeComparison(f)
  assert(cells.every(c=>c.informant_id===person))
  f.crossInformant=true;assert(model.selectRelations(f).some(r=>r.tier==='analytical'))
}
const defaults=fresh()
assert.equal(defaults.tiers.exploratory,false)
assert.equal(model.scopedObservations(obs.map(o=>o.id),defaults).length,188)
assert(!model.exportSelection(defaults).observations.some(o=>o.informant==='Z'||o.informant==='Samlet'))
const f=fresh();f.statuses.possible=false
const noPossible=model.selectRelations(f)
assert(noPossible.filter(r=>r.tier==='direct').length===model.selectRelations(defaults).filter(r=>r.tier==='direct').length)
assert(!noPossible.some(r=>r.matrix_cell_ids.some(id=>matrix.find(c=>c.id===id).status==='possible')))
assert.equal(model.primaryInformantCount(rels.filter(r=>r.tier==='analytical'),defaults),null)
assert.equal(model.scopeComparison(defaults).filter(c=>c.activeStances.length===0).length,comparison.filter(c=>c.status==='not_coded_in_this_comparison').length)
const onlyHypotheses=fresh();onlyHypotheses.tiers={direct:false,analytical:false,exploratory:true}
assert.equal(model.primaryInformantCount(model.selectRelations(onlyHypotheses),onlyHypotheses),null)
assert.equal(model.scopeComparison(onlyHypotheses).length,0)
const context=fresh();context.context='C_SECONDARY'
assert(model.selectRelations(context).every(r=>r.context_ids.includes('C_SECONDARY')))
assert(!model.processVisible(context))
console.log('PASS: all 8 tier combinations, shared network/UpSet memberships, provenance, matrix statuses, A–E/Z, global synthesis, missing values and contexts')

const evidence=json('infobokser_evidens');
assert.equal(evidence.cells.length,28);ids(evidence.cells);
for(const cell of matrix.filter(cell=>cell.row_id!=='P_PROJECTWEB')){
  const curated=model.evidenceForPair(cell.row_id,cell.column_id);
  assert(curated,'Explicit stable-ID mapping for '+cell.id);
  assert.equal(curated.classification==='indirect'?'possible':curated.classification,cell.status);
  const unique=[...new Set(curated.primaryCodes.filter(code=>code.informant!=='Z').map(code=>code.informant))].sort();
  assert.deepEqual(unique,[...curated.uniquePrimaryInformants].sort());
  for(const [codes,role] of [[curated.primaryCodes,'direct_or_nearest'],[curated.contextCodes,'contextual_not_cell_direct']]){
    assert.equal(new Set(codes.map(code=>code.codeId)).size,codes.length);
    for(const code of codes){assert(/^B5-\d+$/.test(code.codeId));assert(/^[A-EZ]$/.test(code.informant));assert(code.text);assert.equal(code.evidenceRole,role);}
  }
  assert(curated.interpretiveWarning);
  const scoped=model.scopedEvidenceCodes(curated.primaryCodes,fresh());assert(!scoped.some(code=>code.informant==='Z'));
  for(const person of ['A','B','C','D','E'])assert(model.scopedEvidenceCodes(curated.primaryCodes,{...fresh(),informant:person}).every(code=>code.informant===person));
}
assert.equal(model.evidenceForPair('P_EMAIL','M_FORM').primaryCodes.length,3);
assert.equal(model.evidenceForPair('P_PROJECTWEB','M_PROJ'),undefined);
const zCodes=[{codeId:'B5-test',informant:'Z',text:'test',evidenceRole:'direct_or_nearest'}];
assert.equal(model.scopedEvidenceCodes(zCodes,fresh()).length,0);assert.equal(model.scopedEvidenceCodes(zCodes,{...fresh(),includeExpert:true}).length,1);
const noTiers=fresh();noTiers.tiers={direct:false,analytical:false,exploratory:false};assert.equal(model.exportSelection(noTiers).curated_evidence.cells.length,0);
console.log('PASS: 28 curated cells, stable mappings, classifications, primary/context roles, deduplication, A-E counts and separate expert filtering');

const mergedMedia=evidence.cells.flatMap(cell=>[...cell.primaryCodes,...cell.contextCodes]).filter(code=>code.codeId==='B5-163');
assert.equal(mergedMedia.length,3);assert(mergedMedia.every(code=>code.text.startsWith('henter bilder og video direkte fra Steam-siden')&&code.sourceCodeIds.join('|')==='B5-163|B5-167'&&code.sourceObservationIds.join('|')==='OBS-0173|OBS-0177'));
assert(!evidence.cells.some(cell=>[...cell.primaryCodes,...cell.contextCodes].some(code=>code.codeId==='B5-167')));
console.log('PASS: E Steam images/video merged once per cell, with original code and observation provenance');

assert(!model.evidenceForPair('P_STEAM','M_PRESS').contextCodes.some(code=>['B5-160','B5-161','B5-162','B5-170'].includes(code.codeId)));
for(const id of ['B5-160','B5-161','B5-162','B5-170'])assert(evidence.cells.some(cell=>cell.id!=='pressemateriale__steam'&&[...cell.primaryCodes,...cell.contextCodes].some(code=>code.codeId===id)));
console.log('PASS: four unrelated codes removed from Steam context, retained in other cells');

const cleanup=evidence.meta.cellEvidenceCorrections.find(review=>review.id==='user-cell-cleanup');assert.equal(cleanup.changes.reduce((n,c)=>n+c.removedCodes.length,0),67);
for(const change of cleanup.changes){const cell=evidence.cells.find(cell=>cell.id===change.cellId);for(const removed of change.removedCodes)assert(!cell[change.group].some(code=>code.codeId===removed.codeId));}
for(const cell of evidence.cells.filter(cell=>cell.id.endsWith('__project_site'))){assert.equal(cell.primaryCodes.length+cell.contextCodes.length,0);assert.equal(cell.paratekst,'Ekstern info om prosjektet*');}
assert.equal(model.conceptById.get('P_DEVELOPERWEB').label,'Ekstern info om utvikler*');
console.log('PASS: all 67 requested code removals, empty project-info cells and stable renamed concepts');

const projectActivity=model.evidenceForPair('P_ACTIVITY','M_PROJ');assert.equal(projectActivity.primaryCodes.length,0);assert.equal(projectActivity.contextCodes.length,0);assert.equal(projectActivity.uniquePrimaryInformants.length,0);

const overviewStatuses=model.dataset.matrix.map(cell=>model.overviewCellStatus(cell,fresh()));assert.equal(overviewStatuses.filter(status=>status==='clear').length,10);assert.equal(overviewStatuses.filter(status=>status==='possible').length,5);assert.equal(overviewStatuses.filter(status=>status==='none').length,9);
for(const filters of [fresh(),{...fresh(),includeExpert:true},{...fresh(),informant:'A',crossInformant:true}])for(const cell of model.dataset.matrix){const status=model.overviewCellStatus(cell,filters);if(['clear','possible'].includes(status)){const evidence=model.evidenceForPair(cell.row_id,cell.column_id);assert(model.scopedEvidenceCodes([...evidence.primaryCodes,...evidence.contextCodes],filters).some(code=>code.text.trim()));}}
for(const cell of model.dataset.matrix.filter(cell=>cell.row_id==='P_ACTIVITY'&&cell.column_id==='M_PROJ'))assert.equal(model.overviewCellStatus(cell,fresh()),'none');
console.log('PASS: no empty-evidence points; 10 colored, 5 hollow, 13 blank cells; informant/expert scope respected');

assert(!model.rowIds.includes('P_PROJECTWEB'));assert(!model.conceptById.has('P_PROJECTWEB'));assert.equal(model.dataset.matrix.length,24);assert.equal(model.dataset.evidence.cells.length,24);for(let mask=0;mask<8;mask++){const f=fresh();f.tiers={direct:!!(mask&1),analytical:!!(mask&2),exploratory:!!(mask&4)};assert(!model.selectRelations(f).some(r=>r.source_id==='P_PROJECTWEB'||r.target_id==='P_PROJECTWEB'));}
