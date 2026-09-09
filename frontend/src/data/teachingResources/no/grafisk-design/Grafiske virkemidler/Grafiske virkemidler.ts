import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Virkemidler i Grafisk Design (Presentasjon og oppgave).odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'graphic-design-visual-elements',
  categoryId: 'graphic-design',
  title: 'Grafiske virkemidler',
  description: 'En presentasjon med analyse- og rekonstruksjonsoppgaver om virkemidler i grafisk design. Elevene undersøker trykksaker med vekt på komposisjon, farge og typografi, presenterer funnene og lager en fysisk plakat.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blått og rosa blekk som blander seg på grå bakgrunn, med teksten Grafisk Design Virkemidler i midten og rosa grafiske former til høyre',
  tools: [teachingTools.powerPoint],
  resourceUrl: resourceFile,
})
