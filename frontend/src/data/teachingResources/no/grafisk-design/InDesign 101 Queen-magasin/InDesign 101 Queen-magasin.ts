import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './InDesign 101.pdf?url'
import logoFiles from './Hvit - Queen Symbol Logo.zip?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'indesign-101-queen-magazine',
  categoryId: 'graphic-design',
  title: 'InDesign 101: Queen-magasin',
  description: 'Trinnvis oppgave der eleven lager et firesiders magasin om Queen i Adobe InDesign. Opplegget dekker blant annet rammer, tekstflyt, bilder, SVG-logoer, text wrap, farger, lag, relinking og eksport til trykklar PDF med utfallende kant.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Mørkt gruppeportrett av fire bandmedlemmer med teksten «Queen II» øverst til venstre.',
  tools: [teachingTools.indesign],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile },
    { id: 'logo-files', label: 'Queen-logoer (ZIP)', url: logoFiles, download: true },
  ],
})
