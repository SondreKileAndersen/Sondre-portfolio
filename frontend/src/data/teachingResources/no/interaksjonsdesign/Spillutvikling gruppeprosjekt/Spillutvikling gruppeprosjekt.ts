import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Spillutvikling - Gruppeprosjekt intro.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'game-development-group-project',
  title: 'Spillutvikling – gruppeprosjekt',
  description: 'En introduksjon til spillutviklingsukene der elevene undersøker hva spill kan være, diskuterer spillmekanikker og medieinnhold og velger et individuelt vurderingsbidrag ut fra egne styrker og interesser.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Skjermbilde fra et klassisk pikselspill med en rød figur på et grønt rør, murblokker, en spørsmålstegnblokk og to små fiender mot blå himmel.',
  tools: [],
  files: [
    { id: 'presentation', label: 'Presentasjon', url: presentationFile },
  ],
})
