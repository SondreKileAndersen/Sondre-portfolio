
import { text } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "development",
  showInNav: false,
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  sections: [
    {
      id: "development-title",
      type: "title",
      heading: text("sections.development-title.heading"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
