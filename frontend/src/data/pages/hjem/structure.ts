import profileImage from "../../../media/hjem/Sondre_Caps.jpg"
import { text, paragraphs } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  id: "home",
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  showInNav: false,
  sections: [
    {
      id: "home-hero",
      type: "hero",
      heading: text("sections.home-hero.heading"),
      imageSrc: profileImage,
      imageAlt: text("sections.home-hero.imageAlt"),
      paragraphs: paragraphs("sections.home-hero.paragraphs"),
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
