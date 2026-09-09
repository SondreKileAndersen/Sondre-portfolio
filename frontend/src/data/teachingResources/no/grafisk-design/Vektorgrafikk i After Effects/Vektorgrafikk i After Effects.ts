import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Animere vektor grafikk i After Effects.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'after-effects-vector-graphics-animation',
  categoryId: 'graphic-design',
  title: 'Vektorgrafikk i After Effects',
  description: 'En trinnvis veiledning i å animere vektorgrafikk i After Effects. Elevene lager former med Pen Tool og Trim Paths, konverterer en Illustrator-fil til former og justerer animasjonskurver med Easy Ease og Graph Editor.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Skjermbilde fra After Effects der røde piler markerer 0 sekunder på tidslinjen og End-verdien 0 prosent under Trim Paths',
  tools: [teachingTools.afterEffects, teachingTools.illustrator],
  resourceUrl: resourceFile,
})
