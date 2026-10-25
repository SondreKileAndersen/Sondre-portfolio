#!/usr/bin/env python3
"""Validate referential integrity, tier semantics, counting safeguards, source audit."""
from pathlib import Path
import json, collections, sys
ROOT=Path(__file__).resolve().parents[1]
D=ROOT/'data'
def load(name):return json.loads((D/name).read_text(encoding='utf-8'))
obs=load('observations.json'); concepts=load('concepts.json'); rels=load('relations.json')
inf=load('informants.json'); ctx=load('contexts.json'); memos=load('memos.json');matrix=load('analysis_matrix.json')
stances=load('stances.json'); process=load('process_model.json'); comparison=load('comparison_matrix.json')
errors=[]
def assert_(truth,msg):
    if not truth:errors.append(msg)
def unique(arr,kind):
    ids=[x['id'] for x in arr];assert_(len(set(ids))==len(ids),f'{kind} duplicate IDs');return set(ids)
O=unique(obs,'observations'); C=unique(concepts,'concepts');R=unique(rels,'relations'); I=unique(inf,'informants')
X=unique(ctx,'contexts'); M=unique(memos,'memos');MA=unique(matrix,'matrix'); ST=unique(stances,'stances')
for o in obs:
    assert_(o['pdf_page'] in range(1,12),o['id']+' bad PDF source page')
    assert_(o['informant'] in I or o['informant']=='Samlet',o['id']+' wrong informant')
    assert_(o['section_based_moment_id'] in C or o['section_based_moment_id'] is None,o['id']+' invalid section moment')
    assert_(set(o['keyword_matched_concept_ids']).issubset(C),o['id']+' invalid keyword hint')
    assert_(o['source']['printed_page']==96+o['source']['pdf_page'],o['id']+' wrong printed page')
for r in rels:
    assert_(r['tier'] in ('direct','analytical','exploratory'),r['id']+' invalid tier')
    assert_(r['source_id'] in C and r['target_id'] in C,r['id']+' invalid node id')
    assert_(set(r['evidence_observation_ids']).issubset(O),r['id']+' missing observation')
    assert_(set(r['memo_ids']).issubset(M),r['id']+' missing memo')
    assert_(set(r['matrix_cell_ids']).issubset(MA),r['id']+' missing matrix cell')
    assert_(set(r['context_ids']).issubset(X),r['id']+' missing context')
    assert_(r['numeric_weight'] is None,r['id']+' fabricated numeric strength')
    if r['tier']=='direct':
        assert_(len(r['evidence_observation_ids'])>0,r['id']+' direct without evidence')
        assert_(r['provenance_scope']=='codebook_statement',r['id']+' direct not codebook')
    if r['tier']=='analytical':assert_(bool(r['memo_ids'] or r['matrix_cell_ids']),r['id']+' analysis not sourced')
    if r['tier']=='exploratory':
        assert_(not r['evidence_observation_ids'],r['id']+' hypothesis incorrectly cites direct evidence')
        assert_(r['review_status']=='hypothesis_not_validated',r['id']+' hypothesis misclassified')
for m in matrix: assert_(m['status'] in ('clear','possible','none') and m['row_id'] in C and m['column_id'] in C,m['id']+' invalid')
for s in stances:
    assert_(s['informant_id'] in I and s['concept_id'] in C,s['id']+' invalid informant/topic')
    assert_(set(s['observation_ids']).issubset(O),s['id']+' invalid source')
    assert_(all(next(o for o in obs if o['id']==i)['informant']==s['informant_id'] for i in s['observation_ids']),s['id']+' wrong informant provenance')
assert_(len(comparison)==50,'Comparison matrix must cover A-E x 10 themes')
assert_(all(x['status'] in ('documented_position','not_coded_in_this_comparison') for x in comparison),'comparison statuses not controlled')
assert_(not process['is_universal_order'],'Process MUST NOT be a universal order')
assert_(set(e['tier'] for e in process['edges'])=={'analytical'},'Process tier not analytical')
for e in process['edges']:assert_(set(e['memo_ids']).issubset(M),'process edge without memo')
assert_(len(obs)==227,'PDF-derived codebook count changed unexpectedly; review extraction')
assert_(collections.Counter(x['informant'] for x in obs)=={'A':51,'B':41,'C':21,'D':28,'E':47,'Z':38,'Samlet':1},'Codebook informant count differs from checked baseline')
assert_(len(set((x['informant'],x['text_normalized']) for x in obs))==216,'Duplicate counts changed')
assert_(len(matrix)==28,'Original analytical matrix should have 7x4 cells')
assert_((ROOT/'sources'/'Vedlegg for kodebok og koder.pdf').is_file(),'PDF not present')
assert_((ROOT/'sources'/'kapittel_5_analyse.md').is_file(),'Master analysis not present')
assert_((ROOT/'sources'/'original_paratekst_matrix.png').is_file(),'Original matrix screenshot not present')
revision=load('matrix_revision.json')
original=load('original_matrix.json')
active=[r for r in rels if r.get('analysis_included',True)]
assert_(collections.Counter(c['status'] for c in matrix)=={'clear':11,'possible':9,'none':8},'Revised matrix statuses differ from approved review')
assert_(collections.Counter(r['tier'] for r in active)=={'direct':37,'analytical':36,'exploratory':4},'Active relation tiers differ from revised baseline')
assert_(len(revision['changes'])==10,'Expected ten approved matrix changes')
for c in matrix:
    old=next(x for x in original if x['id']==c['id'])
    decision=next((x for x in revision['changes'] if x['cell_id']==c['id']),None)
    assert_(c['status']==(decision['to'] if decision else old['status']),c['id']+' revision mismatch')
    assert_(bool(c['note']),c['id']+' missing review rationale')
    matching=[r for r in active if r['source_id']==c['row_id'] and r['target_id']==c['column_id']]
    assert_(c['status']!='none' or not matching,c['id']+' excluded pair still active')
if errors:
    print('VALIDATION FAILED:',len(errors),'errors')
    for e in errors: print('-',e)
    sys.exit(1)
print('VALIDATION PASSED',len(obs),'observations,',len(rels),'relations,',len(matrix),'matrix cells,',len(stances),'annotated stances')
