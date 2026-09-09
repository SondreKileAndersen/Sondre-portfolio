import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Lyd i Premiere Pro - The Basics.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'premiere-pro-audio-basics',
  categoryId: 'film',
  title: 'Lyd i Premiere Pro',
  description: 'Nybegynnerveiledning i arbeid med lyd i Adobe Premiere Pro. Elevene lærer å justere volum med automasjonspunkter, bruke lydarbeidsområdet og forbedre dialog med funksjoner for støyreduksjon, klang, dynamikk og EQ.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Premiere Pro-tidslinje med et lilla lydklipp og lydbølge, blå lydspor og rosa piler som viser justering mellom sporene og i lydklippet',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
