
import { text } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "cosmic-anchor",
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  parentId: "projects",
  sections: [
    {
      id: "cosmic-anchor-title",
      type: "title",
      heading: text("sections.cosmic-anchor-title.heading"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
