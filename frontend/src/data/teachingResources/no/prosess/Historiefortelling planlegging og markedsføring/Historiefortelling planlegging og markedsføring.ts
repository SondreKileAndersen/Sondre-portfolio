import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Sammenhengen mellom historiefortelling, planlegging og markedsføring.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'storytelling-planning-and-digital-marketing',
  categoryId: 'process',
  title: 'Historiefortelling, planlegging og markedsføring',
  description: 'En presentasjon med oppgave om sammenhengen mellom historiefortelling, planlegging, kommunikasjon og markedsføring i digitale medier. Opplegget dekker blant annet målgruppe, mediering, virkemidler, Uses and Gratifications-teori, epitekst, influensere og ekstern eksponering.',
  format: 'pdf',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Sirkel av blå og oransje piler omgitt av begreper som budsjett, målgruppe, brukerreise, markedsføring, mediering og bedriftsprofilering',
  tools: [],
  resourceUrl: resourceFile,
})
