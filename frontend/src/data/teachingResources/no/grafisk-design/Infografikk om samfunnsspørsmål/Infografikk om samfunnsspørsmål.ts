import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Infographic - Kombitime opplegg uke 15-16.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'social-issues-infographic-assignment',
  categoryId: 'graphic-design',
  title: 'Infografikk om samfunnsspørsmål',
  description: 'Individuell oppgave der eleven lager en infografikk om et samfunnsspørsmål ved å kombinere utvalgt tekst, illustrasjoner og statistiske visualiseringer. Opplegget vektlegger typografi, layout, komposisjon, farger, bokser og luft i designet.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Oppgaveark om infografikk med blå statistikkgraf øverst, blå overskrift og eksempel på en infografikk om vannlekkasjer.',
  tools: [],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile },
  ],
})
