import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Spillutvikling MVP Oppgave.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'game-development-mvp-assignment',
  title: 'Spillutvikling – MVP og prosjektbeskrivelse',
  description: 'Elevene lager en analog prototype som visualiserer spillet og spillmekanismene, før de utarbeider en prosjektbeskrivelse. Beskrivelsen skal blant annet dekke roller, sjanger, målgruppe, spillmekanismer, interaksjoner og innpakning.',
  format: 'presentation',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Et gamingoppsett med RGB-belyst tastatur, hodetelefoner, mus og spillkontroller på et mørkt skrivebord',
  tools: [teachingTools.powerPoint],
  files: [
    { id: 'presentation', label: 'Oppgavepresentasjon', url: presentationFile },
  ],
})
