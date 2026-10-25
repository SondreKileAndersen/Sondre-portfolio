# Metodedokumentasjon — kvalitativ kodebok som strukturerte data

## 1. Kildegrunnlag og begrensninger
Grunnlaget består av `sources/Vedlegg for kodebok og koder.pdf` (PDF-sider 1–22; selve kodeutsagnene står på de første 11 PDF-sidene, oppgavens trykte sider 97–107), brukerens analyseutdrag `sources/kapittel_5_analyse.md`, og `sources/original_paratekst_matrix.png`. PDF-kodeboken er **mest detaljerte tilgjengelige grunnlag**; fullstendige intervjutranskripsjoner og opprinnelige segment-frekvenser finnes ikke i denne pakken.

Hver `OBS-...` er et **registrert, kort formulert kodebokutsagn**, ikke et ordrett intervjusitat eller en statistisk uavhengig hendelse. 227 poster ble automatisk identifisert: 188 knyttet til hovedinformantene A–E, 38 til ekspert Z og 1 til forfatterens egen antakelse («Samlet»). 11 er normaliserte ordrette gjentakelser, og 5 er markert for gjennomgang (manglende `]` eller innskutte forskerkommentarer). PDF-sidetall og trykt sidetall ligger på hvert utsagn.

## 2. Tre *uavhengige* typer relasjonsproveniens

1. `direct`: forbindelse understøttet av et spesifikt kodebokutsagn hvor selve uttrykket relaterer den aktuelle parateksten/signalet til en vurderingsfunksjon. Krever én eller flere `evidence_observation_ids`. **NB**: koblingen til en av de fire *analytisk utledede* vurderingsmomentene innebærer en transparent forskerklassifisering. Betegnelsen betyr ikke direkte utsagn fra intervjuets ordrette transkripsjon.
2. `analytical`: forbindelse utviklet fra forskerens opprinnelige matrise og/eller PDF-memoenes sammenstilling. Krever `memo_ids` eller `matrix_cell_ids` og er ikke automatisk knyttet til én informant.
3. `exploratory`: forslag til mulig forbindelse som ikke er verifisert som funn. Har status `hypothesis_not_validated`. **Ikke bruk disse i empirisk prosent, styrke eller konklusjon.** Av som standard.

Alle brytere kan stå på eller av samtidig, uavhengig. Uten aktivt nivå må figurer som baseres på relasjoner vise tomtilstand. En paratekst–vurderingsmoment-kobling kan finnes i flere nivåer; ved sammenslåing må alle aktive relasjonsposter og deres egne kilder fortsatt være tilgjengelige.

## 3. Egen akse for opprinnelig analysematrise
`data/original_matrix.json` gir status for 7 rader × 4 momenter: `clear` (fylt prikk), `possible` (åpen sirkel), `none` (tom celle). Dette er **status fra tidligere analytisk matrise**, IKKE en egen empirisk frekvens og IKKE samme variabel som relasjonens `tier`. Matrisen er lagret fullstendig og genererer egne analytiske relasjonsposter for 25 ikke-tomme celler. De 3 tomme cellene er bare *uten registrert kobling*, ikke påvist umulighet. `P_ACTIVITY` representerer en signalklynge på tvers av flater, selv om denne står som en rad i matrisen.

## 4. Telleretningslinjer
Tillatte størrelser:
- `n_codebook_entries`: antall registrerte kodebokposter per definert kategori, ikke reelle frekvenser i intervjuer.
- `n_unique_codebook_texts`: distinkte kombinasjoner `informant` og `text_normalized`; identiske gjentakelser skal ikke dobbelttelles.
- `n_primary_informants`: antall forskjellige A–E som **har dokumenterte utsagn knyttet til det aktuelle funnet**. Denne størrelsen er **ukjent/null** for rene memo/matrise-relasjoner uten entydig kildeinformant, ikke 0.
- `n_paratexts_in_combination`: antall av de 7 opprinnelige matrisradene med samme tilhørighetsmønster i et aktivt nivåvalg. `P_ACTIVITY` må merkes som signalrad ved behov.

Ikke tillatt uten ny forskning: «hvor viktig», prosent representativt for spillformidlere generelt, korrelasjon på informantnivå, kausaliteter, sannsynlighet for omtale, 0.5-styrke for mulig kobling, universell beslutningsrekkefølge.

## 5. Variasjon og negative case
`stances.json` gir en **manuelt utvalgt**, ikke uttømmende samling av konkrete holdninger. `comparison_matrix.json` gir A–E × 10 utvalgte temaer, med `not_coded_in_this_comparison` der denne første registreringsrunden ikke har et eksplisitt standpunkt. Det betyr *ikke* at informanten var taus i intervjuet eller ikke mener noe. «Negativt signal» i en uttalelse betyr heller ikke automatisk et negativt case; negative case er nyanser eller motsetninger mellom analytiske forventninger og enkeltaktører.

Eksempler som må kunne synliggjøres med kildevisning:
- A og E vurderer generativ AI negativt, mens B ikke gjør det til universelt rødt flagg.
- B oppfatter ikke manglende trailer som et avgjørende diskvalifiserende forhold.
- C ønsker skreddersydd kommunikasjon, E krever ikke personlig e-post.
- E kan bruke sekundære uformelle kanaler for tidlige spill, men stiller andre krav til hovedplattformen.
- E bruker sjelden presskits, noe som nyanserer påstanden om at formelt kit er nødvendig.

## 6. Ikke-lineær vurdering
`process_model.json` er **en illustrativ syntese** fra memo 2–6, med alternative innganger, betingelser, returer og flere utfall. Det er ikke resultat av prosess-sporing av hvert enkelt intervju, har ingen overgangsfrekvenser og skal ikke tolkes som en lineær vurderingsalgoritme.

## 7. Akademiske rapporteringsregler
Skriv for eksempel: «Blant kodebokutsagnene er x knyttet til dette temaet», «Et dokumentert utsagn fra B viser ...» eller «Den analytiske matrisen klassifiserer dette som mulig». Unngå: «X prosent av spillformidlere mener», «Dette beviser», «Mest sentralt fordi flest forbindelser», «80 prosent sjanse for omtale». Kodekategori, analytisk moment og faktisk paratekstflate er ulike nivåer og må ikke slås sammen uten eksplisitt begrunnelse.

## 8. Transparente svakheter i første leveranse
- Direkte relasjoner er en **konservativt håndkurert delmengde**, ikke en fullstendig manuell annotering av alle 227 kodeboknotater.
- `keyword_matched_concept_ids` er bare tekstsøksforslag og skal ikke oppgraderes til dokumenterte lenker automatisk.
- Enkelte originalformuleringer har strukturelle feil og forfatterkommentarer; `flags` og `review_status` synliggjør dem.
- Faktiske Cosmic Anchor-designvalg er ikke dokumentert i de tilgjengelige kildene; de står derfor `null`.
- «Søkbare» og «erfaringsbaserte» egenskaper er analytiske begreper fra analysen, ikke kodet observasjonstelling fra primærintervjuene.

Ikke fjern disse metodiske begrensningene i ferdige grafer eller eksportfiler.


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
