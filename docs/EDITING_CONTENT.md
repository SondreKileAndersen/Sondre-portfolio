# Finn og rediger innhold

Hver portfolioside har en mappe under `frontend/src/data/pages/`:

```txt
ressurskoordinering/
  structure.ts   Felles struktur, rekkefølge, komponentvalg, bilder og ikoner
  no.ts          Norsk tekst
  en.ts          Engelsk tekst (foreløpig en tom oversettelseskladd)
```

Endre struktur én gang, uansett språk. Endre norsk tekst i `no.ts`, engelsk i
`en.ts`. Språkfilene inneholder ikke seksjonsobjekter eller komponentvalg.
Engelsk er ikke aktivert ennå; eksisterende norsk innhold er bevart.

## Eksempel: OsloMet-kortet

Åpne `frontend/src/data/pages/ressurskoordinering/no.ts` og finn:

```ts
"sections.resource-coordination-institutions.cards.oslomet-experience.role":
  "Høyskolelærer · Ressurskoordinering"
```

Endre teksten til høyre. Nøkkelen til venstre kobler teksten til riktig felt
i den felles strukturen, og skal ikke endres bare fordi teksten endres.

Vil du bytte rekkefølge på OsloMet og Kuben, flytter du kortobjektene i
`structure.ts`. Språkfilene trenger ikke endres; nøklene følger stabile ID-er.

## Hva redigeres hvor?

| Endring | Fil eller mappe |
| --- | --- |
| Norsk sidetekst, menynavn, alt-tekst eller URL | `data/pages/<side>/no.ts` |
| Engelsk sidetekst | `data/pages/<side>/en.ts` |
| Seksjonsrekkefølge, bilder, ikoner og komponentvalg | `data/pages/<side>/structure.ts` |
| Oppsettet til en gjenbrukbar seksjon | `components/blocks/` |
| Farger, avstander, skriftstørrelser og innholdsbredde | `styles.css` |
| Logobåndets interaksjon | `components/blocks/LogoMarqueeBlock.tsx` |
| Små ikoner og gallerikontroller | `components/ui/` |
| Header og navigasjon | `components/layout/` |
| Felles UI-tekster som «Lukk» | `i18n/locales/no.ts` |
| Undervisningsopplegg | `data/teachingResources/no/` |
| Sideregistrering og sammensetting av språk | `data/pages/index.ts` |

Alle stiene i tabellen er relative til `frontend/src/`.

## Slik finner du frem

1. Bruk `Ctrl + Shift + F` i VS Code og søk etter teksten du ser på nettsiden.
2. Bruk `Ctrl + P` og skriv eksempelvis `ressurskoordinering/no.ts`.
3. For utseende: finn CSS-klassen gjennom Inspect i nettleseren, og søk etter den.

Når utviklingsserveren kjører, får tekstene automatisk `data-content-file` og
`data-content-key` i Inspect. Kopier filstien, åpne den med `Ctrl + P`, og søk
etter nøkkelen med `Ctrl + F`. Dette krever ingen manuell merking i innholdsfilene.
Et bilde får i tillegg `data-structure-file` og `data-structure-key`. Disse viser
henholdsvis hvilken `structure.ts` som velger bildefilen, og nøyaktig hvilket
felt bildet brukes i. `data-content-*` på det samme bildeelementet viser kilden
til den oversettbare alt-teksten, ikke til selve bildefilen.
Hvis identisk tekst har flere mulige kilder i samme seksjon, vises kandidatene
separert med ` | ` i stedet for å velge en vilkårlig kilde. Delte prosjekttekster
spores til den opprinnelige språkfilen. Sporingen gjelder sidetekst fra de nye
språkfilene, ikke separate undervisningsdokumenter eller felles i18n-tekster.
Kildeattributtene legges ikke til i produksjonsversjonen.

Innholdet går gjennom denne kjeden:

```txt
structure.ts + valgt språkfil
→ pageContent.ts
→ ferdige side-/seksjonsobjekter
→ App og SectionRenderer
→ gjenbrukbar blokk
→ JSX, stylet av styles.css
```

## Prosjektsider

Prosjektsidene har også egne mapper, for eksempel `lydstudio-for-undervisning/`.
Deres struktur inneholder `sourcePageId` og `sourceSectionId`, og tekstfilen
inneholder prosjekttittel, introduksjon, URL og metadata. Lang beskrivelse og
bilder gjenbrukes fra den tilkoblede oversiktsseksjonen. Dermed trenger ikke
samme bilde eller prosjektbeskrivelse vedlikeholdes to steder.

## Nye eller endrede tekstfelt

Startfargen velges øverst i hver sides `structure.ts`:

```ts
export const structure = {
  startTone: 'light', // Bytt til 'dark' for å starte mørkt.
  // resten av siden …
}
```

Headeren bruker samme startfarge, med tilpasset tekstfarge og undermeny.
Alle etterfølgende seksjoner veksler automatisk. Dette gjelder også prosjektsider.
Innstillingen er felles for alle språk og skal ikke legges i språkfilene.

Bruk `text('en.stabil.nøkkel')` for en tekst og `paragraphs('en.stabil.nøkkel')`
for en liste med tekster i strukturen. Legg samme nøkkel i språkfilene.
`PageContent` utledes fra strukturen og kontrollerer hvilke felt som kreves.
Ikke bruk plasseringen i en liste som nøkkel; bruk elementets stabile ID.

Når engelskoversettelsen er komplett, bruk `satisfies PageContent` i `en.ts`,
slik som i `no.ts`. `Partial<PageContent>` er bare for uferdig oversettelsesarbeid.
Se `CONTENT_ARCHITECTURE.md` før engelsk aktiveres.

## Kontroller endringen

Kjør fra `frontend/`:

```powershell
npm.cmd run test:content
npm.cmd run build
```

`dist/` og `node_modules/` er genererte filer, ikke steder du skal redigere innhold.
