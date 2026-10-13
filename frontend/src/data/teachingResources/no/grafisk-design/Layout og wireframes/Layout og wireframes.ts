import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import assignmentFile from './Layout og Wireframe.docx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'layout-wireframes-poster-design',
  categoryId: 'graphic-design',
  title: 'Layout og wireframes',
  description: 'Oppgave der eleven utvikler fem wireframes til en plakat med Øyafestivalen som tema. Opplegget vektlegger luft, marger, rutenett, balanse, kontrast, hierarki og blikkfang, før den beste skissen gjenskapes digitalt og videreutvikles med fargebalanse og moodboard.',
  format: 'other',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Fire håndtegnede wireframe-skisser til venstre og en enkel digital plakatskisse med logo, bildeplass og figur til høyre.',
  tools: [],
  previewUrl: 'https://1drv.ms/w/c/4b988e222d7a9cdf/IQAh4U0PyiQ-Srtbq7AhR2LGAap4zdJesL06ssZJxIHI0ck?e=mspF32',
  files: [
    { id: 'assignment', label: 'Oppgave (Word)', url: assignmentFile, download: true },
  ],
})
