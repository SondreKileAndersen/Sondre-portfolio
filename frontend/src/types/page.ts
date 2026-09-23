import type {
  TeachingResource,
  TeachingResourceCategory,
} from './teachingResource'

export type TitleSection = {
  id: string
  type: 'title'
  heading: string
  variant?: 'default' | 'editorial'
  eyebrow?: string
  introduction?: string
  collageImages?: Array<{
    id: string
    src: string
    alt: string
  }>
  note?: string
  highlights?: Array<{
    id: string
    label: string
    icon: LineIconName
  }>
}

export type LineIconName =
  | 'cube'
  | 'workflow'
  | 'database'
  | 'document'
  | 'people'
  | 'search'
  | 'camera'
  | 'settings'

export type BrandMark = {
  groupId: string
  src: string
  alt: string
  crop?: 'none' | 'oslomet-symbol'
}

export type ToolLogo = {
  id: string
  src: string
  alt: string
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
  showOnPage?: boolean
  id: string
  type: 'split'
  heading?: string
  paragraphs: string[]
  detailParagraphs?: string[]
  imageSrc: string
  imageAlt: string
  caption?: string
  imagePosition?: 'left' | 'right'
  imageFit?: 'cover' | 'contain'
  secondaryImageSrc?: string
  secondaryImageAlt?: string
  variant?: 'default' | 'caseStudy'
  eyebrow?: string
  tone?: 'light' | 'dark'
  note?: string
  actionLabel?: string
  actionHref?: string
  brand?: BrandMark
  toolLogos?: ToolLogo[]
}

export type TextSection = {
  id: string
  type: 'text'
  heading?: string
  paragraphs: string[]
  items?: string[]
  variant?: 'default' | 'principles' | 'cta'
  eyebrow?: string
  leadImage?: {
    src: string
    alt: string
    width?: number
    height?: number
    fetchPriority?: 'high' | 'low' | 'auto'
  }
  features?: Array<{
    id: string
    heading: string
    description: string
    icon: LineIconName
  }>
  actionLabel?: string
  actionHref?: string
}

export type GalleryImage = {
  id: string
  src: string
  alt: string
  caption: string
  imageFit?: 'cover' | 'contain'
}

export type GallerySection = {
  showOnPage?: boolean
  visualTransition?: {
    steps: Array<{
      id: string
      src: string
      alt: string
    }>
  }
  autoplay?: boolean
  interval?: number
  galleryMode?: 'default' | 'rotatingGrid' | 'featureMosaic'
  id: string
  type: 'gallery'
  heading: string
  paragraphs: string[]
  detailParagraphs?: string[]
  images: GalleryImage[]
  galleryPosition?: 'left' | 'right'
  variant?: 'default' | 'caseStudy'
  eyebrow?: string
  tone?: 'light' | 'dark'
  note?: string
  actionLabel?: string
  actionHref?: string
  brand?: BrandMark
  toolLogos?: ToolLogo[]
}

export type ProjectMetadataItem = {
  id: string
  label: string
  value: string
}

export type ProjectDetailSection = {
  id: string
  type: 'projectDetail'
  eyebrow: string
  heading: string
  introduction?: string
  metadata: ProjectMetadataItem[]
  previewImage: GalleryImage
  paragraphs: string[]
  gallery?: GalleryImage[]
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

export type InstitutionCard = {
  id: string
  title: string
  role: string
  description: string
  logoSrc: string
  logoAlt: string
  highlights: Array<{ id: string; label: string; icon: LineIconName }>
}

export type InstitutionCardsSection = {
  id: string
  type: 'institutionCards'
  cards: InstitutionCard[]
}

export type TeachingInstitutionCardsSection = {
  id: string
  type: 'teachingInstitutionCards'
  preserveNextTone?: boolean
  subjectsLabel: string
  cards: Array<{
    id: string
    title: string
    role: string
    logoSrc: string
    logoAlt: string
    subjects: string[]
  }>
}

export type LearningJourneyIntroSection = {
  id: string
  type: 'learningJourneyIntro'
  eyebrow: string
  heading: string
  paragraphs: string[]
  imageSrc: string
  imageAlt: string
}

export type LearningJourneyStepSection = {
  id: string
  type: 'learningJourneyStep'
  number: string
  eyebrow: string
  heading: string
  paragraphs: string[]
  imagePosition: 'left' | 'right'
  visual: 'starterCards' | 'image' | 'mosaic' | 'resourceScreen'
  imageSrc?: string
  imageAlt?: string
  imageFit?: 'cover' | 'contain'
  images?: GalleryImage[]
  cards?: Array<{ id: string; title: string; label: string; imageSrc: string; categoryId: string; logoSrc?: string }>
  highlights?: Array<{ id: string; heading: string; description: string }>
  screenItems?: Array<{ id: string; title: string; label: string; icon: LineIconName }>
}

export type LearningJourneyClosingSection = {
  id: string
  type: 'learningJourneyClosing'
  tone?: 'light' | 'dark'
  preserveNextTone?: boolean
  eyebrow: string
  quote: string
  footer: string
  imageSrc: string
  imageAlt: string
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

export type LogoMarqueeSection = {
  id: string
  type: 'logoMarquee'
  heading?: string
  introduction?: string
  logos: Array<{
    id: string
    src: string
    alt: string
  }>
}

export type TeachingResourcesSection = {
  id: string
  type: 'teachingResources'
  tone?: 'light' | 'dark'
  heading: string
  introduction?: string
  categories: TeachingResourceCategory[]
  resources: TeachingResource[]
}

export type YouTubePlaylistSection = {
  id: string
  type: 'youtubePlaylist'
  tone?: 'light' | 'dark'
  eyebrow: string
  heading: string
  introduction: string
  playlistId: string
  playlistUrl: string
  iframeTitle: string
  firstVideoId: string
  firstVideoTitle: string
  videoLabel: string
  categoryLabel: string
  thumbnailAltPrefix: string
  openPlaylistLabel: string
  videos: Array<{
    id: string
    videoId: string
    title: string
  }>
}

export type PageSection =
  | TitleSection
  | HeroSection
  | SplitSection
  | TextSection
  | GallerySection
  | CardGridSection
  | InstitutionCardsSection
  | TeachingInstitutionCardsSection
  | LearningJourneyIntroSection
  | LearningJourneyStepSection
  | LearningJourneyClosingSection
  | ProcessSection
  | LogoMarqueeSection
  | YouTubePlaylistSection
  | TeachingResourcesSection
  | ProjectDetailSection

export type PortfolioPage = {
  startTone?: 'light' | 'dark'
  id: string
  slug: string
  path: string
  navTitle: string
  title: string
  showInNav?: boolean
  parentId?: string
  sections: PageSection[]
}
