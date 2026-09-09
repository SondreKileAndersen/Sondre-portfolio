import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Fargesystemer og fargelære.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'color-systems-and-color-theory',
  categoryId: 'graphic-design',
  title: 'Fargesystemer og fargelære',
  description: 'En presentasjon om fargesystemene CMYK, RGB, HEX og HSL, og om hvordan farger brukes i visuell kommunikasjon. Opplegget dekker monokrome, analoge og komplementære fargekombinasjoner, 60–30–10-regelen og hue-shifting.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Illustrasjon av det elektromagnetiske spekteret, med synlig lys forstørret som et fargebånd fra omtrent 400 til 700 nanometer',
  tools: [],
  resourceUrl: resourceFile,
})
