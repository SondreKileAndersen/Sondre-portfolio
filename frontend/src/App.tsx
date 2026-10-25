import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SectionRenderer } from './components/SectionRenderer'
import {
  CaseStudyGroup,
  type BrandedCaseStudySection,
} from './components/CaseStudyGroup'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { LearningJourneyGroup } from './components/LearningJourneyGroup'
import { getPages } from './data/pages'
import {
  defaultLanguage,
  isSupportedLanguage,
} from './i18n/config'
import type { PageSection, PortfolioPage } from './types/page'
import { sectionTone } from './lib/sectionTone'
import portraitImage from './media/hjem/Sondre_Caps.jpg'

const normalizePath = (path: string) => {
  const normalized = path.length > 1 ? path.replace(/\/$/, '') : path
  return normalized === '/ressurskoordinering' ? '/logistikk' : normalized
}

function pageDescription(page?: PortfolioPage) {
  if (!page) return ''
  for (const section of page.sections) {
    if ('introduction' in section && typeof section.introduction === 'string') return section.introduction
    if ('paragraphs' in section && section.paragraphs?.[0]) return section.paragraphs[0]
    if ('lead' in section && section.lead) return section.lead
  }
  return page.title
}

function setMeta(selector: string, attribute: 'name' | 'property', value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${selector}]`)
  if (!element) {
    element = document.createElement('meta')
    document.head.append(element)
  }
  element.setAttribute(attribute, selector.includes('=') ? selector.match(/="([^"]+)/)?.[1] ?? '' : '')
  element.content = value
}

const isBrandedCaseStudy = (
  section: PageSection,
): section is BrandedCaseStudySection =>
  (section.type === 'gallery' || section.type === 'split') &&
  section.variant === 'caseStudy' &&
  Boolean(section.brand)

function renderSections(sections: PageSection[], startTone: 'light' | 'dark' = 'light') {
  const renderedSections = []
  let caseStudyIndex = 0
  let toneOffset = 0

  for (let index = 0; index < sections.length;) {
    const section = sections[index]

    if (section && 'showOnPage' in section && section.showOnPage === false) {
      index += 1
      continue
    }

    if (section?.type === 'learningJourneyStep') {
      const startIndex = index
      const group: Extract<PageSection, { type: 'learningJourneyStep' }>[] = []
      while (sections[index]?.type === 'learningJourneyStep') {
        group.push(sections[index] as Extract<PageSection, { type: 'learningJourneyStep' }>)
        index += 1
      }
      renderedSections.push(<LearningJourneyGroup
        key={`${section.id}-journey`}
        sections={group}
        startIndex={startIndex - toneOffset}
        startTone={startTone}
      />)
      continue
    }

    if (section && isBrandedCaseStudy(section)) {
      const startSectionIndex = index
      const groupId = section.brand.groupId
      const group: BrandedCaseStudySection[] = []

      while (index < sections.length) {
        const candidate = sections[index]

        if (
          !candidate ||
          !isBrandedCaseStudy(candidate) ||
          candidate.brand.groupId !== groupId
        ) break

        group.push(candidate)
        index += 1
      }

      renderedSections.push(
        <CaseStudyGroup
          key={`${groupId}-${index}`}
          sections={group}
          startIndex={caseStudyIndex}
          startSectionIndex={startSectionIndex - toneOffset}
          startTone={startTone}
        />,
      )
      caseStudyIndex += group.length
      continue
    }

    if (section) {
      const tone = sectionTone(index - toneOffset, startTone)
      const isCaseStudy = (section.type === 'gallery' || section.type === 'split')
        && section.variant === 'caseStudy'
      const positionedSection = isCaseStudy
        ? section.type === 'split'
          ? { ...section, imagePosition: caseStudyIndex % 2 === 0 ? 'left' as const : 'right' as const }
          : { ...section, galleryPosition: caseStudyIndex % 2 === 0 ? 'left' as const : 'right' as const }
        : section
      renderedSections.push(<SectionRenderer key={section.id} section={positionedSection} tone={tone} />)
      if (isCaseStudy) caseStudyIndex += 1
      if ((section.type === 'teachingInstitutionCards' || section.type === 'learningJourneyClosing') && section.preserveNextTone) toneOffset += 1
    }
    index += 1
  }

  return renderedSections
}

export function App() {
  const { t, i18n } = useTranslation()
  const resolvedLanguage = i18n.resolvedLanguage
  const language = resolvedLanguage && isSupportedLanguage(resolvedLanguage)
    ? resolvedLanguage
    : defaultLanguage
  const pages = getPages(language)
  const [currentPath, setCurrentPath] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const handlePopState = () =>
      setCurrentPath(normalizePath(window.location.pathname))

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setCurrentPath(normalizePath(path))
    window.scrollTo(0, 0)
  }

  const page = pages.find((candidate) => candidate.path === currentPath)
  const firstSection = page?.sections.find(section => !('showOnPage' in section) || section.showOnPage !== false)
  const headerTone = firstSection && 'tone' in firstSection && firstSection.tone
    ? firstSection.tone
    : page?.startTone ?? 'light'

  useEffect(() => {
    document.documentElement.lang = language
    document.title = page?.title ?? t('errors.notFound')
    const title = document.title
    const description = pageDescription(page)
    const image = portraitImage
    setMeta('name="description"', 'name', description)
    setMeta('property="og:title"', 'property', title)
    setMeta('property="og:description"', 'property', description)
    setMeta('property="og:type"', 'property', 'website')
    setMeta('property="og:url"', 'property', window.location.href)
    setMeta('property="og:image"', 'property', image ? new URL(image, window.location.origin).href : '')
    setMeta('name="twitter:card"', 'name', 'summary_large_image')
    setMeta('name="twitter:title"', 'name', title)
    setMeta('name="twitter:description"', 'name', description)
    setMeta('name="twitter:image"', 'name', image ? new URL(image, window.location.origin).href : '')
  }, [language, page, t])

  return (
    <div className="site-theme" data-theme={page?.theme ?? 'default'} data-page-id={page?.id}>
      <Header
        tone={headerTone}
        pages={pages}
        currentPath={currentPath}
        onNavigate={navigate}
      />
      <main aria-label={t('accessibility.mainContent')}>
        {page ? (
          renderSections(page.sections, page.startTone)
        ) : (
          <h1>{t('errors.notFound')}</h1>
        )}
      </main>
      <Footer />
    </div>
  )
}
