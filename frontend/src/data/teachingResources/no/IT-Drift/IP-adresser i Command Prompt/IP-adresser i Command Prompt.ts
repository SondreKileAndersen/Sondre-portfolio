import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './1. Oppgave 1- Command Prompt.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'ip-addresses-command-prompt-ping-tracert-ipconfig',
  categoryId: 'it-operations',
  title: 'IP-adresser i Command Prompt',
  description: 'En praktisk oppgave der elevene bruker ping, tracert og ipconfig i Command Prompt for å undersøke IP-adresser, svartider, mellomstasjoner og egen nettverksinformasjon.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Skjermbilde av Command Prompt med resultatet fra ipconfig, der IPv4-adressen er markert med en oransje ramme.',
  tools: [teachingTools.commandPrompt],
  previewUrl: 'https://1drv.ms/b/c/4b988e222d7a9cdf/IQCcSDwT6t6ER6adSlUdsVuCAbho7-xOju9Nl-AoyhW4L98?e=934eEL',
  resourceUrl: resourceFile,
})
