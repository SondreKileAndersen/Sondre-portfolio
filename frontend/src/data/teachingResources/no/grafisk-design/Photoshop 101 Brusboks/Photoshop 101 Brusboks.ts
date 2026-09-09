import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Photoshop 101 - Brusboks.pdf?url'
import projectFiles from './Photoshop 101 - Prosjektfiler.zip?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'photoshop-101-soda-can-ad',
  categoryId: 'graphic-design',
  title: 'Photoshop 101 - brusboksreklame',
  description: 'Trinnvis Photoshop-veiledning der eleven lager en reklameplakat med en brusboks. Opplegget dekker bildeimport, bakgrunnsfjerning, tekst og former, lag, justeringslag, clipping masks, pensel, generativ fylling og eksport, og inkluderer prosjektfiler.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Blå Pepsi-boks med vanndråper foran isbiter og vannsprut på blå bakgrunn, med Pepsi-logo og teksten «GET IT NOW!»',
  tools: [teachingTools.photoshop],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
    { id: 'project-files', label: 'Prosjektfiler (ZIP)', url: projectFiles, download: true },
  ],
})
