import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './ARTS Metoden.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'arts-method-for-media-production',
  categoryId: 'process',
  title: 'ARTS-metoden',
  description: 'En presentasjon om ARTS-metoden: Analyze, Reconstruct, Tweak og Sculpt. Opplegget viser hvordan elever kan analysere og gjenskape profesjonelle uttrykk, eksperimentere med teknikkene og til slutt lage noe eget, med en introduksjonsoppgave i Photoshop.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Mørk presentasjonsslide med tittelen ARTS og fire trinn: Analyze, Reconstruct, Tweak og Sculpt, illustrert med øye, murstein og kunstnerikon',
  tools: [],
  resourceUrl: resourceFile,
})
