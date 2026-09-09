import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Plakater og miniatyrbilder.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'poster-and-thumbnail-design',
  categoryId: 'graphic-design',
  title: 'Plakater og miniatyrbilder',
  description: 'En presentasjon med oppgave om plakater, miniatyrbilder og ekstern kommunikasjon. Elevene undersøker visuelle virkemidler, plattformformat og eksempler fra blant annet Aleksandr Rodtsjenko, før de lager Instagram-miniatyrbilder for innhold fra NRK-arkivet.',
  format: 'pdf',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Person sett bakfra foran to innrammede bilder: en sovjetisk propagandaplakat og et fargerikt miniatyrbilde med teksten Kool-Aid Enchilada',
  tools: [teachingTools.photoshop],
  resourceUrl: resourceFile,
})
