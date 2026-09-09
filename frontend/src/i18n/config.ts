import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { no } from './locales/no'

export const supportedLanguages = ['no'] as const
export type Language = (typeof supportedLanguages)[number]
export const defaultLanguage: Language = 'no'

export function isSupportedLanguage(value: string): value is Language {
  return supportedLanguages.includes(value as Language)
}

void i18n.use(initReactI18next).init({
  resources: {
    no: { translation: no },
  },
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
