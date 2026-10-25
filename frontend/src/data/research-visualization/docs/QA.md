# Testplan og forskerens kontrollpunkter

## Maskinelle kontroller (leveransen)
```bash
python scripts/validate_dataset.py
for p in 'direct' 'analytical' 'exploratory' 'direct analytical' 'direct exploratory' 'analytical exploratory' 'direct analytical exploratory'; do python scripts/demo_derive_views.py $p > /dev/null || exit 1; done
```
Merk: Kall demoen uten tier-argumenter bruker defaults `direct analytical`; «alle av» må testes i selve frontendadapteren, siden demoprogrammet uten argumenter bevisst velger standardnivåene.

## Uavhengige brytere: forventet antall **relasjonsposter** (ikke antall grafkanter)
| Direkte | Analytisk | Utforskende | Poster |
|---|---|---|---:|
| av | av | av | 0 |
| på | av | av | 37 |
| av | på | av | 36 |
| av | av | på | 4 |
| på | på | av | 73 |
| på | av | på | 41 |
| av | på | på | 40 |
| på | på | på | 77 |

Tallene er en øyeblikkskontroll av **versjon 1** av pakken. Dersom datasettene senere utvides med nye kontrollerte relasjoner, må testene bruke oppdaterte fasiter.

## Forskerens faglige gjennomgang (anbefales før publisering)
1. Kontroller de fem `flags`-markerte PDF-uttakene manuelt.
2. Gå gjennom hver av de 38 direkte relasjonspostene mot kodeboktekst og momentdefinisjon; direct betyr eksplisitt signal-funksjon i *kodebokparafrase*, ikke direkte intervjuavskrift.
3. Kontroller at de 25 analytiske matrisekoblingene samsvarer med originalbildet.
4. Beslutt om de øvrige kodebokuttalelsene skal klassifiseres for flere direkte forbindelser. Eksisterende direct-lag er med hensikt *ikke uttømmende*.
5. Godkjenn standpunktene og marker nye negative case eksplisitt dersom sammenligningsmatrisen skal bli mer dekkende.
6. Vurder om seks hypoteser bør stå i UI som eksempler; de skal aldri bli satt til empirisk bekreftet uten nytt bellegg.
7. Gjennomgå prosesspilenes formulering: betingelser er mulige, ikke nødvendig fast rekkefølge.
8. Fyll bare inn faktiske Cosmic Anchor-designvalg når disse er kildeverifisert.

## UI-testtilfeller
- Ingen aktive nivåer -> tom relasjonsfigur uten krasj.
- Bare exploratory -> kun hypoteser og synlig ubekreftet-merke.
- Velg A -> vis A-kilder, ikke Z; skjul/skill global forskermatrise.
- Velg Z -> merk ekspert, ikke bland inn i A–E-telling.
- Slå av possible-matrise -> behold direkte evidence for samme par dersom direct er aktiv.
- Velg en relasjon med to kodenotater med identisk tekst -> ingen dobbelttelling av distinkt informant eller distinkt tekst.
- Klikk på PDF-side fra utsagn -> forventet trykt sidetall = PDF-side +96.
- Mindre skjerm -> figuren er navigerbar og kildepanelet lesbart.


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
