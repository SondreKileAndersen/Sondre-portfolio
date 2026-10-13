import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Adobe Audio Enhance med Premiere Pro.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'adobe-audio-enhance-with-premiere-pro',
  categoryId: 'film',
  title: 'Premiere Pro - Adobe Audio Enhance',
  description: 'Trinnvis veiledning der eleven eksporterer lyd fra Premiere Pro som en WAV-fil, forbedrer talen med Adobe Audio Enhance og legger den bearbeidede lyden tilbake i prosjektet for sammenligning.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Adobe Audio Enhance-vindu med lydfilen Test.wav, aktivert Enhance speech-bryter og knapper for opplasting og nedlasting',
  tools: [teachingTools.premierePro],
  resourceUrl: resourceFile,
})
