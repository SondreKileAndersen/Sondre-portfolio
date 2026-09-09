import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Prosjektgang i Medieproduksjon (Presentasjon og oppgaver).pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'media-production-project-workflow',
  categoryId: 'process',
  title: 'Prosjektgang i medieproduksjon',
  description: 'En presentasjon med oppgaver om en seksdelt prosjektgang i medieproduksjon: brief, planlegging og utforsking, konseptualisering, produksjon, standardisering og presentasjon. Elevene arbeider blant annet med målgruppe, moodboard, semiotikk, typografi, farger og tilbakemeldinger.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgaver',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Mørk presentasjonsslide med tittelen Prosjektgang, en liste over seks prosjektfaser og et utsnitt av en kalender til høyre',
  tools: [],
  resourceUrl: resourceFile,
})
