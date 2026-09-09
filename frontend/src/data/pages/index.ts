import type { PortfolioPage } from '../../types/page'
import type { Language } from '../../i18n/config'
import { norwegianPages } from './no'

const pagesByLanguage: Record<Language, PortfolioPage[]> = {
  no: norwegianPages,
}

export function getPages(language: Language): PortfolioPage[] {
  return pagesByLanguage[language]
}
