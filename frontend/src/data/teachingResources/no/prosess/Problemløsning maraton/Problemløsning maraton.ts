import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Problemløsning Maraton.pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'problem-solving-marathon',
  title: 'Problemløsning maraton',
  description: 'En paroppgave med 32 varierte spørsmål som trener informasjonsinnhenting, kildebruk og problemløsning innen blant annet bildebehandling, web, lyd, IT og medieproduksjon. Svarene samles i et eget dokument, og de siste oppgavene skal begrunnes med nettkilder.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'En blågrønn fisk med horisontale striper svømmer i et akvarium',
  tools: [],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile, download: true },
  ],
})
