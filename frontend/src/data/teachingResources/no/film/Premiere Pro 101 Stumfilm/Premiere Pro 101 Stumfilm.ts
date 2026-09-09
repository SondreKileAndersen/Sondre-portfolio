import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Adobe Premiere Pro 101 - Stumfilm Versjon.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'adobe-premiere-pro-101-silent-film',
  categoryId: 'film',
  title: 'Premiere Pro 101: Stumfilm',
  description: 'En trinnvis veiledning i grunnleggende videoredigering i Adobe Premiere Pro, fra prosjektopprettelse og tidslinje til klipping, effekter, tekst og eksport. Elevene kan bruke egne klipp eller følge opplegget med materiale om månelandingen.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Svart-hvitt-bilde av en mann i strikkelue ved siden av et stort, gammeldags filmkamera, med en eldre mann bak seg.',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
