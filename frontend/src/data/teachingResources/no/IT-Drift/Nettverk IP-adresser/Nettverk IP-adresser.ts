import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './1. Nettverk – IP adresser 1.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'network-ip-addresses',
  categoryId: 'it-operations',
  title: 'Nettverk – IP-adresser',
  description:
    'Introduksjonsopplegg om IP-adresser, domener, servere og adresser til enheter i lokale nettverk, med praktisk oppgave til slutt.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt:
    'Server med IP-adressen 195.88.55.16 og et eksempel på nettstedet som ligger på serveren',
  tools: [teachingTools.commandPrompt],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQBzkYncjm-JQb-lTectJAv0AaQ2NT2IXUBfRsyqcbCu5Cs?e=2GWsR2',
  resourceUrl: presentationFile,
})
