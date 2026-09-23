
import { text } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "these-indie-darlings",
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  parentId: "projects",
  sections: [
    {
      id: "these-indie-darlings-title",
      type: "title",
      heading: text("sections.these-indie-darlings-title.heading"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
