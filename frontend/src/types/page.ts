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
  | 'books'
  | 'conversation'
  | 'shieldLock'
  | 'arrowUp'
  | 'check'
  | 'lightbulb'
  | 'headphones'
  | 'palette'
  | 'pointer'
  | 'film'
  | 'cube'
  | 'workflow'
  | 'database'
  | 'document'
  | 'people'
  | 'monitor'
  | 'search'
  | 'camera'
  | 'settings'

export type CaseStudyGroupSettings = {
  id: string
  sharedSurface?: boolean
}

export type ToolLogo = {
  id: string
  src: string
  alt: string
}

export type HeroSection = {
  id: string
  type: 'hero'
  tone?: 'light' | 'dark'
  heading: string
  headingHighlight?: string
  paragraphLayout?: 'equalWidthLines'
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
  paragraphs: string[]
  actions?: Array<{ id: string; label: string; href: string; icon?: 'arrowDown' }>
}

export type SplitSection = {
  layout?: 'split' | 'stacked' | 'showcase' | 'coverIntro'
  callout?: {
    theme?: 'yellow'
    heading?: string
    label?: string
    icon?: LineIconName
    text: string
    action?: { label: string; href: string; external?: boolean }
  }
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
  objectPosition?: string
  secondaryImageSrc?: string
  secondaryImageAlt?: string
  imageStrip?: Array<{ id: string; src: string; alt: string; objectPosition?: string }>
  variant?: 'default' | 'caseStudy'
  eyebrow?: string
  tone?: 'light' | 'dark'
  note?: string
  actionLabel?: string
  actionHref?: string
  actionExternal?: boolean
  actionAfterParagraph?: number
  actions?: Array<{ id: string; label: string; href: string; external?: boolean }>
  caseStudyGroup?: CaseStudyGroupSettings
  toolLogos?: ToolLogo[]
  outcome?: string
}

export type TextSection = {
  id: string
  type: 'text'
  surface?: 'full' | 'inset'
  tone?: 'light' | 'dark'
  heading?: string
  paragraphs: string[]
  items?: string[]
  variant?: 'default' | 'principles' | 'cta' | 'education'
  eyebrow?: string
  leadImage?: {
    src: string
    alt: string
    width?: number
    height?: number
    fetchPriority?: 'high' | 'low' | 'auto'
    zoom?: number
    positionX?: number
    positionY?: number
    flipHorizontal?: boolean
  }
  introSequence?: boolean
  features?: Array<{
    id: string
    heading: string
    description: string
    icon: LineIconName
    iconTone?: 'blue' | 'yellow' | 'green'
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
  objectPosition?: string
  cropX?: number
}

export type GallerySection = {
  showOnPage?: boolean
  visualTransition?: {
    steps: Array<{
      id: string
      src: string
      alt: string
      iconTone?: 'blue' | 'green'
    }>
  }
  autoplay?: boolean
  interval?: number
  galleryMode?: 'default' | 'rotatingGrid' | 'featureMosaic' | 'maskedPanels' | 'portraitStrip'
  displayImageIds?: string[]
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
  caseStudyGroup?: CaseStudyGroupSettings
  toolLogos?: ToolLogo[]
  outcome?: string
}

export type ProjectMetadataItem = {
  id: string
  label: string
  value: string
}

export type ProjectDetailSection = {
  id: string
  type: 'projectDetail'
  eyebrow?: string
  heading: string
  introduction?: string
  metadata: ProjectMetadataItem[]
  previewImage: GalleryImage
  showPreviewImage?: boolean
  paragraphs: string[]
  gallery?: GalleryImage[]
  outcome?: string
}

export type CardItem = {
  id: string
  title: string
  text?: string
  imageSrc?: string
  imageAlt?: string
  items?: string[]
  label?: string
  tags?: string[]
  actionLabel?: string
  href?: string
}

export type CardGridSection = {
  id: string
  type: 'cardGrid'
  heading?: string
  cards: CardItem[]
}

export type NavigationCardsSection = {
  id: string
  type: 'navigationCards'
  tone?: 'light' | 'dark'
  cards: Array<{
    id: string
    title: string
    description: string
    href: string
    imageSrc: string
  }>
}

export type InstitutionCard = {
  id: string
  title: string
  period?: string
  role: string
  description: string
  logoSrc: string
  logoAlt: string
  highlights: Array<{ id: string; label: string; icon: LineIconName }>
}

export type InstitutionCardsSection = {
  appearance?: 'default' | 'branded'
  id: string
  type: 'institutionCards'
  cards: InstitutionCard[]
}

export type TeachingInstitutionCardsSection = {
  appearance?: 'default' | 'branded'
  id: string
  type: 'teachingInstitutionCards'
  variant?: 'three' | 'four'
  preserveNextTone?: boolean
  subjectsLabel: string
  cards: Array<{
    id: string
    title: string
    period: string
    roles: string[]
    logoSrc: string
    logoAlt: string
    subjects: string[]
  }>
}

export type LearningJourneyIntroSection = {
  id: string
  type: 'learningJourneyIntro'
  tone?: 'light' | 'dark'
  eyebrow?: string
  heading: string
  paragraphs: string[]
  specializationsLabel?: string
  specializations?: Array<{ id: string; label: string; icon: LineIconName }>
  imageSrc: string
  imageAlt: string
}

export type LearningJourneyStepSection = {
  lineAnchorX?: number
  id: string
  type: 'learningJourneyStep'
  tone?: 'light' | 'dark'
  groupHeading?: string
  number: string
  variant?: 'default' | 'accented'
  inlineParagraphs?: Array<{ id: string; parts: Array<{ id: string; text: string; categoryId?: string; emphasis?: boolean }> }>
  eyebrow?: string
  heading?: string
  paragraphs?: string[]
  lead?: string
  body?: string
  examplesLabel?: string
  examples?: Array<{ id: string; categoryId: string; prefix?: string; label: string; description: string }>
  ctaLabel?: string
  imagePosition: 'left' | 'right'
  visual: 'starterCards' | 'image' | 'mosaic' | 'resourceScreen'
  imageSrc?: string
  imageAlt?: string
  imageFit?: 'cover' | 'contain'
  images?: GalleryImage[]
  resources?: TeachingResource[]
  previewResourceId?: string
  cards?: Array<{
    id: string
    resourceId?: string
    title?: string
    label?: string
    imageSrc?: string
    imageAlt?: string
    categoryId: string
    logoSrc?: string
    plainMedia?: boolean
    stackZ?: number
    enterDelay?: number
  }>
  footerImage?: { src: string; alt: string }
  highlights?: Array<{
    id: string
    heading: string
    variant?: 'default' | 'callout'
    label?: string
    description?: string
    descriptionParts?: Array<{ id: string; text: string; resourceId?: string }>
  }>
  screenItems?: Array<{ id: string; title: string; label: string; icon: LineIconName }>
}

export type LearningJourneyClosingSection = {
  id: string
  type: 'learningJourneyClosing'
  showOnPage?: boolean
  tone?: 'light' | 'dark'
  preserveNextTone?: boolean
  eyebrow?: string
  quote: string
  footer?: string
  imageSrc: string
  imageAlt: string
}

export type ProcessStep = {
  id: string
  columnSpan?: number
  label: string
  description: string
  image?: { src: string; alt: string; mobileSrc?: string; overlay?: { src: string; alt: string } }
}

export type ProcessSection = {
  id: string
  type: 'process'
  variant?: 'default' | 'grid' | 'horizontalCards'
  heading: string
  paragraphs: string[]
  steps: ProcessStep[]
  outcome?: string
}

export type LogoMarqueeSection = {
  id: string
  type: 'logoMarquee'
  tone?: 'light' | 'dark'
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
  introduction?: string[]
  notice?: string
  categories: TeachingResourceCategory[]
  resources: TeachingResource[]
}

export type YouTubePlaylistSection = {
  id: string
  type: 'youtubePlaylist'
  tone?: 'light' | 'dark'
  eyebrow?: string
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

export type QuoteSection = {
  showOnPage?: boolean
  id: string
  type: 'quote'
  heading: string
  quote: string
  title: string
  role: string
  imageSrc: string
  imageAlt: string
}

export type ImageCompareSection = {
  id: string
  type: 'imageCompare'
  tone?: 'light' | 'dark'
  heading: string
  introduction?: string
  groups: Array<{
    id: string
    heading: string
    images: Array<{ id: 'before' | 'after'; src: string; alt: string; label?: string }>
  }>
}

export type SectionPresentation = {
  background?: 'subtle'
  tone?: 'light' | 'dark'
  headingStyle?: 'ruled'
  headingAccent?: 'green' | 'yellow' | 'blue' | 'light-blue' | 'turquoise'
}

export type PublicationListSection = {
  id: string
  type: 'publicationList'
  heading: string
  publications: Array<{
    id: string
    title: string
    authors: string[]
    status: string
    label: string
    items?: string[]
    tags?: string[]
  }>
}

export type ResearchStudySection = {
 id:string; type:'researchStudy'; parts:Array<{
 id:string; label:string; heading:string; subtitle?:string; description?:string; paragraphs:string[]; variant?:'cover';
 premise?:{heading?:string};
 question?:{label:string;text:string;footnote?:{label:string;text:string}}; abstract?:{label:string;text:string};
 norwegianAbstract?:{label:string;text:string};
 practical?:{text:string;prefix:string;label:string;href:string;description:string};
 facts?:Array<{id:string;icon:LineIconName;label:string}>;
 factsAppearance?:'compact';
 findings?:Array<{id:string;momentId?:string;iconSrc?:string;label:string;text:string}>; outcome?:string;
 visualization?: ResearchVisualizationsSection;
 illustration?: DevelopmentTimelineSection;
 image?:{src?:string;file:string;alt:string;href?:string;caption?:string;position?:'right';variant:'document'|'landscape'}
 }>
}
export type ResearchVisualizationsSection = {
  id: string
  type: 'researchVisualizations'
  datasetId: 'master'
  presentation?: 'overview'
  heading: string
  paragraphs: string[]
  views: Array<{ id: string; kind: 'concepts' | 'relations' | 'comparison' | 'process'; heading: string; paragraphs: string[] }>
}
export type DevelopmentTimelineSection = {
  id: string
  type: 'developmentTimeline'
  heading: string
  labels: Array<{ id: string; iconSrc: string; label: string }>
  stages: Array<{ id: string; label: string; note?: string; focus?: { label: string }; src: string; alt: string; items?: string[]; appearance: 'solid' | 'outline'; caption?: string }>
}
export type PageSection = (
 | DevelopmentTimelineSection
 | ResearchVisualizationsSection
 | ResearchStudySection
  | PublicationListSection
  | ImageCompareSection
  | QuoteSection
  | TitleSection
  | HeroSection
  | SplitSection
  | TextSection
  | GallerySection
  | CardGridSection
  | NavigationCardsSection
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
) & SectionPresentation

export type PortfolioPage = {
  theme?: 'green' | 'yellow' | 'blue' | 'light-blue'
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
