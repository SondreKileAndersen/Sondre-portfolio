import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Silhuett i Photoshop - Del 1.pdf?url'
import referenceFiles from './Silhuette Referanser.zip?url'
import svgAssets from './SVG Assets.zip?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'photoshop-silhouette-landscape-design-part-one',
  categoryId: 'graphic-design',
  title: 'Silhuettdesign i Photoshop - Del 1',
  description: 'Trinnvis veiledning i å bygge et lagdelt silhuettlandskap i Photoshop med utklipte motiver, mapper, fargelag, clipping masks og blend modes. Referansebilder og SVG-elementer følger med til arbeidet med dybde, detaljer og fargevariasjoner.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Photoshop-vindu med et lagdelt blått silhuettlandskap, en figur på en fjelltopp og fargevelgeren åpen.',
  tools: [teachingTools.photoshop],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
    { id: 'references', label: 'Silhuettreferanser (ZIP)', url: referenceFiles, download: true },
    { id: 'svg-assets', label: 'SVG-elementer (ZIP)', url: svgAssets, download: true },
  ],
})
