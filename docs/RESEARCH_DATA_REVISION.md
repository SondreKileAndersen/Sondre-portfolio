# Koblingsdata: revisjon 2026-10-21

Revisjonen følger begge brukervedleggene og den vedlagte datamatrisen.
Bildet er brukt som datafasit, ikke som designforslag. Eksisterende utseende,
linjer, overskrifter, farger og interaksjoner er beholdt.

## Gjeldende data

- `frontend/src/data/research-visualization/data/analysis_matrix.json` er den
  aktive klassifiseringen. Den har 28 celler: 11 `clear`, 9 `possible`, 8 `none`.
- `data/matrix_revision.json` inneholder de ti eksplisitte endringsbeslutningene
  og de reviderte definisjonene.
- Begrunnelser for alle 28 celler og forbehold om synlig aktivitet følger med
  hver celle og vises i kildepanelet. Vedleggene er bevart ordrett som
  `sources/review_matrix_2026-10-21.md` og `sources/review_method_2026-10-21.md`.
- Den opprinnelige `original_matrix.json`, PDF-en, matrisebildet og kodebokens
  observasjoner er uendret. Historiske relasjoner og kontrollsummer er bevart
  som `sources/relations_v1.json` og `sources/SHA256SUMS.v1.txt`.

| Paratekst | Vurderingsmoment | Før | Etter |
|---|---|---|---|
| Pressepakke | Formidlingsrammer | Mulig | Ikke tilstrekkelig begrunnet |
| Utviklerside | Prosjektgrunnlag | Mulig | Ikke tilstrekkelig begrunnet |
| Synlig aktivitet | Prosjektgrunnlag | Tydelig | Indirekte/betinget |
| Pressepakke | Prosjektgrunnlag | Tydelig | Indirekte/betinget |
| Trailer | Utviklergrunnlag | Mulig | Ikke tilstrekkelig begrunnet |
| Steam-side | Utviklergrunnlag | Tydelig | Indirekte/betinget |
| Prosjektnettside | Utviklergrunnlag | Tydelig | Indirekte/betinget |
| Pressepakke | Utviklergrunnlag | Mulig | Ikke tilstrekkelig begrunnet |
| Prosjektnettside | Pressemateriale | Tydelig | Indirekte/betinget |
| Synlig aktivitet | Pressemateriale | Mulig | Ikke tilstrekkelig begrunnet |

## Relasjoner og historikk

Ingen observasjoner eller standpunkter er slettet eller skrevet om. De fem
parene som ikke lenger skal markeres, hadde åtte relasjonsposter på tvers av
evidensnivåene. Disse har `analysis_included: false` i `relations.json`; de
opprinnelige ID-ene og kildebeleggene er beholdt. Dette er en avgrensning av
gjeldende analytiske syntese, ikke en påstand om at råbeleggene er tilbakevist.

Dette gjelder også REL-0022, der OBS-0187 beholdes som historisk kildebelegg.
Det ville vært misvisende å beholde koblingen i nettverket etter at samme par
er tatt ut av den reviderte matrisen. Adapter, figurer og aktive eksporter bruker
derfor samme inkluderingsregel på alle tre uavhengige nivåer.

Aktive relasjoner: 37 direkte, 36 analytiske og 4 utforskende, totalt 77.
Alle 85 historiske poster er fortsatt tilgjengelige i datasettet. Sammenhørende
CSV-eksporter, manifest, kvalitetsrapport og kontrollsummer er regenerert.

## Metodikk

`clear` betyr tydelig begrunnet funksjon; `possible` betyr indirekte eller
betinget funksjon; `none` betyr ikke tilstrekkelig begrunnet i denne analysen.
Dette er ikke en skala for empirisk styrke eller hyppighet. En tom celle
utelukker ikke funksjonen i andre situasjoner. Synlig aktivitet er planlagt
eller delvis etablert, ikke fullt realisert i praksiscaset.

Gjennomgangens kapittelhenvisninger er ikke konvertert til antatte PDF-sider.
Kildepanelet viser selve begrunnelsen og lenker til gjennomgangen, mens det
historiske matrisebildet er tydelig merket som før revisjonen.

Metodevedlegget anbefaler å fjerne horisontale linjer. Dette er ikke utført,
fordi den eksplisitte oppgaven begrenser endringen til data. Tekstforklaringen
presiserer at markeringene ikke angir en fast rekkefølge.

## Regenerering og kontroll

Kjør `node scripts/apply_matrix_revision.cjs` fra datapakken. Skriptet er
idempotent og bruker originalmatrisen, de dokumenterte endringene og de
arkiverte relasjonene. `build_dataset.py` kjører dette trinnet etter sin
historiske ekstraksjon; en regenerering tilbakefører ikke klassifiseringen.

Fra `frontend/` er følgende kontrollert:

- `npm.cmd run test:research`: alle 28 statusene, ti endringer, kildeintegritet,
  fravær av utelatte par og alle åtte nivåvalg: 0, 37, 36, 73, 4, 41, 40, 77.
- Originale råkilder og den arkiverte relasjonsfilen er i tillegg sammenlignet
  med kontrollsummene fra versjon 1, ikke bare med den oppdaterte sjekksumlisten.
- Regenerering av revisjonen og gjentatt datatest bekrefter idempotens.
- `npm.cmd run test:content`, `npm.cmd run test:research:browser` og
  `npm.cmd run build` består. Nettleseren viser 11 fylte, 9 åpne og 8 tomme celler.
- `python scripts/validate_dataset.py` ble forsøkt, men maskinens Python-alias
  kan ikke kjøres. Skriptet er oppdatert; tilsvarende kontroller er kjørt med
  prosjektets Node-miljø. Full ny PDF-ekstraksjon er ikke kjørt.
