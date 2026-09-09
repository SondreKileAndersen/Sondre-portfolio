import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Arbeidsprosess mellom Adobe programmer.pdf?url'
import projectFiles from './Frus.zip?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'adobe-workflow-frus-label',
  categoryId: 'graphic-design',
  title: 'Adobe-arbeidsflyt med Frus',
  description: 'Veiledning i å koble Photoshop- og Illustrator-innhold til InDesign gjennom et etikettprosjekt for Frus. Opplegget dekker lenkede filer, Object Layer Options, oppdatering av endringer, vektorgrafikk og en valgfri oppgave med design av etikettens bakside.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Adobe InDesign-ikon over Photoshop- og Illustrator-ikonene på mørk grå bakgrunn, med oransje piler som viser arbeidsflyten inn i InDesign.',
  tools: [teachingTools.photoshop, teachingTools.illustrator, teachingTools.indesign],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
    { id: 'project-files', label: 'Prosjektfiler (ZIP)', url: projectFiles, download: true },
  ],
})
