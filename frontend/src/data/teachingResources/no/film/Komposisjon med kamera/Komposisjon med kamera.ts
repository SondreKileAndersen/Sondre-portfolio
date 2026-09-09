import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Komposisjon med kamera.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'camera-composition-and-framing',
  categoryId: 'film',
  title: 'Komposisjon med kamera',
  description: 'En presentasjon om kamerakomposisjon og visuell historiefortelling. Opplegget forklarer panorering og tilt, point of view, open og closed framing, circle of action og tredelingsprinsippet.',
  format: 'pdf',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Skjermbilde av YouTube-kanalen Movie Camera Shots med silhuetter av et filmteam og videominiatyrer om ulike kamerautsnitt',
  tools: [],
  resourceUrl: resourceFile,
})
