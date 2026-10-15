import type { PortfolioPage } from '../types/page'
import type { Language } from '../i18n/config'
import type { ProjectPageDefinition } from '../data/projects/createProjectPage'
import type { TeachingResource, TeachingResourceCategory } from '../types/teachingResource'
import { recordContentSource } from './contentSource'

type LocalizedField =
  | 'slug' | 'path' | 'navTitle' | 'title' | 'heading' | 'headingHighlight' | 'groupHeading' | 'eyebrow'
  | 'introduction' | 'paragraphs' | 'detailParagraphs' | 'items' | 'note' | 'notice'
  | 'alt' | 'imageAlt' | 'secondaryImageAlt' | 'logoAlt' | 'caption' | 'label' | 'text'
  | 'role' | 'roles' | 'period' | 'lead' | 'body' | 'prefix' | 'examplesLabel' | 'description' | 'value' | 'actionLabel' | 'actionHref' | 'ctaLabel' | 'href'
  | 'subjectsLabel' | 'subjects' | 'outcome'
  | 'specializationsLabel' | 'specializations'
  | 'iframeTitle' | 'firstVideoTitle' | 'videoLabel'
  | 'categoryLabel' | 'typeLabel' | 'thumbnailAltPrefix' | 'openPlaylistLabel' | 'playlistUrl'
  | 'quote' | 'footer'

type TextReference<K extends string = string, F extends 'text' | 'paragraphs' = 'text' | 'paragraphs'> = {
  readonly $text: K
  readonly format: F
}

export function text<const K extends string>(key: K): TextReference<K, 'text'> {
  return { $text: key, format: 'text' }
}

export function paragraphs<const K extends string>(key: K): TextReference<K, 'paragraphs'> {
  return { $text: key, format: 'paragraphs' }
}

export type ContentCollections = {
  teachingResources: TeachingResource[]
  teachingResourceCategories: TeachingResourceCategory[]
}

export function collection<const K extends keyof ContentCollections>(name: K): { readonly $collection: K } {
  return { $collection: name }
}

// Rendering settings and stable IDs stay literal; localized fields must be references.
export type SharedStructure<T> = T extends readonly (infer U)[]
  ? readonly SharedStructure<U>[] | { readonly $collection: keyof ContentCollections }
  : T extends object
    ? { readonly [K in keyof T]: K extends LocalizedField
        ? TextReference<string, NonNullable<T[K]> extends readonly string[] ? 'paragraphs' : 'text'>
        : SharedStructure<T[K]> }
    : T

export type PageStructure = SharedStructure<PortfolioPage>
export type ProjectStructure = SharedStructure<ProjectPageDefinition>

type ReferenceEntries<S> = S extends TextReference<infer K, infer F>
  ? { key: K; value: F extends 'paragraphs' ? string[] : string }
  : S extends { readonly $collection: string } ? never
  : S extends readonly (infer U)[] ? ReferenceEntries<U>
  : S extends object ? { [K in keyof S]: ReferenceEntries<S[K]> }[keyof S]
  : never

// Both language files use this type. Keys are derived from the one shared structure.
type EntriesToContent<E extends { key: string; value: unknown }> = {
  [K in E['key']]: Extract<E, { key: K }>['value']
}
export type ContentFor<S> = EntriesToContent<Extract<ReferenceEntries<S>, { key: string; value: unknown }>>

type Resolved<S> = S extends TextReference<string, infer F>
  ? F extends 'paragraphs' ? string[] : string
  : S extends { readonly $collection: infer K extends keyof ContentCollections } ? ContentCollections[K]
  : S extends readonly (infer U)[] ? Resolved<U>[]
  : S extends object ? { -readonly [K in keyof S]: Resolved<S[K]> }
  : S

export function composeContent<const S>(
  structure: S,
  content: ContentFor<S>,
  collections: Partial<ContentCollections> = {},
): Resolved<S> {
  const translations = content as unknown as Record<string, unknown>
  const resolve = (node: unknown, scopes: string[] = []): unknown => {
    if (Array.isArray(node)) return node.map(item => resolve(item, scopes))
    if (node === null || typeof node !== 'object') return node
    if ('$text' in node) {
      const reference = node as TextReference
      const value = translations[reference.$text]
      const valid = reference.format === 'paragraphs'
        ? Array.isArray(value) && value.every((item) => typeof item === 'string')
        : typeof value === 'string'
      if (!valid) throw new Error(`Missing or invalid page text: ${reference.$text}`)
      recordContentSource(content, reference.$text, value, scopes)
      return Array.isArray(value) ? [...value] : value
    }
    if ('$collection' in node) {
      const name = (node as { $collection: keyof ContentCollections }).$collection
      const value = collections[name]
      if (!value) throw new Error(`Missing content collection: ${name}`)
      return value
    }
    const nextScopes = 'id' in node && typeof node.id === 'string' ? [...scopes, node.id] : scopes
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolve(value, nextScopes)]))
  }
  return resolve(structure) as Resolved<S>
}

// Adding a supported language requires complete content, not another structure.
export function localizedContent<const S>(
  structure: S,
  translations: Record<Language, ContentFor<S>>,
) {
  return (language: Language, collections: Partial<ContentCollections> = {}): Resolved<S> =>
    composeContent(structure, translations[language], collections)
}
