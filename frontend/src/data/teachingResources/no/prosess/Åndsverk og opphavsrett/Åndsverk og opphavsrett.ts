import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Åndsverk og opphavsrett.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'copyright-and-intellectual-property',
  categoryId: 'process',
  title: 'Åndsverk og opphavsrett',
  description: 'Presentasjonen forklarer åndsverk, opphavsrett og lisenser gjennom eksempler fra musikk, design og fotografi. Den tar også opp KI-genererte bilder, menneskelig skapende innsats og kilder til bilder som kan brukes lovlig.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Nærbilde av en svart makak med brune øyne og synlige tenner foran grønn skog',
  tools: [],
  files: [
    { id: 'presentation', label: 'Presentasjon', url: presentationFile },
  ],
})
