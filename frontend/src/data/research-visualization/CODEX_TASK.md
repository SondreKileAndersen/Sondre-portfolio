# Codex-oppgave: bygg en interaktiv visualisering av kvalitative masterdata

## Mål
Lag en oversiktlig, norsk, interaktiv forskningsvisualisering som lar brukeren undersøke de fire vurderingsmomentene, paratekst-relasjoner, variasjon mellom informanter og mulige forløp fra kontakt til omtale. Bruk **eksisterende JSON-filer i data/**; ikke rekonstruer eller dikt opp data ved å lese PDF-teksten på egen hånd.

## Arbeidsmåte
- Les `AGENTS.md` og relevant dokumentasjon. Kontroller `data/manifest.json`, `docs/METHOD.md` og `docs/DATA_DICTIONARY.md` før du bygger diagrammer.
- Hvis dette er en tom mappe: initialiser en lett React + TypeScript + Vite-app (f.eks. D3 for nettverk, UpSet og chord; React Flow eller tilsvarende for prosess). Hvis du er i en eksisterende app: bruk dens arkitektur og unngå konflikt.
- Lag dataadaptere som **deriverer** nettverk, UpSet, sammenligning og prosess fra de kanoniske JSON-filene. Ingen manuelle eller hardkodede tall i figurkomponentene.
- Gi prototypen et sammenhengende design med god typografi, mobiltilpasning, tastaturnavigering og tydelig tilgjengelighetsmerking. Vis metodeinfo i grensesnittet, ikke bare dokumentasjonen.

## Obligatoriske felles filtre
- [ ] Tre **uavhengige** brytere: **Direkte dokumenterte**, **Analytisk utledede**, **Utforskende hypoteser**. Default: på / på / av.
- [ ] Av/på i enhver kombinasjon virker, også alle av (tomtilstand). Å slå av ett nivå fjerner bare dette nivåets bidrag, med mindre en edge også er dokumentert i et annet aktivt nivå.
- [ ] Separate valg for analytisk matrisestatus `clear` og `possible` ved visning av matrisen/den matrisebaserte delmengden. `none` er manglende registrering, ikke negativ dokumentasjon.
- [ ] Filter for A–E; Z vises bare hvis ekspertperspektiv er eksplisitt aktivert. `Samlet` er forskerantakelse og aldri informant.
- [ ] Kildepanel når node, celle, linje eller standpunkt velges: relasjonstype, kodeboktekst, informant, faktisk PDF-side, memo/celle, eventuelle kvalitetsflagg og skille mellom støtte og kvalifikasjon.
- [ ] Kontekst- og publiseringsformatfiltre bare når data har faktisk annotering; vis ellers "ikke klassifisert" i stedet for å fylle inn.
- [ ] På informantnivå må tverrinformant-memoer og originalmatrise ikke presenteres som vedkommendes utsagn. Skjul slike forbindelser som standard når et individ er valgt, med egen valgfri «Vis tverrgående analytisk modell».

## Diagrammene (prioritert)
### 1. Fire vurderingsmomenter — konseptuelt hovedfunn
En lettfattelig graf med fire klart navngitte vurderingsmomenter og beskrivelser fra `concepts.json`. Vis mulige forbindelser som analytiske, uten vekt/areal som signaliserer empirisk viktighet. Plasser denne modellen først, med tydelig merking «Konseptuell modell — ikke målt betydning eller rangering».

### 2. Paratekster og vurderingsmomenter — nettverk + UpSet + matrise
Bruk de **samme aktive relasjonsradene** i `relations.json` for nettverk og UpSet. La brukeren velge nettverk/UpSet/matrise uten at data eller filtervalg endres. Dette skal være en *typed bipartite projection* med paratekstrader P_* og momenter M_*. Når flere relasjonsrader støtter samme par, samle dem i én visuell kobling med klikkbar liste over hver provenance; ikke summér styrke automatisk. `P_ACTIVITY` er definert som signalklynge, ikke en identisk type paratekst som Steam-side. Ved visning av originalmatrix kan dens egne `clear`, `possible`, `none` gjengis nøyaktig.

### 3. Variasjon mellom spillformidlere
Bruk `stances.json`, `comparison_matrix.json` og kildeobservasjonene. Temaer per rad, A–E som kolonner. Vis eksplisitt *standpunkt*, *unntak/forbehold* og *ikke kodet*. Ikke oppgi "uenighet" når det bare mangler kodet utsagn. Mulighet for kildedetaljer per celle. Suppler gjerne med deskriptive tellevisninger fra `section_counts.json`, merket **kodebokutsagn, ikke betydning**.

### 4. Fra første kontakt til mulig omtale
Bruk `process_model.json` til et forgrenet diagram med alternative innganger, vurderinger, sløyfer og mulige utfall (omtale, vent, ingen omtale, alternativ kanal). Merking: **Illustrativ analytisk modell; ingen universell fast rekkefølge**. Som analytisk-only diagram skal det vise informativ tomtilstand når analytisk er slått av. Ikke finn opp overgangssannsynligheter.

### 5. Søkbare vs erfaringsbaserte egenskaper (sekundær)
Vis konseptene `S_SEARCH` og `S_EXPERIENCE` og de relasjonene som faktisk finnes (inkl. at trailer kan *signalisere*, ikke måle spillopplevelse). Vær tydelig på at begrepene er analytiske, ikke direkte intervjutelling.

### 6. Analyse til Cosmic Anchor (sekundær)
Vis `design_traceability.json` som en redigerbar sporbarhetsmatrise. Faktiske designvalg er **ikke dokumentert** i dette materialet; `cosmic_anchor_actual_design_choice=null` vises som «Ikke verifisert / må fylles inn», aldri fylles med oppdiktede beslutninger.

## Databeregninger
- Filtrer `relations` etter `tier` med **uavhengige boolske brytere**. Bruk samme filtrerte samling til både graf og UpSet. Det er forskjell på denne filtreringen og `original_matrix`-statusfiltrering.
- For kant mellom paratekst og moment: grupper på `(source_id,target_id)` etter filter. Vis aktive nivåer hver for seg, og samlet kildegrunnlag på klikk.
- `distinct_primary_informants = count(distinct informant in A–E across provenance observations)`; hvis ingen observasjonskilder fordi en forbindelse bare er analytisk, skal verdien være **null/ikke målt**, ikke 0.
- `codebook_entries` er rå forekomster. `deduplicated_note_count` bruker `informant+text_normalized`. Ikke bruk antall notater som tall for effekt/styrke/årsaksforhold.
- UpSet-medlemskap: for hver av 7 opprinnelige paratekstrader finn hvilke av de 4 momentene som har minst én **aktiv** relasjon; grupper rader etter settet av momenter. Mulig indirekte relasjon i matrise er fortsatt analytisk, aldri 0.5 styrke.
- Eksplorative relasjoner skal i graf tydelig merkes «Ubekreftet hypotese», være av som standard og aldri inngå i tall merket empirisk funn.
- Kildeobervasjoner kan vises ordrett **som kodebokens parafraser**, ikke som direkte sitater fra intervjuene.

## Interaktivitet / UX
- Bevar valg av filtre når en bruker bytter visualisering.
- Hver figur har forklaring på hva den viser / ikke viser; tegnforklaring og tomtilstand.
- Lag tydelig kildeinspektør; tastaturtilgjengelige kontroller; mobilvisning med sideveis rulling der tetthet krever det.
- Tillat eksport av aktivt filterutvalg til CSV/JSON og grafikk til SVG/PNG der det er praktisk. Ved eksport inkluderes hvilke brytere som var aktive og telleenhet.
- Ikke la flatekjøring, visuelle tilfeldighetslayout eller sentralitetsmål fremstille rangering som ikke finnes i dataene.

## Akseptansetest
1. `python scripts/validate_dataset.py` passerer.
2. Alle 8 kombinasjoner av tre nivåbrytere gir riktig antall valgte relasjonsposter og tydelig tomtilstand når ingen er aktive.
3. Direkte-only viser aldri analytisk-only fra originalmatrisen, og analytisk-only viser ikke direkte-only kodebokrelasjoner.
4. Hypotese-only merkes tydelig uten å gi empiri-kvantifisering.
5. Originalmatrisen viser alle 28 celler og riktig `clear` / `possible` / `none`.
6. UpSet og nettverk deler *samme* kildeadapter, filtre og medlemskapslogikk.
7. Ekspert Z er ute av A–E-tellere som standard; A–E skiller mellom ingen data og dokumentert uenighet.
8. En valgt relasjon kan spores til PDF-side, memo eller opprinnelig analysematrise. Flaggete uttrekk vises som usikre.
9. Prosessdiagrammet angis uttrykkelig som ikke-lineært og illustrativt.
10. Dokumenter hvilke direkte relasjoner som fortsatt kan ha behov for manuell koding: bare en kuratert delmengde er opprettet i første versjon.

## Ferdigstilling
Rapporter hvilke filer du opprettet/endret, hvordan du startet appen, hvilke tester som faktisk ble kjørt, og eventuelle uløste metodiske begrensninger. Ikke presenter implementasjonen som publiseringsklar før du har sjekket visningene mot kilde-PDF.
