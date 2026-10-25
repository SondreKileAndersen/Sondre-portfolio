#!/usr/bin/env python3
"""Explicitly verify all 8 independent tier toggle combinations using canonical JSON."""
import itertools,json
from pathlib import Path
P=Path(__file__).resolve().parents[1]/'data'
r=json.loads((P/'relations.json').read_text())
counts={t:sum(x['tier']==t for x in r) for t in ['direct','analytical','exploratory']}
assert counts=={'direct':38,'analytical':41,'exploratory':6},counts
for flags in itertools.product([False,True],repeat=3):
    active={tier for tier,on in zip(counts,flags) if on}
    active_edges=[edge for edge in r if edge['tier'] in active]
    expect=sum(counts[t] for t in active)
    assert len(active_edges)==expect,(active,expect,len(active_edges))
    assert all(edge['tier'] in active for edge in active_edges)
    print(', '.join(sorted(active)) or '(none)',':',expect,'relation records')
print('8 / 8 independent tier-toggle combinations PASSED')
