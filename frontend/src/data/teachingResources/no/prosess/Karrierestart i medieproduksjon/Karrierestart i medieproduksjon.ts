import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Case om karrierestart - Robert Pattinson.odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'career-start-media-production-pattinson-case',
  title: 'Karrierestart i medieproduksjon',
  description: 'Presentasjonen bruker Robert Pattinson som case for å vise hvordan research, små prosjekter, nye nettverk og porteføljebygging kan åpne nye muligheter i mediebransjen.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Filmplakat med et nærbilde av en mann i fargerik neonbelysning og tittelen Good Time',
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQBAGEm_opzJTY7OuMcKKXcyAanYivFAZscOlvtqQ2KewQs?e=rvFOMl',
  files: [
    { id: 'presentation', label: 'Presentasjon (ODP)', url: presentationFile, download: true },
  ],
})
