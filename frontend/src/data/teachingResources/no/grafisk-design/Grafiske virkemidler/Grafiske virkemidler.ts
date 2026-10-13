import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import resourceFile from './Virkemidler i Grafisk Design (Presentasjon og oppgave).odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'graphic-design-visual-elements',
  title: 'Grafiske virkemidler',
  description: 'En presentasjon med analyse- og rekonstruksjonsoppgaver om virkemidler i grafisk design. Elevene undersøker trykksaker med vekt på komposisjon, farge og typografi, presenterer funnene og lager en fysisk plakat.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blått og rosa blekk som blander seg på grå bakgrunn, med teksten Grafisk Design Virkemidler i midten og rosa grafiske former til høyre',
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQDZcCjPW-CVQ6n0cKtWi1C6AZ5Xx4325ru0xXSA0sYQI3E?e=A6HWny',
  files: [
    { id: 'presentation', label: 'Presentasjon og oppgave', url: resourceFile },
  ],
})
