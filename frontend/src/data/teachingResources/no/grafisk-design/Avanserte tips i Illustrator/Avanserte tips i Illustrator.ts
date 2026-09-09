import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Avanserte tips til Illustrator.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'advanced-illustrator-techniques',
  categoryId: 'graphic-design',
  title: 'Avanserte tips i Illustrator',
  description: 'Veiledning med teknikker som Mirror Repeat, Compound Path med gradient, Width Tool, bruk av referansebilder og Pathfinder. Opplegget viser hvordan eleven kan arbeide mer presist og gi illustrasjoner et mer profesjonelt uttrykk.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Illustrator-eksempel som viser en firkant med variert strektykkelse og Stroke Profile-menyen åpen.',
  tools: [teachingTools.illustrator],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
