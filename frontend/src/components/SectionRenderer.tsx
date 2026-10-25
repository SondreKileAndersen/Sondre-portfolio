import { ResearchStudyBlock } from './blocks/ResearchStudyBlock'
import { DevelopmentTimelineBlock } from './blocks/DevelopmentTimelineBlock'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
const ResearchVisualizationsBlock = lazy(() => import('./blocks/ResearchVisualizationsBlock').then(module => ({ default: module.ResearchVisualizationsBlock })))
function ResearchLoading() {
  const { t } = useTranslation()
  return <p role="status">{t('research.loading')}</p>
}
import type { PageSection } from '../types/page'
import { HeroBlock } from './blocks/HeroBlock'
import { ImageCompareBlock } from './blocks/ImageCompareBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { CardGridBlock } from './blocks/CardGridBlock'
import { PublicationListBlock } from './blocks/PublicationListBlock'
import { NavigationCardsBlock } from './blocks/NavigationCardsBlock'
import { ProcessBlock } from './blocks/ProcessBlock'
import { SplitBlock } from './blocks/SplitBlock'
import { TextBlock } from './blocks/TextBlock'
import { TeachingResourcesBlock } from './blocks/TeachingResourcesBlock'
import { TitleBlock } from './blocks/TitleBlock'
import { YouTubePlaylistBlock } from './blocks/YouTubePlaylistBlock'
import { ProjectDetailBlock } from './blocks/ProjectDetailBlock'
import { LogoMarqueeBlock } from './blocks/LogoMarqueeBlock'
import { InstitutionCardsBlock } from './blocks/InstitutionCardsBlock'
import { TeachingInstitutionCardsBlock } from './blocks/TeachingInstitutionCardsBlock'
import { LearningJourneyIntroBlock, LearningJourneyStepBlock, LearningJourneyClosingBlock } from './blocks/LearningJourneyBlock'
import { ContentSourceBoundary } from './ContentSourceBoundary'

type SectionRendererProps = {
  section: PageSection
  tone?: 'light' | 'dark'
}

export function SectionRenderer({ section, tone = 'light' }: SectionRendererProps) {
  const resolvedTone = 'tone' in section && section.tone ? section.tone : tone
  const block = renderBlock({ section, tone: resolvedTone })
  const content = import.meta.env.DEV
    ? <ContentSourceBoundary sectionId={section.id}>{block}</ContentSourceBoundary>
    : block
  const surface = 'surface' in section ? section.surface : undefined
  return <div className={`section-tone-boundary rendered-section--${resolvedTone}${surface === 'full' ? ' section-surface--full' : ''}${section.headingStyle === 'ruled' ? ' section-heading--ruled' : ''}`} data-section-id={section.id} data-heading-accent={section.headingAccent} data-section-background={section.background}>{content}</div>
}

function renderBlock({ section, tone }: SectionRendererProps) {
  switch (section.type) {
    case 'developmentTimeline':
      return <DevelopmentTimelineBlock {...section} />
    case 'researchVisualizations':
      return <Suspense fallback={<ResearchLoading />}><ResearchVisualizationsBlock {...section} /></Suspense>
    case 'researchStudy':
      return <ResearchStudyBlock {...section} />
    case 'imageCompare':
      return <ImageCompareBlock {...section} />
    case 'quote':
      return <QuoteBlock {...section} />
    case 'hero':
      return <HeroBlock {...section} />
    case 'title':
      return <TitleBlock {...section} />
    case 'split':
      return <SplitBlock {...section} />
    case 'text':
      return <TextBlock {...section} />
    case 'gallery':
      return <GalleryBlock {...section} />
    case 'cardGrid':
      return <CardGridBlock {...section} />
    case 'publicationList':
      return <PublicationListBlock {...section} />
    case 'navigationCards':
      return <NavigationCardsBlock {...section} />
    case 'institutionCards':
      return <InstitutionCardsBlock {...section} tone={tone} />
    case 'teachingInstitutionCards':
      return <TeachingInstitutionCardsBlock {...section} tone={tone} />
    case 'learningJourneyIntro':
      return <LearningJourneyIntroBlock {...section} />
    case 'learningJourneyStep':
      return <LearningJourneyStepBlock {...section} />
    case 'learningJourneyClosing':
      return <LearningJourneyClosingBlock {...section} />
    case 'process':
      return <ProcessBlock {...section} />
    case 'youtubePlaylist':
      return <YouTubePlaylistBlock {...section} />
    case 'teachingResources':
      return <TeachingResourcesBlock {...section} />
    case 'projectDetail':
      return <ProjectDetailBlock {...section} />
    case 'logoMarquee':
      return <LogoMarqueeBlock {...section} />
  }
}
