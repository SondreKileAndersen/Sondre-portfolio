import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Premiere Pro - B-roll, Jump-cuts, og keyframes.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'premiere-pro-b-roll-jump-cuts-and-keyframes',
  categoryId: 'film',
  title: 'B-roll, jump-cuts og keyframes',
  description: 'Veiledning i å skjule jump-cuts med skalering og B-roll i Adobe Premiere Pro. Elevene lærer også å animere bilder med posisjon, skalering og keyframes for å lage en Ken Burns-effekt.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blåtonet nærbilde av en person som holder et profesjonelt videokamera',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
