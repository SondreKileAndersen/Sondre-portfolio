import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Typografi.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'typography-font-selection',
  categoryId: 'graphic-design',
  title: 'Typografi og fontvalg',
  description: 'Presentasjon og oppgave om forskjellen mellom typografi og font, og om hvordan sans serif-, serif- og displayfonter skaper ulike uttrykk og assosiasjoner. Elevene diskuterer fontvalg og bruker research, verdier og hensikt til å konseptualisere typografi for logo, overskrift og brødtekst.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Illustrasjon som sammenligner typografi og font, med ulike ordstiler i en sirkel og ordet «CALIBRI» markert.',
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQDpO-JYCQgpR72jC51fLTlNAecFNKa1653T3p3uimb0_2s?e=7dkGpq',
  files: [
    { id: 'presentation-assignment', label: 'Presentasjon og oppgave (PowerPoint)', url: presentationFile, download: true },
  ],
})
