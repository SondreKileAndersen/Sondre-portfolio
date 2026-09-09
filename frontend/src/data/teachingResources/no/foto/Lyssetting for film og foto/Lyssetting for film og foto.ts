import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Lys.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'lighting-for-film-and-photography',
  categoryId: 'photo',
  title: 'Lyssetting for film og foto',
  description: 'En presentasjon med øvingsoppgave om lyssetting for portrett, intervju og visuell historiefortelling. Opplegget dekker trepunktslys, nøkkellys, utfyllingslys, kantlys, Rembrandt-lys, butterfly-lys, silhuett og short lighting.',
  format: 'pdf',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'To sidevendte portretter av samme person, ett mykt belyst og ett mørkere med dramatisk sidelys',
  tools: [],
  resourceUrl: resourceFile,
})
