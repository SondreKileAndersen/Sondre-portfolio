# Codex repository instructions — Kvalitativ visualiseringslab

Build an academic Norwegian-language data exploration site from the checked-in JSON datasets. Preserve provenance, uncertainty, contradiction and non-linear processes. Follow `CODEX_TASK.md` for scope, `docs/METHOD.md` for methodological safeguards, and `docs/DATA_DICTIONARY.md` when changing the data model.

- **Single source of truth**: `data/*.json`. CSV files are read-only exports for inspection; do not maintain two independent data copies.
- **Core toggles must be independent**: `direct`, `analytical`, `exploratory`. Default true, true, false respectively. No layer is a numerical weight.
- **No invented empirical support**. Direct relations require existing `evidence_observation_ids`. Analytical relations cite `memo_ids` or `matrix_cell_ids`. Exploratory relations must be labeled as unverified hypotheses, never findings.
- **No statistical claims from sparse qualitative notes**. Counts are codebook entries, unique primary informants, or documented relationships; label every denominator and distinction clearly. No percentages generalizing beyond A–E.
- **A–E and Z are separate**. Exclude Z by default from aggregations. `Samlet` is the researcher's assumption, not an informant.
- **Absence of evidence != disproof.** A blank comparison cell is `not_coded_in_this_comparison`, not "disagrees".
- **User's original four moments are analytical categories**; no fixed evaluation order, equal weighting, universal threshold, or causal inference.
- **Never infer direct evidence from matrix black dots.** `original_matrix.json` is researcher interpretation; `clear` and `possible` are matrix statuses, not direct/analytical tiers.
- **Do not turn keyword matches into evidence**. `keyword_matched_concept_ids` are unreviewed search hints.
- **Treat `design_traceability.json` null actual design choice as UNKNOWN.** Never invent Cosmic Anchor implementation evidence.
- When a user filters one informant, do not attribute global memo/matrix relations to that person. Either hide the global synthesis in person-specific mode, or show it visibly separated and labelled as cross-informant interpretation.
- Every visible edge/mark should be clickable to show its provenance (source PDF page, relevant codebook wording, memo, matrix cell) and its tier.
- Prefer a simple maintainable frontend. If an existing application exists, adapt to its stack. Otherwise React + TypeScript is suitable. Use SVG/canvas visualization libraries only where they improve readability.
- After code changes, run `python scripts/validate_dataset.py`, test all eight tier-toggle combinations (including none), and test filtering for A–E vs Z. Report exact tested commands and any known limitations.
- Do not edit original source PDF, the master's text, or the original matrix screenshot. If you correct derived tags, record why and keep the raw quoted/paraphrased codebook text unchanged.
