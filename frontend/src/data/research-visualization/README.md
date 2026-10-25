# Kvalitativt datagrunnlag for en interaktiv masteroppgave-visualisering

Dette er en **Codex-klar prosjektpakke**, ikke en ferdig nettside. Den inneholder en kildebasert datamodell, maskinlesbare tabeller, gjenkjørbar generering, valideringskode og en oppgavebeskrivelse for Codex.

## Start her

1. Pakk ut hele ZIP-filen som én mappe, og åpne mappen som prosjekt/arbeidsområde i Codex. I eksisterende kodeprosjekt: integrer innholdet uten å overskrive eksisterende `AGENTS.md` (slå sammen relevante regler).
2. Send innholdet i `CODEX_TASK.md` som oppgave til Codex, eller skriv: **«Les AGENTS.md, CODEX_TASK.md, docs/METHOD.md og docs/DATA_DICTIONARY.md. Implementer nettsiden etter denne spesifikasjonen, med data/*.json som eneste datakilde. Valider før du leverer.»**
3. Be Codex starte utviklingsserver og åpne forhåndsvisning. Behold `sources/` sammen med `data/` for kildekontroll.

Hvis Codex-miljøet ikke kan hente inn ZIP direkte, pakk ut filene lokalt og åpne *mappen* i Codex. Å laste opp bare PDF-en er **ikke nok**; inkluder data, dokumentasjon og instruksjoner.

## Datainnhold

- 227 registrerte kodebokutsagn fra original-PDF (ikke 227 intervjuutsagn i fulltekst).
- 216 distinkte `informant + normalisert kodeboktekst`-kombinasjoner, der 11 registreringer er ordrett gjentatt.
- 38 konservativt valgte direkte relasjonsposter; **ikke fullstendig annotering av alle mulige direkte relasjoner**.
- 41 analytiske relasjonsposter (fra opprinnelig matrise og memoer).
- 6 **uverifiserte utforskende hypoteser**, av som standard.
- Opprinnelig analytisk matrise: 7 rader x 4 vurderingsmomenter, med status tydelig / mulig / ikke registrert.
- 20 manuelt annoterte standpunkter og 50 informant×tema-celler for en **selektiv** sammenligning.
- Forgrenet illustrativ prosessmodell, *ikke en dokumentert fast rekkefølge*.

Sjekk `data/quality_report.json` for maskinverifiserte opptellinger.

## Pakkeoversikt

```text
AGENTS.md             Korte varige Codex-regler
CODEX_TASK.md         Akseptansekriterier og implementasjonsplan
README.md             Denne filen
START_PROMPT.txt      Kort tekst til å lime i Codex
data/
  manifest.json       Telle- og proveniensregler
  observations.json   Kodebokutsagn med kilde, sider og flagg
  concepts.json       Vurderingsmomenter, paratekster, signaler
  relations.json      Direkte / analytisk / utforskende forbindelser
  original_matrix.json Opprinnelig forskermatrise (28 celler)
  informants.json     A–E og ekspert Z
  contexts.json       Definerte kontekstverdier
  memos.json          Seks memoer + samlet analytisk mønster
  stances.json        Selektiv manuelt annotert variation/avvik
  comparison_matrix.json Selektiv A–E x 10-tema matrise
  section_counts.json Telling av kodetekster per informant og seksjon
  process_model.json  Mulige, ikke-universelle vurderingsveier
  design_traceability.json Mulige designimplikasjoner (ikke faktiske Cosmic Anchor-valg)
  quality_report.json Etterprøvbare dataopptellinger
  *.csv               Eksporter for inspeksjon og gjenbruk
sources/
  Vedlegg for kodebok og koder.pdf  Kilde
  kapittel_5_analyse.md            Del av brukerens analyserte mastertekst
  original_paratekst_matrix.png    Brukerens opprinnelige matrise
scripts/
  build_dataset.py   Bygger alle JSON/CSV fra kilden + eksplisitte analysebeslutninger
  validate_dataset.py Tester koblinger, referanser og metodesperrer
  demo_derive_views.py Eksempel: samme relasjoner => både nettverk og UpSet
docs/
  METHOD.md, DATA_DICTIONARY.md, FIGURES.md, QA.md
```

## Viktige presiseringer

**Evidensgradering og matrisesymboler er forskjellige akser.** Analytisk-matrisen bruker `clear`, `possible`, `none`; relasjonene bruker `direct`, `analytical`, `exploratory`. Et tydelig punkt i forskerens matrise er fortsatt en **analytisk klassifisering**, selv om en separat direkte relasjon kan dokumentere den samme forbindelsen.

**Korpusets avgrensning:** Den mest detaljerte tilgjengelige kilden er en kodebok der intervjuutsagn allerede er oppsummert/parafrasert. Frekvensene er antall registrerte **kodeboknotater**, ikke antall uavhengige intervjuhendelser eller styrken av en vurdering. Den originale PDF-en har fem oppføringer markert for mulig ekstraksjons-/tolkningskontroll, og dette flagget skal fremgå i kildevisningen.

**Status:** Datapakken er validert programmatisk, men den analytiske klassifiseringen er et kvalifisert utgangspunkt som forskeren bør kunne overprøve. Ingen hypoteser er presentert som validerte forskningsfunn.

## Tekniske kontroller

```bash
python scripts/validate_dataset.py
python scripts/demo_derive_views.py direct analytical
python scripts/demo_derive_views.py direct
python scripts/demo_derive_views.py analytical exploratory
```


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
