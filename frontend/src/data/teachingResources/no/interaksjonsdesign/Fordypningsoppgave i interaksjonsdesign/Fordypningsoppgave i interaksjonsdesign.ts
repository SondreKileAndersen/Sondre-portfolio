import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Fordypningsoppgave i interaksjonsdesign.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'interaction-design-specialization-assignment',
  title: 'Fordypningsoppgave i interaksjonsdesign',
  description: 'Oppgave i design og kommunikasjon i digitale medier der eleven skal lage en høynivå-prototype av et digitalt interaktivt produkt og drøfte utviklingsprosessen i en skriftlig teoretisk del.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Forside av oppgaveark med tittelen «Fordypningsoppgave i interaksjonsdesign», med mørk blå topp, to felt for praktisk del og skriftlig teoretisk del, og teksten «Oppgavebeskrivelse» under.',
  tools: [teachingTools.figma],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
