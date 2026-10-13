import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Silhuette Design - Del 3.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'photoshop-silhouette-design-part-three',
  categoryId: 'graphic-design',
  title: 'Silhuettdesign i Photoshop - Del 3',
  description: 'Presentasjon om hvordan et coverdesign klargjøres for trykk etter arbeid i Photoshop. Opplegget dekker forskjellen mellom RGB og CMYK, konvertering til CMYK, riktige mål for coveret, PNG-eksport og plassering i en A4-mal før utskrift.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Presentasjonsslide med overskriften «Printe for coverdesign» og et utsnitt av oppgaven Cover Design på høyre side.',
  tools: [teachingTools.photoshop],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQA_feSMkBJCRIx2SnOYuRDQAZA2uqouJ6IMh262qS7ztmA?e=5q9mMt',
  files: [
    { id: 'presentation', label: 'Presentasjon (PowerPoint)', url: presentationFile, download: true },
  ],
})
