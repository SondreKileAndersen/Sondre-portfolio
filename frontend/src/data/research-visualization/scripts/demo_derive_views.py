#!/usr/bin/env python3
"""Demonstrate deriving both network and UpSet data from the SAME relations.json.
CLI: python scripts/demo_derive_views.py [direct] [analytical] [exploratory]
Default = direct analytical.
"""
import json,sys,collections
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'
all_rels=json.loads((D/'relations.json').read_text())
obs={o['id']:o for o in json.loads((D/'observations.json').read_text())}
matrix=json.loads((D/'analysis_matrix.json').read_text())
selected=set(sys.argv[1:]) or {'direct','analytical'}
assert selected<={'direct','analytical','exploratory'}
rels=[r for r in all_rels if r['tier'] in selected and r.get('analysis_included',True)]
# Collapsing edges does NOT add tier weights. Evidence is a union of UNIQUE informants.
network={}
for r in rels:
    key=(r['source_id'],r['target_id'])
    if key not in network:network[key]={'from':key[0],'to':key[1],'tiers':set(),'obs':set(),'memo':set(),'matrix':set()}
    a=network[key];a['tiers'].add(r['tier']);a['obs'].update(r['evidence_observation_ids']);a['memo'].update(r['memo_ids']);a['matrix'].update(r['matrix_cell_ids'])
for a in network.values():
    info={obs[x]['informant'] for x in a['obs'] if obs[x]['informant'] in 'ABCDE'}
    a['distinct_primary_informants']=len(info) if a['obs'] else None # None means NOT MEASURED
    for k in ('tiers','obs','memo','matrix'):a[k]=sorted(a[k])
# UpSet only takes typed row->moment edges; using any active tier, not original matrix by fiat.
rows=[c['row_id'] for c in matrix if c['column_id']=='M_FORM']
moments=['M_FORM','M_PROJ','M_DEV','M_PRESS']
comb=collections.defaultdict(list)
for r in rows:
    membership=tuple(m for m in moments if (r,m) in network)
    comb[membership].append(r)
print(json.dumps({'filters':sorted(selected),
 'network_edge_count':len(network),'network_edges':list(network.values()),
 'upset_combinations':[{'moment_ids':list(k),'row_ids':v,'n_rows':len(v)} for k,v in comb.items()]},ensure_ascii=False,indent=2))
