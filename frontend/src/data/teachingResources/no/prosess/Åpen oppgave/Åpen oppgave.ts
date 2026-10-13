import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Åpen oppgave.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'open-assignment-exam-preparation',
  title: 'Åpen oppgave',
  description: 'Presentasjonen veileder elevene i å definere sin egen casebaserte medieproduksjonsoppgave som forberedelse til eksamen. Den dekker rammer, framdriftsplan og dokumentasjon av idéutvikling, skisser og planlegging.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Lys presentasjonsslide med svart tittelfelt merket «Åpen oppgave» og tre bokser om egen oppgave, eksamensforberedelse og prosjektperioden uke 19–21.',
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQBtEDHft7xSQ4DJLey9bD3tAcTwYWwc0l0sVtfcsgpL3Kw?e=Ose1yW',
  files: [
    { id: 'presentation', label: 'Presentasjon', url: presentationFile },
  ],
})
