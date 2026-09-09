import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'color-correction-in-premiere-pro-playlist',
  categoryId: 'film',
  title: 'Fargekorrigering i Premiere Pro',
  description: 'YouTube-spilleliste om fargekorrigering i Adobe Premiere Pro, blant annet justering av temperatur og balanse mellom kalde og varme fargetoner.',
  format: 'video',
  typeLabel: 'Video',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Mann med caps og briller ved siden av Premiere Pro-logo, et filmklipp av en person på et jorde og en grafikk for kald og varm temperaturjustering',
  tools: [teachingTools.premierePro],
  resourceUrl: 'https://www.youtube.com/playlist?list=PLVcoQA4TE8eg',
})
