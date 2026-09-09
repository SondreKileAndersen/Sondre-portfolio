import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Figma 103 - Deling og Ressurser.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'figma-103-sharing-and-resources',
  categoryId: 'interaction-design',
  title: 'Figma 103: Deling og ressurser',
  description: 'Veiledning i å dele Figma-prototyper, samarbeide i samme prosjekt og gjenbruke komponenter gjennom Assets. Opplegget introduserer også Figma Community, kopiering fra andre prosjekter og hvordan eleven kan arbeide videre med delte læringsressurser.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Figma-vindu med Share-knappen markert og en lilla pil som peker ned mot dialogboksen for deling av filen.',
  tools: [teachingTools.figma],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
