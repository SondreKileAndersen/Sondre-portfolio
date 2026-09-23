
import { text } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "interests",
  showInNav: false,
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  sections: [
    {
      id: "interests-title",
      type: "title",
      heading: text("sections.interests-title.heading"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
