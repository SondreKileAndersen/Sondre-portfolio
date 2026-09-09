import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Oppdrag - Cover Design.pdf?url'
import photoshopTemplate from './dvd-cover-blank.psd?url'
import printTemplate from './A4 til print.docx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'dvd-game-cover-design',
  categoryId: 'graphic-design',
  title: 'Coverdesign for DVD og spill',
  description: 'Oppgave der eleven lager et komplett omslag til et valgfritt spill, en film eller en serie, tilpasset et fysisk DVD- eller spillcover. Ressursene inkluderer en Photoshop-mal og en A4-mal for utskrift, og oppgaven åpner for blant annet rygg, skjermbilder, aldersmerking, strekkode, anmeldelser og plateetikett.',
  format: 'pdf',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Flatt PlayStation 4-cover for Fallout 4 med bakside, rygg og forside, samt spillplaten ved siden av.',
  tools: [teachingTools.photoshop],
  files: [
    { id: 'assignment', label: 'Oppgave (PDF)', url: assignmentFile },
    { id: 'photoshop-template', label: 'Photoshop-mal (PSD)', url: photoshopTemplate, download: true },
    { id: 'print-template', label: 'A4-mal for utskrift (Word)', url: printTemplate, download: true },
  ],
})
