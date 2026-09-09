import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Premiere Pro - Captions.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'premiere-pro-captions',
  categoryId: 'film',
  title: 'Teksting i Premiere Pro',
  description: 'Trinnvis veiledning i å transkribere lyd og opprette automatisk teksting i Adobe Premiere Pro. Den viser også hvordan eleven kan justere tekstmengde, rette transkripsjonen, endre utseendet og oppgradere teksting til grafikk.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blåtonet videobilde av en kvinne med en grafisk søkeboks øverst til høyre, en tekstplakat nederst og avspillingskontroller langs bunnen',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
