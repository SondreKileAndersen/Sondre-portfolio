import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
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
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQBWwbicK8u8RJW0oQQmUaqVAUQ7hyMKDWv_7zU1EY6gVec?e=WZWoNd',
  files: [
    { id: 'presentation', label: 'Oppgavepresentasjon', url: presentationFile },
  ],
})
