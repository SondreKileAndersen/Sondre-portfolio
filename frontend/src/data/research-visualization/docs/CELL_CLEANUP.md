# User review: cell cleanup and external-information labels

The explicit user list removes 67 code assignments across 14 curated cells. Both primary and context assignments are removed when listed. The removed records, including their cell and evidence role, are retained in `meta.cellEvidenceCorrections` under `user-cell-cleanup`. The complete previous curated file is in `sources/infobokser_evidens_before_cell_cleanup.json`.

All codes are removed from the project-site cells for Formidlingsrammer, Prosjektgrunnlag, Utviklergrunnlag and Pressemateriale. No classifications, original observations, or original relation records change. Code removals are cell-specific; other assignments of the same code remain. Unique primary A–E informants are recalculated.

The unheaded list about trailer/news and B-roll is applied to Pressemateriale in Trailer. The isolated “F” under Prosjektgrunnlag in visible development activity has no identifiable code/informant in the dataset and awaits user clarification; that cell is unchanged.

P_PROJECTWEB and P_DEVELOPERWEB keep their stable identities and are displayed as “Ekstern info om prosjektet*” and “Ekstern info om utvikler*”. The footnote defines these surfaces as websites, social media, blogs and forums. The previous concept file is archived in `sources/concepts_before_external_info_rename.json`.

Within each cell subtitle, primary and context texts are presented together under one heading for each informant, A–E followed by Z when enabled. Duplicate text within the same informant/cell is shown once, preferring primary evidence when duplicated. The JSON retains primary/context evidence roles; invisible data attributes preserve that distinction in rendered entries.

## Follow-up: project activity

The user subsequently explicitly requested removal of all codes from prosjektgrunnlag__activity. Both primaryCodes and contextCodes are now empty, and uniquePrimaryInformants is empty. The seven former contextual assignments are retained in meta.cellEvidenceCorrections under clear-project-activity-evidence. The previous deferral is superseded. Classification remains unchanged.
