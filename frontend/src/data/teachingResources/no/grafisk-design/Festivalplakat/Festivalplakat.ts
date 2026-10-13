import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import resourceFile from './Festival plakat (Oppgave).odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'festival-poster-design',
  categoryId: 'graphic-design',
  title: 'Festivalplakat',
  description: 'En oppgave der elevene lager en plakat for Øyafestivalen eller et selvvalgt, godkjent prosjekt. Opplegget lar elevene øve på designprosess og grafiske virkemidler med særlig vekt på komposisjon, logo og grafiske elementer.',
  format: 'presentation',
  typeLabel: 'Oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Kollasj av flere fargerike Øyafestivalen-plakater med artistnavn, illustrasjoner og variert typografi',
  tools: [teachingTools.illustrator],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQCdia-bXpGoSp1Mzf8Mp1DoAeMhbF6EY45AWH-3MDD45tA?e=H1hgxz',
  resourceUrl: resourceFile,
})
