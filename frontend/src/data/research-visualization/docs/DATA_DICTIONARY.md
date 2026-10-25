# Datadictionary og forbindelsesmodell (v1)

## Datasett og nøkkelfelter
| Fil | Enhet | Nøkler/felter | Praktisk rolle |
|---|---|---|---|
| `manifest.json` | Pakke | `filter_defaults`, `provenance_semantics`, `counting_policy` | Standardvalg og metodikk |
| `observations.json` | Én merket kodebokoppføring | `id`, `informant`, `text`, `source`, `code_section`, `code_subcategory`, `flags` | Opprinnelig kvalitative belegg |
| `informants.json` | Én informant | `id`, `role` | Separate primærinformanter / ekspert |
| `concepts.json` | Én node i modell | `id`, `kind`, `description` | Momenter, paratekster, signalklynger, begreper |
| `relations.json` | Én begrunnet relasjonspost | `id`, `source_id`, `target_id`, `tier`, `predicate`, provenienslister | Relasjonsgrafen |
| `original_matrix.json` | Én original matrise-celle | `id`, `row_id`, `column_id`, `status` | Trofast gjengivelse av tidligere 7×4-matrise |
| `memos.json` | Analytisk memo | `id`, `summary_analytical`, `source_pdf_pages` | Analytisk begrunnelse |
| `contexts.json` | Valgt konteksttype | `id`, `axis` | Filterverdier |
| `stances.json` | Ett eksplisitt annotert standpunkt | `informant_id`, `concept_id`, `stance`, `observation_ids`, `context_ids` | Støtte, unntak og negative case |
| `comparison_matrix.json` | Én informant × ett tema | `informant_id`, `concept_id`, `status`, `positions`, `stance_ids` | Sammenlignende kvalitativ matrise |
| `section_counts.json` | Én informant × én kodebokseksjon | `n_codebook_entries`, `n_distinct_normalized_statements` | Kodebokopptellinger (ikke viktighetsmål) |
| `process_model.json` | Én prosessmodell | `nodes`, `edges`, `is_universal_order:false` | Illustrative vurderingsveier |
| `design_traceability.json` | Ett analytisk funn | `finding`, `candidate_design_implication`, `cosmic_anchor_actual_design_choice` | Designsporbarhet; faktiske valg ukjent |
| `quality_report.json` | En valideringsrapport | tellinger | Datakvalitetskontroll |

## Observation
- `id`: stabil `OBS-0001` osv. Gjenbygging med samme kilde og prosedyre gir samme ID; ved fremtidig strukturell revisjon dokumenter eventuelle ID-endringer.
- `text`: originalt kodebokutsagn uten hakeparentes og informantprefiks, med whitespace normalisert. Det er **ikke ordrett intervjuavskrift**.
- `raw_bracket`: originalt uttrekk med omsluttende klammeparenteser der de finnes.
- `source`: `file`, PDF-side (1-basert), trykt oppgaveside. `pdf_page=1` svarer til trykt side 97.
- `code_section` og `code_subcategory`: kildekodebokens organisering, ikke likestilt med de fire vurderingsmomentene.
- `section_based_moment_id`: grov krysskobling for hovedseksjonene som *indeks*, ikke direkte bevist 1:1-relasjon for hvert utsagn.
- `keyword_matched_concept_ids`: datamaskinens søkehint, `keyword_match_status=automated_search_hint_not_validated_link`.
- `duplicate_group_id`: kun når teksten for samme informant gjentas ordrett etter normalisering.
- `flags`: `missing_closing_bracket`, `contains_embedded_analyst_comment`; vis tydelig.
- `kind=author_assumption` for `Samlet`: forskerantakelse, ikke intervjuempiri.

## Concepts / IDs
`M_*`: fire vurderingsmomenter. `P_*`: originalradene fra den første matrise; `P_ACTIVITY` har `kind=signal_cluster`; `P_PRESSKIT` har `kind=paratext_collection`. `S_*`: underliggende signaler og analytiske begreper. `C_*`: kontekst. `MEMO-*`, `OBS-*`, `REL-*`, `CELL-*` er hver sin ID-type.

## Relation
| Felt | Type | Bruk |
|---|---|---|
| `id` | string | Stabil relasjonspost |
| `source_id`, `target_id` | concept IDs | Navngitt rettet relasjon, ikke automatisk årsak |
| `tier` | `direct` / `analytical` / `exploratory` | Uavhengige av/på-brytere |
| `predicate` | string | Semantisk type: `provides_evidence_for`, `may_contribute_to`, `signals_partially`, osv. |
| `label` | string | Forståelig korttekst |
| `evidence_observation_ids` | array | Påkrevd for `direct` |
| `memo_ids` | array | Analytisk memo som begrunnelse |
| `matrix_cell_ids` | array | Opprinnelig analysematrise-cellereferanse |
| `context_ids` | array | Merket kontekst, ikke tegn på universell relevans |
| `provenance_scope` | string | `codebook_statement`, `researcher_matrix`, `memo_synthesis`, `research_question` |
| `review_status` | string | `curated` eller `hypothesis_not_validated` |
| `numeric_weight` | null | Skal IKKE erstattes med oppdiktet styrke |

Den samme koblingen kan ha flere relasjonsposter med forskjellig nivå, definisjon eller kilde. Aggreger kun *for tegning*, ikke ved å fjerne originalpostene. Ved gruppevalg returner alle originale REL-id-er og kildene.

## Matrisen: rader x kolonner
Ordnet radrekkefølge: `P_EMAIL`, `P_TRAILER`, `P_STEAM`, `P_PROJECTWEB`, `P_DEVELOPERWEB`, `P_ACTIVITY`, `P_PRESSKIT`.
Kolonner: `M_FORM`, `M_PROJ`, `M_DEV`, `M_PRESS`.

Status = `clear`, `possible`, `none`. Denne statusen er **uavhengig** av `tier`. Alle ikke-tomme matrise-celler er også publisert som **analytical** relasjoner; en separat direkte evidensrad kan peke til samme par.

## A–E/Z: filterregler
Ved visning av tverrinformant-figur kan global analytisk forskning være synlig. Ved valgt enkeltinformant skal analytisk matrix/memo som ikke har `evidence_observation_ids` ikke tilskrives personen; velg å skjule eller merke «tverrgående analyse». `Z` inkluderes ikke i standardtellingene; for eksplisitt ekspertvisning skiller vi primær- og ekspertprofil.

## Pseudokode for én felles filtreringspipeline
```ts
const active = new Set([
  ...(filters.direct ? ['direct'] : []),
  ...(filters.analytical ? ['analytical'] : []),
  ...(filters.exploratory ? ['exploratory'] : []),
]);
const selected = relations.filter(edge => active.has(edge.tier));
// Filter på researcher-matrisestatus bare hvis kilde = researcher_matrix.
// Ved enkeltinformant: vis bare direkte edge med evidence fra valgt informant,
// eller global synthesis i eksplisitt separat overlay.
// AGGREGER for UI på `${source_id}|${target_id}`; behold original REL[] for provenance.
// UpSet og nettverk bruker SAME selected + SAME groupByEndpoint pipeline.
```

## Eksport
JSON er primærdata. CSV i pakken er nyttige kontroll-/eksportfiler med pipe-separerte ID-lister (`|`) og UTF-8-BOM for enkel åpning i regneark; de er ikke egne sannhetskilder. Nye filterspesifikke eksporter skal inkludere `tier_filters`, `matrix_status_filters`, `primary_informant_filters`, `include_expert_z` og eksplisitt antallenhet i metadata.


## Revidert datagrunnlag 2026-10-21 (versjon 1.1.0)

Gjeldende klassifisering ligger i data/analysis_matrix.json: 11 tydelig begrunnede,
9 indirekte/betingede og 8 ikke tilstrekkelig begrunnede celler.
data/matrix_revision.json dokumenterer de ti endringene; begrunnelsene og
metodevurderingen er bevart ordrett i sources/review_matrix_2026-10-21.md og
sources/review_method_2026-10-21.md. Opprinnelige matrise, skjermbilde, PDF og
kodebokparafraser er bevart. De opprinnelige 85 relasjonspostene er også
arkivert i sources/relations_v1.json.

relations.json beholder alle 85 poster og deres opprinnelige IDs og empiriske
belegg, men analysis_included=false trekker åtte poster ut av gjeldende syntese
for de fem parene som nå er ikke markert. Aktive poster: 37 direkte, 36
analytiske og 4 utforskende (77 totalt). Uttrekk fra kodeboken slettes ikke og
omklassifiseres ikke til analytiske belegg. REL-0022 beholder OBS-0187 som
historisk dokumentasjon, men brukes ikke som selvstendig forbindelse i figuren.

clear/possible/none beskriver funksjonens begrunnelse i denne analysen, ikke
empirisk styrke, hyppighet eller universell rekkefølge. Synlig aktivitet er en
planlagt/delvis etablert funksjon, ikke dokumentasjon på at praksiscaset har
realisert den fullt ut. Chapter-referansene i brukergjennomgangen er ikke
konvertert til oppdiktede PDF-sidetall.

Generer reviderte JSON/CSV med node scripts/apply_matrix_revision.cjs.
build_dataset.py kjører samme revisjonstrinn etter historisk uttrekk, slik at
en regenerering ikke tilbakefører den nye kodingen. demo_derive_views.py og
frontend bruker bare aktive relasjoner og analysis_matrix.json.
Valider med python scripts/validate_dataset.py eller frontendens
npm.cmd run test:research. SHA256SUMS.txt er oppdatert etter dokumentert revisjon;
sources/SHA256SUMS.v1.txt bevarer den opprinnelige kontrollsummelisten.

Brukerens eksplisitte instruks er at vedlagte bilde gjelder data, ikke design.
Eksisterende farger, sirkler, tomme celler, horisontale streker, skrå overskrifter,
hovring og flytting beholdes derfor. Metodevedleggets forslag om å fjerne
horisontale streker implementeres ikke som visuell endring.
