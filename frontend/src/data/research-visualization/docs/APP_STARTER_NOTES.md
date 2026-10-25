# Codex: forslag til frontendstruktur (ikke bindende)

Dette er **ikke** et krav om ny frontend-arkitektur dersom brukeren allerede har en app. I et tomt Vite/React-prosjekt kan en ryddig struktur være:

```text
src/
  data/load.ts              -> importer data/*.json og definer typings
  data/selectors.ts         -> eneste kilde for filtrering og aggregering
  state/filters.ts          -> direkte/analytisk/utforskende, informant, status, kontekst
  components/SourcePanel.tsx -> vis kodeboktekster, PDF-sider, memo og flags
  views/AssessmentMoments.tsx
  views/ParatextNetwork.tsx
  views/UpSet.tsx
  views/RelationMatrix.tsx
  views/InformantComparison.tsx
  views/PossiblePathways.tsx
  views/SearchExperience.tsx
  views/CosmicAnchorTrace.tsx
  App.tsx
```

## Viktig selector-design

Bruk en enkelt funksjon som leverer `visibleRelationRecords` fra `relations.json` basert på aktive nivåer. Deretter bygg en `projectedEdgesByPair` ved å gruppere *med proveniensbevaring*. Nettverk, UpSet og generert matrise må bruke de samme `projectedEdgesByPair` (matrise i «opprinnelig» modus er et unntak og viser `original_matrix.json` som historisk kilde).

Ved valg av A må globale analytiske relasjoner merkes eller skjules; datamodellen inneholder ikke full tverrfaglig person-proveniens for matrisen. Gi eksplisitt valg «Vis tverrgående forskertolkning» og hold dette atskilt fra direkte evidens fra A.

Unngå å vise for eksempel `n=0 informanter støtter` på en matriserelasjon uten `evidence_observation_ids`: dette er **ukjent**, ikke null funn. Bruk `ikke målt`.

## Biblioteker

Bruk bibliotekvalg som passer eksisterende kodebase. Et standardoppsett kan være React + TypeScript, SVG-baserte D3-layouts for graf/UpSet og et node-edge bibliotek for prosess. Ingen ny database, server, autentisering eller ekstern API er nødvendig for første versjon; hele datasettet kan leses lokalt som statiske JSON-ressurser.
