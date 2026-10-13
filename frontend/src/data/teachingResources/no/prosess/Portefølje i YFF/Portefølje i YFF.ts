import { defineTeachingResource } from '@teaching-resources/defineTeachingResource'
import { teachingTools } from '@teaching-resources/no/toolCatalog'
import presentationFile from './Portfolio YFF vg1.odp?url'
import thumbnail from './thumbnail.png'

export default defineTeachingResource({
  id: 'portfolio-yff-vg1',
  title: 'Portefølje i YFF',
  description: 'En presentasjon om forskjellen mellom CV og portefølje, ulike plattformer for å vise arbeid og krav til en oversiktlig, minimalistisk portefølje. Elevene følger en veiledning og lager en egen porteføljenettside med GitHub eller Carrd.',
  format: 'presentation',
  typeLabel: 'Presentasjon',
  thumbnailSrc: thumbnail,
  thumbnailAlt: 'Lysbilde med teksten «Portefolio vs. CV», forklaringer av forskjellen og fargede grafiske former på en uskarp bakgrunn.',
  tools: [],
  previewUrl: 'https://1drv.ms/p/c/4b988e222d7a9cdf/IQAreQgM1LviSaHPf9PLIDtNAacihO6dY6clglVVlk6J8po?e=0fWsjI',
  files: [
    { id: 'presentation', label: 'Presentasjon (ODP)', url: presentationFile, download: true },
  ],
})
