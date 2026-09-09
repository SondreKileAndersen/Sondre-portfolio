import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Oppgave - Reklameplakat for Velvet.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'velvet-advertising-poster-figma',
  categoryId: 'interaction-design',
  title: 'Reklameplakat i Figma',
  description: 'Oppgave der eleven lager en reklameplakat for den fiktive restauranten Velvet, med fokus på typografi, lesbarhet, visuell struktur og opphavsrett. PDF-en gir forslag til innhold og oppfordrer til å bruke A-R-T-S-metoden ved behov.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Utsnitt av oppgavearket «Reklameplakat i Figma» med grønn dekor, oppgavetekst og eksempler på plakatinnhold.',
  tools: [teachingTools.figma],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
