# Curated cell evidence, 2026-10-21

`data/infobokser_evidens.json` is the user-supplied, curated evidence source for all 28 moment/paratext pairs. Its bytes and paraphrases are retained as supplied. The task specification is archived at `sources/evidence_instructions_2026-10-21.md`.

The supplied CSV was checked against all 28 JSON records (classification, primary count, unique A–E, context count, case section and warning) and removed as a redundant temporary export. JSON is the maintained source.

The `model.ts` adapter maps stable P_*/M_* identities to explicit cell IDs such as `formidlingsrammer__epost`. Aliases and category text are never evidence matching rules. `indirect` corresponds to the existing matrix status `possible`. All 28 classifications match the current revised matrix, so no markings or historical relation records need changing. Tests enforce this consistency on future regeneration.

B5 code IDs belong to this curated dataset; they must not be joined to OBS identifiers by number. The curated file corrects extraction boundaries and makes cell-specific evidence selections that cannot be reconstructed from category-name matches. Original observations, PDFs, historical relations and matrices remain intact.

Source panels for mapped cells and relation pairs use only the curated selection: primary codes grouped by A–E, expert Z separately when enabled, context codes in a separate collapsed section, and case sections/interpretive warnings kept visible. Counts deduplicate code IDs within each cell and count distinct A–E separately. Context codes and Z never increase the A–E count. No global deduplication across cells occurs.

A clear cell with no primary codes is explicitly described as interpretation/case support. A `none` cell stays empty and noninteractive. Parentheses in paraphrases carry a researcher-comment warning. The presentation is evidence mapping of the codebook, not a new analysis of original interview transcripts; counts are not measures of strength or effect.

JSON exports include curated evidence scoped to active relation pairs and informant/expert filters. Raw provenance remains available in the canonical source data. The rest of the research figures continue using the shared relation model.
