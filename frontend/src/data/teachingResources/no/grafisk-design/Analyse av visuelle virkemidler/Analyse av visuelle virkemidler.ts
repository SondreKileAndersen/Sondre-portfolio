import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import presentationFile from './Hvordan analysere virkemidler.odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'visual-device-analysis',
  categoryId: 'graphic-design',
  title: 'Analyse av visuelle virkemidler',
  description: 'Presentasjon og oppgave om å analysere virkemidler i animasjon og grafisk design. Opplegget viser eksempler på introanimasjoner, små dynamiske bevegelser, fargekorrigering, rammer, typografi, foto og kontrast, før eleven identifiserer virkemidler i egne moodboard-referanser.',
  format: 'presentation',
  typeLabel: 'Presentasjon og oppgave',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Matannonse med grønne piler og norske merkelapper som peker ut logo, foto, rammer, kontrast, brødtekst, sitat og fargevariasjon.',
  tools: [],
  files: [
    { id: 'presentation-assignment', label: 'Presentasjon og oppgave (ODP)', url: presentationFile, download: true },
  ],
})
