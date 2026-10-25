import profileImage from "../../../media/hjem/Sondre_Caps.jpg"
import gameDevelopmentImage from '../../../media/pedagogikk/F21-Green-screen.png'
import resourceCoordinationImage from '../../../media/logistikk/Lager 1.jpg'
import { text, paragraphs } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  theme: 'green',
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
      subtitle: text("sections.home-hero.subtitle"),
      imageSrc: profileImage,
      imageAlt: text("sections.home-hero.imageAlt"),
      paragraphs: paragraphs("sections.home-hero.paragraphs"),
    },
    {
      id: 'home-navigation', type: 'navigationCards', tone: 'light',
      cards: [
        { id: 'teaching', imageSrc: gameDevelopmentImage, title: text('sections.home-navigation.cards.teaching.title'), description: text('sections.home-navigation.cards.teaching.description'), href: text('sections.home-navigation.cards.teaching.href') },
        { id: 'resource-coordination', imageSrc: resourceCoordinationImage, title: text('sections.home-navigation.cards.resource-coordination.title'), description: text('sections.home-navigation.cards.resource-coordination.description'), href: text('sections.home-navigation.cards.resource-coordination.href') },
        {id:'research',imageSrc:'',title:text('research.title'),description:text('research.description'),href:text('research.href')},
      ],
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
