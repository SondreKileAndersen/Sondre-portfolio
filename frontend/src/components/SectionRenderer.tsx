import type { PageSection } from '../types/page'
import { HeroBlock } from './blocks/HeroBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { CardGridBlock } from './blocks/CardGridBlock'
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
  return <div className={`section-tone-boundary rendered-section--${resolvedTone}`}>{content}</div>
}

function renderBlock({ section, tone }: SectionRendererProps) {
  switch (section.type) {
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
