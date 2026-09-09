import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Kamerateknikk (Presentasjon og oppgave).pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'camera-technique-and-exercises',
  categoryId: 'film',
  title: 'Kamerateknikk',
  description: 'En presentasjon med praktiske oppgaver om kamerateknikk for film. Opplegget dekker blant annet bildefrekvens, oppløsning, objektiver, lukkertid, blender, ISO, fokus, brennvidde, eksponering og hvitbalanse.',
  format: 'pdf',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Person som holder et kamera med et stort hvitt teleobjektiv foran et uskarpt landskap',
  tools: [],
  resourceUrl: resourceFile,
})
