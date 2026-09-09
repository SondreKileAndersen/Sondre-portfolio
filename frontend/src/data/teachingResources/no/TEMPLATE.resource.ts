import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'

// Kopier denne filen til ønsket kategori-/undermappe og gi den et unikt navn
// for eksempel `film/fargekorrigering-premiere.ts`.
//
// Importer deretter filene som tilhører opplegget:
// import thumbnail from '../../../../media/pedagogikk/undervisningsopplegg/oppleggets-id/thumbnail.jpg'
// import presentationFile from './presentasjon.pptx?url'
// import assignmentFile from './oppgave.pdf?url'
// Verktøynavn, nettadresser til logoer og kildesider ligger i `toolCatalog.ts`.

export default defineTeachingResource({
  id: 'erstatt-med-unik-id',
  title: 'Tittel på undervisningsopplegget',
  description: 'Kort beskrivelse av hva opplegget lærer bort.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: '/erstatt-med-importert-thumbnail',
  thumbnailAlt: 'Beskriv hva thumbnail-bildet viser',
  tools: [teachingTools.premierePro],
  files: [
    // { id: 'presentation', label: 'Presentasjon', url: presentationFile },
    // { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
