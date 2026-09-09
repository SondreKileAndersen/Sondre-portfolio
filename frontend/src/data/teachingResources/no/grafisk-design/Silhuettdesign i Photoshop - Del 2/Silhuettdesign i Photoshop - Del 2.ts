import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Silhuett i Photoshop - Del 2.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'photoshop-silhouette-design-part-two',
  categoryId: 'graphic-design',
  title: 'Silhuettdesign i Photoshop - Del 2',
  description: 'Videregående veiledning i silhuettdesign i Photoshop med tåke, støvpartikler, gradienter og dybdeskarphet. Opplegget viser også hvordan eleven kan bruke Smart Objects, Gaussian Blur og figur-rammer for å skape mer dybde og et mer gjennomarbeidet uttrykk.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blå silhuett av et dragehode med et lagdelt fjellandskap og en liten figur plassert inne i formen.',
  tools: [teachingTools.photoshop],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
