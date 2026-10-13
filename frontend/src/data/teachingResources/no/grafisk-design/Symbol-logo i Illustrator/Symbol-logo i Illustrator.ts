import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import assignmentFile from './Symbol-logo Oppgave.pptx?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'illustrator-symbol-logo-variations',
  categoryId: 'graphic-design',
  title: 'Symbol-logo i Illustrator',
  description: 'Oppgave der eleven utvikler et symbol som passer til en eksisterende tekstlogo ved hjelp av form- og pennverktøy i Adobe Illustrator. Eleven lager minst fem varianter i farge, størrelse og form, og velger til slutt én løsning til den grafiske profilen.',
  format: 'presentation',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Sammenligning av konkrete og abstrakte symbol-logoer med kjente merkeeksempler i to sirkler.',
  tools: [teachingTools.illustrator],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQAxVEKtPqZwT6oJ4Zq0c6bSAYcs0S8Er0Y7b1yBPCxJclg?e=Msplbf',
  files: [
    { id: 'assignment', label: 'Oppgave (PowerPoint)', url: assignmentFile, download: true },
  ],
})
