// Compile-time regression checks. Not imported by the application.
import { text, paragraphs } from './pageContent'
import type { ContentFor, PageStructure } from './pageContent'

const structure = {
  id: 'test', slug: text('slug'), path: text('path'),
  navTitle: text('navTitle'), title: text('title'),
  sections: [{ id: 'intro', type: 'text', paragraphs: paragraphs('intro.body') }],
} as const satisfies PageStructure

type Content = ContentFor<typeof structure>
const complete: Content = { slug: 'test', path: '/test', navTitle: 'Test', title: 'Test', 'intro.body': [] }
void complete
// @ts-expect-error Missing translations must be rejected.
const missing: Content = { title: 'Only a title' }
void missing
// @ts-expect-error Paragraph references require an array, not a string.
const wrong: Content = { ...complete, 'intro.body': 'Wrong shape' }
void wrong
// @ts-expect-error Language files cannot contain section structure.
const duplicated: Content = { ...complete, sections: [] }
void duplicated
const invalidStructure: PageStructure = {
  id: 'test', slug: text('slug'), path: text('path'),
  navTitle: text('navTitle'),
  // @ts-expect-error Visible text belongs in a locale, not the shared structure.
  title: 'Hardcoded Norwegian title',
  sections: [],
}
void invalidStructure
