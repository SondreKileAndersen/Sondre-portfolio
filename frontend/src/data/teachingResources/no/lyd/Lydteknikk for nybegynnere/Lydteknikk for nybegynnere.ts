import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Lyd for nybegynnere.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'audio-technique-for-beginners',
  categoryId: 'audio',
  title: 'Lydteknikk for nybegynnere',
  description: 'En presentasjon med oppgave om grunnleggende lydopptak og lydteknikk. Opplegget tar for seg støy, avstand til lydkilden, mikrofontyper og opptaksområder, 48 V fantommating, lydformater, samplerate og bitrate, samt lydredigering og KI-basert lydforbedring.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Diagrammer som viser opptaksmønstrene for omnidireksjonell, subkardioid, kardioid, superkardioid, hyperkardioid, toveis og shotgun-mikrofon',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
