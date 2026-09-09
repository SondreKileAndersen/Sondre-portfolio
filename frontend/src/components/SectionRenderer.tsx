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

type SectionRendererProps = {
  section: PageSection
}

export function SectionRenderer({ section }: SectionRendererProps) {
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
    case 'process':
      return <ProcessBlock {...section} />
    case 'youtubePlaylist':
      return <YouTubePlaylistBlock {...section} />
    case 'teachingResources':
      return <TeachingResourcesBlock {...section} />
  }
}
