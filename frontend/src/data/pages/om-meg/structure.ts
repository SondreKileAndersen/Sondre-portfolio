
import { text } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "about",
  showInNav: false,
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  sections: [
    {
      id: "about-title",
      type: "title",
      heading: text("sections.about-title.heading"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
