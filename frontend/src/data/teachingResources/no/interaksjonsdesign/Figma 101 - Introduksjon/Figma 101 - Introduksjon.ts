import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Figma 101 - Intro.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'figma-101-interactive-app-introduction',
  categoryId: 'interaction-design',
  title: 'Figma 101: Introduksjon',
  description: 'Trinnvis introduksjon til Figma der eleven lager en enkel mobilprototype med sider, frames, knapper, tekst og navigasjon. Veiledningen dekker også lag, justering, skalering, preview, testing på mobil, bildeimport og scrolling.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Diagram fra Figma som viser forskjellen mellom Move og Scale når en grønn knapp endres inne i en rosa ramme.',
  tools: [teachingTools.figma],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
