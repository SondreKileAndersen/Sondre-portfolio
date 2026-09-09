export type TeachingResourceFormat =
  | 'pdf'
  | 'video'
  | 'presentation'
  | 'other'

export type TeachingResourceCategory = {
  id: string
  folder: string
  title: string
  description?: string
}

export type TeachingResourceDocument = Omit<TeachingResource, 'categoryId'> & {
  /** @deprecated Category is derived from the first folder below the locale. */
  categoryId?: string
}

export type TeachingResourceTool = {
  id: string
  name: string
  logoSrc?: string
  sourceUrl?: string
}

export type TeachingResourceFile = {
  id: string
  label: string
  url: string
  download?: boolean
}

export type TeachingResource = {
  id: string
  categoryId: string
  title: string
  description: string
  format: TeachingResourceFormat
  typeLabel: string
  thumbnailSrc: string
  thumbnailAlt: string
  tools: TeachingResourceTool[]
  files?: TeachingResourceFile[]
  /** @deprecated Use `files` for new and updated resources. */
  resourceUrl?: string
}
