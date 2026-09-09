import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Figma 102 - Header.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'figma-102-header-components-navigation',
  categoryId: 'interaction-design',
  title: 'Figma 102: Header',
  description: 'Veiledning i å lage en gjenbrukbar header og navigasjonsbar i Figma med komponenter, instanser og prototypelenker. Opplegget dekker også sticky header, redigering av instanser og component variations for en knapp med hover-effekt.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Figma-visning som sammenligner en Header-komponent og en Header-instans med UNICEF-logo, markert med fargede piler.',
  tools: [teachingTools.figma],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
