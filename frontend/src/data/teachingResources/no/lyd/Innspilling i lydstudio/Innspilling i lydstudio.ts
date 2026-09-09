import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import guideFile from './Innspilling i lydstudio.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'audio-studio-recording-guide',
  categoryId: 'audio',
  title: 'Innspilling i lydstudio',
  description: 'Veiledning i signalgang og opptak i lydstudio, fra mikrofon, multiboks og preamp til Pro Tools. Ressursen viser også valg av input, opptaksklargjøring, monitorering, talkback og hodetelefonlytting.',
  format: 'pdf',
  typeLabel: 'Veiledning',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Utsnitt av lydsporet Narration i Pro Tools med knapper for opptaksklargjøring, input-monitorering, solo og mute',
  tools: [],
  files: [
    { id: 'guide', label: 'Veiledning (PDF)', url: guideFile },
  ],
})
