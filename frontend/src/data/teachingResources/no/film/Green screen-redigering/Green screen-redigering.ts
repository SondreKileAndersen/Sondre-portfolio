import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Green screen - Redigering.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'premiere-pro-green-screen-editing',
  categoryId: 'film',
  title: 'Green screen-redigering i Premiere Pro',
  description: 'En trinnvis veiledning i å fjerne grønn bakgrunn med Ultra Key i Adobe Premiere Pro. Opplegget dekker blant annet alpha channel, maskering og fjerning av grønt søl.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Flere TV-kameraer og en monitor foran en grønn green screen-vegg, med en tom stol i bakgrunnen',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
