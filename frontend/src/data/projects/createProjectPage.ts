import type {
  GallerySection,
  PortfolioPage,
  ProjectDetailSection,
  ProjectMetadataItem,
  SplitSection,
} from '../../types/page'

export type ProjectSourceSection = GallerySection | SplitSection

export type ProjectPageDefinition = {
  excludedGalleryImageIds?: string[]
  showPreviewImage?: boolean
  startTone?: 'light' | 'dark'
  id: string
  slug: string
  path: string
  title: string
  sourceSectionId: string
  sourcePageId: string
  eyebrow: string
  introduction?: string
  metadata: ProjectMetadataItem[]
}

export function createProjectPage(
  definition: ProjectPageDefinition,
  source: ProjectSourceSection,
): PortfolioPage {
  const isGallery = source.type === 'gallery'
  const previewImage = isGallery
    ? source.images[0]
    : {
        id: `${source.id}-preview`,
        src: source.imageSrc,
        alt: source.imageAlt,
        caption: source.caption ?? '',
        imageFit: source.imageFit,
        objectPosition: source.objectPosition,
      }

  if (!previewImage) {
    throw new Error(`Project source "${source.id}" has no preview image.`)
  }

  const detailSection: ProjectDetailSection = {
    id: `${definition.id}-detail`,
    type: 'projectDetail',
    eyebrow: definition.eyebrow,
    heading: definition.title,
    introduction: definition.introduction,
    metadata: definition.metadata,
    previewImage,
    showPreviewImage: definition.showPreviewImage,
    paragraphs: source.detailParagraphs ?? source.paragraphs,
    outcome: source.outcome,
    gallery: isGallery
      ? source.images.slice(1).filter(image => !definition.excludedGalleryImageIds?.includes(image.id))
      : undefined,
  }

  return {
    startTone: definition.startTone ?? 'light',
    id: definition.id,
    slug: definition.slug,
    path: definition.path,
    navTitle: definition.title,
    title: definition.title,
    parentId: 'projects',
    showInNav: false,
    sections: [detailSection],
  }
}
