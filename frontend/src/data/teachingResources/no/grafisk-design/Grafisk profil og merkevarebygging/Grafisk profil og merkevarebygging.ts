import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Grafisk Profil (OsloMet).pdf?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'graphic-profile-brand-building',
  categoryId: 'graphic-design',
  title: 'Grafisk profil og merkevarebygging',
  description: 'Presentasjon om merkevarebygging, bedriftsprofilering og hvordan designmanualer bidrar til en tydelig grafisk profil. Inneholder eksempler på merkevareidentitet, farger, typografi og opphavsrett.',
  format: 'pdf',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Venn-diagram som sammenligner verdier og identitet hos Pepsi og Coca-Cola, med felles merkeverdier i overlappet.',
  tools: [],
  files: [
    { id: 'presentation', label: 'Presentasjon (PDF)', url: presentationFile },
  ],
})
