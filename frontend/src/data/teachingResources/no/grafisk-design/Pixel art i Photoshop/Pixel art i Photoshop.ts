import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Pixel art i Photoshop.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'photoshop-pixel-art-character',
  categoryId: 'graphic-design',
  title: 'Pixel art i Photoshop',
  description: 'Trinnvis veiledning i å lage pikselgrafikk i Photoshop med Pencil, Eraser, rutenett, fargepaletter og presise markeringer. Opplegget dekker også bitstørrelse, clipping masks, lys og skygge og silhuettbaserte bakgrunner.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Pikselert fuglefigur i brune og gylne toner med en markert del ved foten og en oransje pil som peker mot markeringen.',
  tools: [teachingTools.photoshop],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
