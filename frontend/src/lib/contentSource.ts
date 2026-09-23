type Source = { file: string; key: string; scopes: string[]; field: string }
const files = new WeakMap<object, string>()
const sources = new Map<string, Source[]>()
const structureSources = new Map<string, Source[]>()

const mediaFields = new Set(['src', 'imageSrc', 'logoSrc'])

export function registerContentFiles(modules: Record<string, Record<string, object>>) {
  if (!import.meta.env.DEV) return
  for (const [path, module] of Object.entries(modules)) {
    const language = path.split('/').at(-1)?.replace(/\.ts$/, '') ?? ''
    const content = module[language]
    if (content) files.set(content, `src/data/pages/${path.replace(/^\.\//, '')}`)
  }
}

export function registerStructureFiles(modules: Record<string, Record<string, object>>) {
  if (!import.meta.env.DEV) return
  for (const [path, module] of Object.entries(modules)) {
    const structure = module.structure
    if (!structure) continue
    const file = `src/data/pages/${path.replace(/^\.\//, '')}`
    indexStructure(structure, file)
  }
}

function indexStructure(node: unknown, file: string, path: string[] = [], scopes: string[] = []) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const id = item && typeof item === 'object' && 'id' in item && typeof item.id === 'string'
        ? item.id
        : undefined
      indexStructure(item, file, id ? [...path, id] : path, id ? [...scopes, id] : scopes)
    }
    return
  }
  if (!node || typeof node !== 'object') return
  for (const [field, value] of Object.entries(node)) {
    const keyPath = [...path, field]
    if (mediaFields.has(field) && typeof value === 'string') {
      const entries = structureSources.get(value) ?? []
      entries.push({ file, key: keyPath.join('.'), scopes, field })
      structureSources.set(value, entries)
    }
    indexStructure(value, file, keyPath, scopes)
  }
}

export function recordContentSource(content: object, key: string, value: unknown, scopes: string[]) {
  if (!import.meta.env.DEV) return
  const file = files.get(content)
  if (!file) return
  const field = key.split('.').at(-1) ?? key
  for (const item of Array.isArray(value) ? value : [value]) {
    if (typeof item !== 'string' || !item.trim()) continue
    const normalized = item.replace(/\s+/g, ' ').trim()
    const entries = sources.get(normalized) ?? []
    if (!entries.some(entry => entry.file === file && entry.key === key)) {
      entries.push({ file, key, scopes, field })
      sources.set(normalized, entries)
    }
  }
}

export function traceContent(root: HTMLElement, sectionId: string) {
  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    if (element.tagName === 'IMG') {
      const rawSource = element.getAttribute('src') ?? ''
      let imageSources = structureSources.get(rawSource) ?? []
      const scopedImages = imageSources.filter(source => source.scopes.includes(sectionId))
      if (scopedImages.length) imageSources = scopedImages
      if (imageSources.length) {
        element.setAttribute('data-structure-file', [...new Set(imageSources.map(source => source.file))].join(' | '))
        element.setAttribute('data-structure-key', [...new Set(imageSources.map(source => source.key))].join(' | '))
      }
    }
    // Label only the element owning the text, not every ancestor containing it.
    const ownText = [...element.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent).join(' ').replace(/\s+/g, ' ').trim()
    const value = ownText || element.getAttribute('alt') || ''
    let candidates = sources.get(value) ?? []
    if (!candidates.length && /^(H1|H2|P|STRONG|SPAN|A|LI|FIGCAPTION)$/.test(element.tagName)) {
      const combined = (element.textContent ?? '').replace(/\s+/g, ' ').trim()
      candidates = sources.get(combined) ?? []
    }
    const scoped = candidates.filter(source => source.scopes.includes(sectionId))
    if (scoped.length) candidates = scoped
    const classField = (element.getAttribute('class') ?? '').match(/__(role|description|caption|eyebrow|introduction|title|heading|label)\b/)?.[1]
    if (classField) {
      const matching = candidates.filter(source => source.field === classField)
      if (matching.length) candidates = matching
    }
    if (!candidates.length) continue
    // Never silently guess when identical text has several possible sources.
    const files = [...new Set(candidates.map(source => source.file))].join(' | ')
    const keys = [...new Set(candidates.map(source => source.key))].join(' | ')
    element.setAttribute('data-content-file', files)
    element.setAttribute('data-content-key', keys)
  }
}
