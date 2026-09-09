import type {
  TeachingResource,
  TeachingResourceCategory,
} from './teachingResource'

export type TitleSection = {
  id: string
  type: 'title'
  heading: string
}

export type HeroSection = {
  id: string
  type: 'hero'
  heading: string
  imageSrc: string
  imageAlt: string
  paragraphs: string[]
}

export type SplitSection = {
  id: string
  type: 'split'
  heading?: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
  caption?: string
  imagePosition: 'left' | 'right'
  imageFit?: 'cover' | 'contain'
}

export type TextSection = {
  id: string
  type: 'text'
  heading?: string
  paragraphs: string[]
  items?: string[]
}

export type GalleryImage = {
  id: string
  src: string
  alt: string
  caption: string
  imageFit?: 'cover' | 'contain'
}

export type GallerySection = {
  id: string
  type: 'gallery'
  heading: string
  paragraphs: string[]
  images: GalleryImage[]
  galleryPosition: 'left' | 'right'
}

export type CardItem = {
  id: string
  title: string
  text: string
  imageSrc: string
  imageAlt: string
  actionLabel?: string
  href?: string
}

export type CardGridSection = {
  id: string
  type: 'cardGrid'
  heading?: string
  cards: CardItem[]
}

export type ProcessStep = {
  id: string
  label: string
  description: string
}

export type ProcessSection = {
  id: string
  type: 'process'
  heading: string
  paragraphs: string[]
  steps: ProcessStep[]
}

export type TeachingResourcesSection = {
  id: string
  type: 'teachingResources'
  heading: string
  introduction?: string
  categories: TeachingResourceCategory[]
  resources: TeachingResource[]
}

export type YouTubePlaylistSection = {
  id: string
  type: 'youtubePlaylist'
  heading: string
  introduction: string
  playlistId: string
  playlistUrl: string
  iframeTitle: string
  firstVideoId: string
  firstVideoTitle: string
  listHeading: string
  videoLabel: string
  thumbnailAltPrefix: string
  openPlaylistLabel: string
}

export type PageSection =
  | TitleSection
  | HeroSection
  | SplitSection
  | TextSection
  | GallerySection
  | CardGridSection
  | ProcessSection
  | YouTubePlaylistSection
  | TeachingResourcesSection

export type PortfolioPage = {
  id: string
  slug: string
  path: string
  navTitle: string
  title: string
  showInNav?: boolean
  parentId?: string
  sections: PageSection[]
}
