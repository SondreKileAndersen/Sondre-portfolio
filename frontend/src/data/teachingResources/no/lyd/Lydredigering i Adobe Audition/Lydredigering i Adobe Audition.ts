import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Audition - Lyd for podcast (Veiledning).pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'adobe-audition-podcast-audio-editing',
  categoryId: 'audio',
  title: 'Lydredigering i Adobe Audition',
  description: 'Veiledning i å organisere, klippe og behandle podcastlyd i Adobe Audition. Presentasjonen dekker blant annet multitrack, mono og stereo, lydnivå, støyreduksjon, kompressor og EQ.',
  format: 'presentation',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Skjermbilde av Adobe Audition med bølgeformer og spektrogram, med røde markeringer rundt Waveform-fanen og redigeringsverktøyene.',
  tools: [teachingTools.audition],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQD3mVTVaUreSK0vTjCncvfuASG6a45lBvvP-zZbeNOHXvg?e=7OINee',
  files: [
    { id: 'guide', label: 'Veiledning (PowerPoint)', url: guideFile },
  ],
})
