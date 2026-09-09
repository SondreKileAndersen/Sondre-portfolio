import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Adobe Premiere Pro 101 (OsloMet).pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'adobe-premiere-pro-101-nasa-trailer',
  categoryId: 'film',
  title: 'Adobe Premiere Pro 101',
  description: 'Trinnvis veiledning der eleven oppretter et Premiere Pro-prosjekt og klipper en trailer om NASAs månelanding. Den dekker arbeidsområde, tidslinje, import, klipping, lyd, effekter, tekst, flere spor, Effect Controls og eksport.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Nærbilde av en videoredigeringstidslinje med videoklipp og lydspor, med Premiere Pro-logo nederst til venstre',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
