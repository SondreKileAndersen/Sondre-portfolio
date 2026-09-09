import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Dialog i film.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'film-dialogue-shot-reverse-shot-exercise',
  categoryId: 'film',
  title: 'Dialog i film',
  description: 'Presentasjon og øvingsoppgave om hvordan dialog filmes med shot/reverse shot, clean single, dirty single, over-the-shoulder, wide og 180-gradersregelen. Elevene filmer en 1–2 minutter lang flerkameradialog med to mobilkameraer.',
  format: 'pdf',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Diagram over shot/reverse shot med to kameraer og fire filmeksempler merket med grønne og blå nummer.',
  tools: [],
  resourceUrl: resourceFile,
})
