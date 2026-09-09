import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Rules, Guides og Margins i Adobe.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'rulers-guides-margins-adobe',
  categoryId: 'graphic-design',
  title: 'Rulers, guides og marger',
  description: 'Veiledning i hvordan rulers, guidelines og marger kan brukes for å skape struktur og luft i grafiske oppsett. Opplegget viser arbeidsmåter i Adobe Photoshop og Illustrator, blant annet måleenheter, hjelpelinjer og egne margoppsett.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Abstrakt blågrønt rutenett av horisontale og vertikale linjer på mørk bakgrunn.',
  tools: [teachingTools.illustrator],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
