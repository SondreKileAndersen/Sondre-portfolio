import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Image Trace - Illustrator Guide.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'illustrator-image-trace-logo-vectorization',
  categoryId: 'graphic-design',
  title: 'Image Trace i Illustrator',
  description: 'Trinnvis veiledning i å importere en logo og vektorisere den med Image Trace i Adobe Illustrator. Opplegget viser blant annet Preview, Mode, Colors, Advanced, Expand og hvordan eleven kan redigere farger, former og ankerpunkter etterpå.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Adobe Illustrator med en markert YouTube-logo og Image Trace-panelet åpent på høyre side.',
  tools: [teachingTools.illustrator],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
