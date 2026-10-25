import { structure as hjemStructure } from './hjem/structure'
import { no as hjemContent } from './hjem/no'
import { structure as omMegStructure } from './om-meg/structure'
import { no as omMegContent } from './om-meg/no'
import { structure as utviklingStructure } from './utvikling/structure'
import { no as utviklingContent } from './utvikling/no'
import { structure as pedagogikkStructure } from './pedagogikk/structure'
import { no as pedagogikkContent } from './pedagogikk/no'
import { structure as logistikkStructure } from './logistikk/structure'
import { no as logistikkContent } from './logistikk/no'
import { structure as forskningStructure } from './forskning/structure'
import { no as forskningContent } from './forskning/no'
import { structure as prosjekterStructure } from './prosjekter/structure'
import { no as prosjekterContent } from './prosjekter/no'
import { structure as vanviddStructure } from './vanvidd/structure'
import { no as vanviddContent } from './vanvidd/no'
import { structure as cosmicAnchorStructure } from './cosmic-anchor/structure'
import { no as cosmicAnchorContent } from './cosmic-anchor/no'
import { structure as theseIndieDarlingsStructure } from './these-indie-darlings/structure'
import { no as theseIndieDarlingsContent } from './these-indie-darlings/no'
import { structure as interesserStructure } from './interesser/structure'
import { no as interesserContent } from './interesser/no'
import { structure as lydstudioForUndervisningStructure } from './lydstudio-for-undervisning/structure'
import { no as lydstudioForUndervisningContent } from './lydstudio-for-undervisning/no'
import { structure as sporbartUtlanssystemStructure } from './sporbart-utlanssystem/structure'
import { no as sporbartUtlanssystemContent } from './sporbart-utlanssystem/no'
import { structure as utstyrForLaeringStructure } from './utstyr-for-laering/structure'
import { no as utstyrForLaeringContent } from './utstyr-for-laering/no'
import { structure as innkjopOgArbeidsflytOslometStructure } from './innkjop-og-arbeidsflyt-oslomet/structure'
import { no as innkjopOgArbeidsflytOslometContent } from './innkjop-og-arbeidsflyt-oslomet/no'
import { structure as mestringGjennomTydeligStrukturStructure } from './mestring-gjennom-tydelig-struktur/structure'
import { no as mestringGjennomTydeligStrukturContent } from './mestring-gjennom-tydelig-struktur/no'
import { structure as fraOvelseTilProduktStructure } from './fra-ovelse-til-produkt/structure'
import { no as fraOvelseTilProduktContent } from './fra-ovelse-til-produkt/no'
import { structure as artsMetodenStructure } from './arts-metoden/structure'
import { no as artsMetodenContent } from './arts-metoden/no'
import { structure as laeringsressurserSomKanBrukesVidereStructure } from './laeringsressurser-som-kan-brukes-videre/structure'
import { no as laeringsressurserSomKanBrukesVidereContent } from './laeringsressurser-som-kan-brukes-videre/no'
import { localizedContent, type ContentCollections } from '../../lib/pageContent'
import { registerContentFiles, registerStructureFiles } from '../../lib/contentSource'
import type { PortfolioPage } from '../../types/page'
import type { Language } from '../../i18n/config'
import { createProjectPage, type ProjectSourceSection, type ProjectPageDefinition } from '../projects/createProjectPage'
import { teachingResources, teachingResourceCategories } from '../teachingResources/no'

// One registry and one structure per page, independent of the selected language.
if (import.meta.env.DEV) {
  registerContentFiles(import.meta.glob<Record<string, object>>(['./*/no.ts', './*/en.ts'], { eager: true }))
  registerStructureFiles(import.meta.glob<Record<string, object>>('./*/structure.ts', { eager: true }))
}

const baseDefinitions: Array<(language: Language, collections: ContentCollections) => PortfolioPage> = [
  localizedContent(hjemStructure, { no: hjemContent }),
  localizedContent(omMegStructure, { no: omMegContent }),
  localizedContent(utviklingStructure, { no: utviklingContent }),
  localizedContent(pedagogikkStructure, { no: pedagogikkContent }),
  localizedContent(logistikkStructure, { no: logistikkContent }),
  localizedContent(forskningStructure, { no: forskningContent }),
  localizedContent(prosjekterStructure, { no: prosjekterContent }),
  localizedContent(vanviddStructure, { no: vanviddContent }),
  localizedContent(cosmicAnchorStructure, { no: cosmicAnchorContent }),
  localizedContent(theseIndieDarlingsStructure, { no: theseIndieDarlingsContent }),
  localizedContent(interesserStructure, { no: interesserContent }),
]

const projectDefinitions: Array<(language: Language) => ProjectPageDefinition> = [
  localizedContent(lydstudioForUndervisningStructure, { no: lydstudioForUndervisningContent }),
  localizedContent(sporbartUtlanssystemStructure, { no: sporbartUtlanssystemContent }),
  localizedContent(utstyrForLaeringStructure, { no: utstyrForLaeringContent }),
  localizedContent(innkjopOgArbeidsflytOslometStructure, { no: innkjopOgArbeidsflytOslometContent }),
  localizedContent(mestringGjennomTydeligStrukturStructure, { no: mestringGjennomTydeligStrukturContent }),
  localizedContent(fraOvelseTilProduktStructure, { no: fraOvelseTilProduktContent }),
  localizedContent(artsMetodenStructure, { no: artsMetodenContent }),
  localizedContent(laeringsressurserSomKanBrukesVidereStructure, { no: laeringsressurserSomKanBrukesVidereContent }),
]

const collectionsByLanguage: Record<Language, ContentCollections> = {
  no: { teachingResources, teachingResourceCategories },
}
const pageCache = new Map<Language, PortfolioPage[]>()

export function getPages(language: Language): PortfolioPage[] {
  const cached = pageCache.get(language)
  if (cached) return cached
  const basePages = baseDefinitions.map(resolve => resolve(language, collectionsByLanguage[language]))
  const projectPages = projectDefinitions.map(resolve => {
    const definition = resolve(language)
    const sourcePage = basePages.find(page => page.id === definition.sourcePageId)
    const source = sourcePage?.sections.find(
      (section): section is ProjectSourceSection => section.id === definition.sourceSectionId
        && (section.type === 'gallery' || section.type === 'split'),
    )
    if (!source) throw new Error(`Missing project source: ${definition.sourcePageId}/${definition.sourceSectionId}`)
    return { ...createProjectPage(definition, source), theme: sourcePage?.theme }
  })
  const pages = [...basePages, ...projectPages]
  pageCache.set(language, pages)
  return pages
}
