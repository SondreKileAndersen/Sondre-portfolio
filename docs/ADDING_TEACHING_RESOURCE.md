# Legge til undervisningsopplegg

Undervisningsopplegg vises nederst på Pedagogikk-siden. Hvert opplegg ligger i
sin egen `.ts`-fil. Systemet finner automatisk alle ressursdokumenter i
hovedmappen og alle undermapper.

Du skal ikke registrere opplegget i en sentral importliste.

## 1. Kopier template-filen

Kopier:

```txt
frontend/src/data/teachingResources/no/TEMPLATE.resource.ts
```

Plasser kopien i ønsket kategori eller undermappe, og gi den et beskrivende
`.ts`-navn:

```txt
frontend/src/data/teachingResources/no/
  TEMPLATE.resource.ts
  film/
    grunnleggende-kamerabruk.ts
    premiere-pro/
      fargekorrigering.ts
  grafisk-design/
    influenser-effekten.ts
```

Den første mappen under `no/` bestemmer hvilken kategori kortet vises under.
Flytter du oppleggsmappen mellom kategorimappene, flyttes kortet automatisk.

`TEMPLATE.resource.ts` blir eksplisitt ignorert og vises aldri på nettsiden.

## 2. Lagre tilhørende filer

Gi hvert opplegg en egen mediemappe med samme ID:

```txt
frontend/src/media/pedagogikk/undervisningsopplegg/
  fargekorrigering-premiere/
    thumbnail.jpg
    presentasjon.pptx
    oppgave.pdf
    premiere-pro.svg
```

Thumbnail, PDF, PowerPoint og verktøylogoer til samme opplegg skal ligge sammen.

## 3. Fyll ut kopien

Importer filene øverst i ressursdokumentet:

```ts
import thumbnail from '../../../../media/pedagogikk/undervisningsopplegg/fargekorrigering-premiere/thumbnail.jpg'
import presentationFile from './presentasjon.pptx?url'
import assignmentFile from './oppgave.pdf?url'
import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
```

Bruk alltid de faste `@teaching-resources`-importene. De fungerer uavhengig av
hvor dypt ressursdokumentet ligger i mappestrukturen.

`?url` gjør PDF-, PowerPoint- og andre nedlastbare filer til en URL som kortet
kan åpne. Bilder og SVG-logoer importeres uten `?url`.

Fyll deretter ut objektet:

```ts
export default defineTeachingResource({
  id: 'fargekorrigering-premiere',
  title: 'Fargekorrigering i Premiere Pro',
  description: 'Kort forklaring av mål, nivå og innhold.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Fargehjul og videoklipp i Premiere Pro',
  tools: [teachingTools.premierePro],
  files: [
    { id: 'presentation', label: 'Presentasjon', url: presentationFile },
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
```

Når filen lagres, blir opplegget automatisk hentet inn av Vite og vist under
riktig kategori. Det er ikke nødvendig å endre `index.ts` eller Pedagogikk-siden.

## Felt

- `id`: Stabil og unik ID. Skal ikke oversettes eller endres senere.
- Kategori lagres ikke i oppleggsfilen. Den utledes fra kategorimappen.
- `title`: Synlig tittel.
- `description`: Kort beskrivelse, helst én til to setninger.
- `format`: Teknisk filformat: `pdf`, `video`, `presentation` eller `other`.
- `typeLabel`: Synlig type øverst på kortet, for eksempel `Presentasjon`,
  `Oppgave` eller `Veiledning`.
- `thumbnailSrc` og `thumbnailAlt`: Kortets bilde og tilgjengelig beskrivelse.
- `tools`: Ett eller flere verktøy. Logo er valgfri; navnet vises hvis logo mangler.
- `files`: Filer og lenker som tilhører opplegget. Hver fil trenger stabil `id`,
  synlig `label` og `url`. Bruk `download: true` for filer som primært skal
  lastes ned. Ett element åpnes direkte fra kortet; flere elementer vises i en
  filvelger. Kort med tom eller manglende liste er ikke klikkbart.
- `resourceUrl`: Eldre enkeltfilfelt som fortsatt støttes. Nye og oppdaterte
  opplegg skal bruke `files`.

## Ny kategori

Kategorier er den eneste sentrale listen. Legg en ny kategori én gang i:

```txt
frontend/src/data/teachingResources/no/index.ts
```

Eksempel:

```ts
{ id: 'animation', folder: 'animasjon', title: 'Animasjon' }
```

Kategorier uten opplegg skjules automatisk.

## Verktøy og logoer

Verktøy defineres ett sted:

```txt
frontend/src/data/teachingResources/no/toolCatalog.ts
```

Ressursdokumenter skal bare referere til katalogen:

```ts
tools: [teachingTools.illustrator, teachingTools.figma]
```

Logoen kan være en lokal import eller en direkte HTTPS-adresse. Ved ekstern logo
bør `sourceUrl` peke til siden som beskriver filen og lisensen:

```ts
figma: {
  id: 'figma',
  name: 'Figma',
  logoSrc:
    'https://commons.wikimedia.org/wiki/Special:Redirect/file/Figma-logo.svg',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Figma-logo.svg',
}
```

Wikimedia Commons-logoer kan være varemerkebeskyttet selv om bildefilen kan
brukes. Kontroller alltid informasjonen på `sourceUrl`. Hvis en ekstern logo
ikke kan lastes, viser kortet automatisk verktøynavnet i stedet.
