const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

// Exercise the actual TypeScript data and composer without React or a browser.
const root = path.resolve(__dirname, '..')
const cache = new Map()
const collections = { teachingResources: [], teachingResourceCategories: [] }
function load(file) {
  file = path.resolve(file)
  if (!fs.existsSync(file)) {
    file = fs.existsSync(file + '.ts') ? file + '.ts' : path.join(file, 'index.ts')
  }
  if (file.includes(path.join('data', 'teachingResources', 'no')) && !file.endsWith('toolCatalog.ts')) return collections
  if (!file.endsWith('.ts')) return { __esModule: true, default: `ASSET:${path.relative(path.join(root, 'src'), file).replaceAll('\\', '/')}` }
  if (cache.has(file)) return cache.get(file)
  const exports = {}
  cache.set(file, exports)
  const source = fs.readFileSync(file, 'utf8')
    .replace(/import\.meta\.env\.DEV/g, 'false')
    .replace(/import\.meta\.glob<Record<string, object>>\([^\n]+\)/g, '{}')
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  vm.runInNewContext(output, {
    exports,
    require: location => load(path.resolve(path.dirname(file), location)),
    Map,
  }, { filename: file })
  return exports
}

const { composeContent, text, paragraphs } = load(path.join(root, 'src/lib/pageContent.ts'))
const { sectionTone } = load(path.join(root, 'src/lib/sectionTone.ts'))
assert.equal(sectionTone(0), 'light')
assert.equal(sectionTone(0, 'dark'), 'dark')
assert.equal(sectionTone(1, 'dark'), 'light')
assert.equal(sectionTone(2, 'dark'), 'dark')
for (let index = 1; index < 20; index++) assert.notEqual(sectionTone(index), sectionTone(index - 1))
// Development-only tracing: duplicate text across sections, SVG and multiline titles.
const tracingExports = {}
const tracingSource = fs.readFileSync(path.join(root, 'src/lib/contentSource.ts'), 'utf8')
  .replace(/import\.meta\.env\.DEV/g, 'true')
vm.runInNewContext(ts.transpileModule(tracingSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { exports: tracingExports, Node: { TEXT_NODE: 3 } })
const tracing = tracingExports
const translation = {}
tracing.registerContentFiles({ './example/no.ts': { no: translation } })
tracing.recordContentSource(translation, 'section.one.role', 'Same text', ['one'])
tracing.recordContentSource(translation, 'section.two.role', 'Same text', ['two'])
tracing.recordContentSource(translation, 'section.one.heading', 'Two lines', ['one'])
const fakeElement = (tagName, text, className = '', ownText = text) => ({
  tagName, textContent: text,
  childNodes: ownText ? [{ nodeType: 3, textContent: ownText }] : [],
  attrs: { class: className },
  getAttribute(name) { return this.attrs[name] ?? null },
  setAttribute(name, value) { this.attrs[name] = value },
})
const role = fakeElement('P', 'Same text', 'institution-card__role')
const svg = fakeElement('svg', '')
const heading = fakeElement('H2', 'Two\nlines', '', '')
const image = fakeElement('IMG', '')
image.attrs.src = '/src/media/example.jpg'
image.attrs.alt = 'Same text'
tracing.registerStructureFiles({ './example/structure.ts': { structure: {
  sections: [{ id: 'one', type: 'split', imageSrc: '/src/media/example.jpg' }],
} } })
tracing.traceContent({ querySelectorAll: () => [role, svg, heading, image] }, 'one')
assert.equal(role.attrs['data-content-file'], 'src/data/pages/example/no.ts')
assert.equal(role.attrs['data-content-key'], 'section.one.role')
assert.equal(heading.attrs['data-content-key'], 'section.one.heading')
assert.equal(image.attrs['data-structure-file'], 'src/data/pages/example/structure.ts')
assert.equal(image.attrs['data-structure-key'], 'sections.one.imageSrc')
const structure = { id: 'test', heading: text('heading'), paragraphs: paragraphs('body') }
const no = { heading: 'Norsk', body: ['Norsk tekst'] }
const en = { heading: 'English', body: ['English text'] }
assert.equal(composeContent(structure, no).heading, 'Norsk')
assert.equal(composeContent(structure, en).heading, 'English')
assert.throws(() => composeContent(structure, {}), /Missing or invalid page text/)
assert.throws(() => composeContent(structure, { heading: 'Valid', body: 'Not an array' }), /Missing or invalid/)

const { getPages } = load(path.join(root, 'src/data/pages/index.ts'))
const pages = JSON.parse(JSON.stringify(getPages('no')))
assert.equal(new Set(pages.map(page => page.id)).size, pages.length)
assert.equal(new Set(pages.map(page => page.path)).size, pages.length)
for (const page of pages) {
  assert.equal(new Set(page.sections.map(section => section.id)).size, page.sections.length)
  if (page.parentId) assert.ok(pages.some(parent => parent.id === page.parentId))
  for (const section of page.sections) {
    if (section.actionHref?.startsWith('/') && !section.actionHref.startsWith('/cv/')) assert.ok(pages.some(target => target.path === section.actionHref))
  }
}
const overview = pages.find(page => page.id === 'resource-coordination')
for (const section of overview.sections.filter(section => section.variant === 'caseStudy')) {
  const project = pages.find(page => page.path === section.actionHref)
  assert.ok(project)
  const detail = project.sections[0]
  assert.deepEqual(detail.paragraphs, section.detailParagraphs ?? section.paragraphs)
  assert.equal(detail.previewImage.src, section.type === 'gallery' ? section.images[0].src : section.imageSrc)
}

// Language files contain only translated text. Media and other shared structure
// must be imported by structure.ts so every language resolves the same assets.
const folders = fs.readdirSync(path.join(root, 'src/data/pages'), { withFileTypes: true }).filter(x => x.isDirectory())
for (const folder of folders) {
  const directory = path.join(root, 'src/data/pages', folder.name)
  const shared = load(path.join(directory, 'structure.ts')).structure
  const norwegianFile = path.join(directory, 'no.ts')
  const content = load(norwegianFile).no
  for (const language of ['no', 'en']) {
    const languageFile = path.join(directory, `${language}.ts`)
    if (!fs.existsSync(languageFile)) continue
    const source = fs.readFileSync(languageFile, 'utf8')
    const runtimeImports = source.match(/^import\s+(?!type\b).*$/gm) ?? []
    assert.deepEqual(
      runtimeImports,
      [],
      `${path.relative(root, languageFile)} must not import media or shared structure`,
    )
  }
  for (const value of Object.values(content)) {
    assert.ok(typeof value === 'string' || Array.isArray(value) && value.every(item => typeof item === 'string'))
  }
  const refs = []
  const visit = node => {
    if (!node || typeof node !== 'object') return
    if (node.$text) refs.push(node.$text)
    else Object.values(node).forEach(visit)
  }
  visit(shared)
  assert.deepEqual(Object.keys(content).sort(), [...new Set(refs)].sort())
}

// The institutional cards are ordered in shared structure; translation keys stay stable.
const directory = path.join(root, 'src/data/pages/logistikk')
const shared = load(path.join(directory, 'structure.ts')).structure
const content = load(path.join(directory, 'no.ts')).no
const cards = composeContent(shared, content, collections).sections.find(section => section.type === 'institutionCards').cards
assert.equal(cards[0].id, 'kuben-experience')
assert.equal(cards[0].title, 'Kuben VGS')

// Floating examples must link to real resource documents by stable ID.
const resourceIds = new Set()
function discoverResourceIds(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) discoverResourceIds(file)
    else if (entry.name.endsWith('.ts') && !['index.ts', 'toolCatalog.ts', 'TEMPLATE.resource.ts'].includes(entry.name)) {
      const id = fs.readFileSync(file, 'utf8').match(/\bid:\s*['"]([^'"]+)['"]/)?.[1]
      if (id) resourceIds.add(id)
    }
  }
}
discoverResourceIds(path.join(root, 'src/data/teachingResources/no'))
for (const page of pages) {
  for (const section of page.sections) {
    if (section.type !== 'learningJourneyStep' || section.visual !== 'starterCards') continue
    for (const example of section.examples ?? []) {
      const card = section.cards.find(candidate => candidate.id === example.id)
      assert.ok(card, `Example ${example.id} must have a matching floating card`)
      assert.ok(resourceIds.has(card.resourceId), `Floating card ${card.id} must reference an existing resource`)
    }
  }
}

if (process.argv.includes('--snapshot')) process.stdout.write(JSON.stringify(pages))
else console.log(`PASS: ${pages.length} pages; translation validation, stable IDs, routes, project reuse, text-only locale files, shared reordering`)
