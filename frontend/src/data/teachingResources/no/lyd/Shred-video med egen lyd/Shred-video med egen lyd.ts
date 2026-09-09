import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Shred video (Oppgave).pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'shred-video-sound-replacement',
  categoryId: 'audio',
  title: 'Shred-video med egen lyd',
  description: 'En praktisk oppgave der elevene fjerner originallyden fra en musikkvideo, spiller inn egne lyder og synkroniserer dem med bildet i Adobe Premiere Pro. Oppgaven avsluttes med eksport som MP4.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Svart-hvitt bilde av tre musikere, to sittende med elektriske gitarer og én stående med hånden ved øret',
  tools: [teachingTools.premierePro],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
