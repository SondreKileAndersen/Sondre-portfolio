import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Fagfelt og fagbegreper.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'prepare-for-yff-subject-discussions',
  title: 'Forberedelse til fagsamtaler',
  description: 'En oppgave der eleven definerer hvilke fagområder som skal vektlegges i YFF-vurderingen og lager en liste med ti relevante fagbegreper. Opplegget viser også hvordan ChatGPT kan brukes til å finne og utforske begrepene.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Lys presentasjonsslide med tittelen «Oppgave – forberedelse til fagsamtaler», en blå instruksjonsboks og to nummererte oppgaver om fagområder og fagbegreper.',
  tools: [teachingTools.powerPoint],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
