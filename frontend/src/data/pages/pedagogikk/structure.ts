import heroImage from '../../../media/pedagogikk/F21-meg-studio-elever.jpg'
import placeholderImage from '../../../media/pedagogikk/F21 Studio.webp'
import artsImage from '../../../media/pedagogikk/ARTS.png'
import exhibitionImage from '../../../media/pedagogikk/Utstilling 2.jpg'
import greenScreenImage from '../../../media/pedagogikk/F21-Green-screen.png'
import gameDevelopmentImage from '../../../media/pedagogikk/F21-spillutvikling.jpg'
import oslometSmalImage from '../../../media/pedagogikk/OsloMet Smal.jpg'
import photoshopThumbnail from '../../teachingResources/no/grafisk-design/Silhuettdesign i Photoshop - Del 1/thumbnail.png'
import careerThumbnail from '../../teachingResources/no/prosess/Karrierestart i medieproduksjon/thumbnail.png'
import premiereThumbnail from '../../teachingResources/no/film/Adobe Premiere Pro 101/thumbnail.png'
import figmaThumbnail from '../../teachingResources/no/interaksjonsdesign/Figma 101 - Introduksjon/thumbnail.png'
import { teachingTools } from '../../teachingResources/no/toolCatalog'
import f21Logo from '../../../media/Institusjoner logo/f21-logo.webp'
import kubenLogo from '../../../media/Institusjoner logo/IM Kuben - Vektor blå.png'
import oslometLogo from '../../../media/Institusjoner logo/OsloMet Logo.png'
import { text, paragraphs, collection } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'dark', id: 'pedagogy', slug: text('slug'), path: text('path'), navTitle: text('navTitle'), title: text('title'),
  sections: [
    {
      id: 'pedagogy-intro', type: 'learningJourneyIntro',
      eyebrow: text('sections.pedagogy-intro.eyebrow'), heading: text('sections.pedagogy-intro.heading'),
      paragraphs: paragraphs('sections.pedagogy-intro.paragraphs'), imageSrc: heroImage, imageAlt: text('sections.pedagogy-intro.imageAlt'),
    },
    {
      id: 'teaching-institutions', type: 'teachingInstitutionCards', preserveNextTone: true,
      subjectsLabel: text('sections.teaching-institutions.subjectsLabel'),
      cards: [
        {
          id: 'fyrstikkalleen-school',
          title: text('sections.teaching-institutions.cards.fyrstikkalleen-school.title'),
          role: text('sections.teaching-institutions.cards.fyrstikkalleen-school.role'),
          logoSrc: f21Logo,
          logoAlt: text('sections.teaching-institutions.cards.fyrstikkalleen-school.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.fyrstikkalleen-school.subjects'),
        },
        {
          id: 'kuben-school',
          title: text('sections.teaching-institutions.cards.kuben-school.title'),
          role: text('sections.teaching-institutions.cards.kuben-school.role'),
          logoSrc: kubenLogo,
          logoAlt: text('sections.teaching-institutions.cards.kuben-school.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.kuben-school.subjects'),
        },
        {
          id: 'oslomet',
          title: text('sections.teaching-institutions.cards.oslomet.title'),
          role: text('sections.teaching-institutions.cards.oslomet.role'),
          logoSrc: oslometLogo,
          logoAlt: text('sections.teaching-institutions.cards.oslomet.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.oslomet.subjects'),
        },
      ],
    },
    {
      id: 'shared-starting-point', type: 'learningJourneyStep', number: '01', imagePosition: 'left', visual: 'starterCards',
      eyebrow: text('sections.shared-starting-point.eyebrow'), heading: text('sections.shared-starting-point.heading'),
      paragraphs: paragraphs('sections.shared-starting-point.paragraphs'),
      cards: [
        { id: 'photoshop', imageSrc: photoshopThumbnail, categoryId: 'graphic-design', logoSrc: teachingTools.photoshop.logoSrc, title: text('sections.shared-starting-point.cards.photoshop.title'), label: text('sections.shared-starting-point.cards.photoshop.label') },
        { id: 'career', imageSrc: careerThumbnail, categoryId: 'process', title: text('sections.shared-starting-point.cards.career.title'), label: text('sections.shared-starting-point.cards.career.label') },
        { id: 'premiere', imageSrc: premiereThumbnail, categoryId: 'film', logoSrc: teachingTools.premierePro.logoSrc, title: text('sections.shared-starting-point.cards.premiere.title'), label: text('sections.shared-starting-point.cards.premiere.label') },
        { id: 'figma', imageSrc: figmaThumbnail, categoryId: 'interaction-design', logoSrc: teachingTools.figma.logoSrc, title: text('sections.shared-starting-point.cards.figma.title'), label: text('sections.shared-starting-point.cards.figma.label') },
      ],
    },
    {
      id: 'methodical-repertoire', type: 'learningJourneyStep', number: '02', imagePosition: 'right', visual: 'image',
      eyebrow: text('sections.methodical-repertoire.eyebrow'), heading: text('sections.methodical-repertoire.heading'),
      paragraphs: paragraphs('sections.methodical-repertoire.paragraphs'), imageSrc: artsImage, imageAlt: text('sections.methodical-repertoire.imageAlt'),
      highlights: [
        { id: 'transferable-skills', heading: text('sections.methodical-repertoire.highlights.transferable-skills.heading'), description: text('sections.methodical-repertoire.highlights.transferable-skills.description') },
        { id: 'arts', heading: text('sections.methodical-repertoire.highlights.arts.heading'), description: text('sections.methodical-repertoire.highlights.arts.description') },
      ],
    },
    {
      id: 'authentic-exercises', type: 'learningJourneyStep', number: '03', imagePosition: 'left', visual: 'image',
      eyebrow: text('sections.authentic-exercises.eyebrow'), heading: text('sections.authentic-exercises.heading'),
      paragraphs: paragraphs('sections.authentic-exercises.paragraphs'),
      imageSrc: gameDevelopmentImage, imageAlt: text('sections.authentic-exercises.imageAlt'),
    },
    {
      id: 'oslomet-teacher-education', type: 'split', variant: 'caseStudy', tone: 'light',
      eyebrow: text('sections.oslomet-teacher-education.eyebrow'),
      heading: text('sections.oslomet-teacher-education.heading'),
      paragraphs: paragraphs('sections.oslomet-teacher-education.paragraphs'),
      imageSrc: exhibitionImage, imageAlt: text('sections.oslomet-teacher-education.imageAlt'),
      secondaryImageSrc: oslometSmalImage,
      secondaryImageAlt: text('sections.oslomet-teacher-education.secondaryImageAlt'),
      actionLabel: text('sections.oslomet-teacher-education.actionLabel'),
      actionHref: text('sections.oslomet-teacher-education.actionHref'),
    },
    {
      id: 'shared-direction', type: 'learningJourneyClosing', tone: 'dark',
      eyebrow: text('sections.shared-direction.eyebrow'),
      quote: text('sections.shared-direction.quote'), footer: text('sections.shared-direction.footer'),
      imageSrc: placeholderImage, imageAlt: text('sections.shared-direction.imageAlt'),
    },
    {
      id: 'premiere-color-grading-playlist', type: 'youtubePlaylist', tone: 'light',
      eyebrow: text('sections.premiere-color-grading-playlist.eyebrow'), heading: text('sections.premiere-color-grading-playlist.heading'),
      introduction: text('sections.premiere-color-grading-playlist.introduction'), playlistId: 'PLVcoQA4TE8eg',
      playlistUrl: text('sections.premiere-color-grading-playlist.playlistUrl'), iframeTitle: text('sections.premiere-color-grading-playlist.iframeTitle'),
      firstVideoId: 'YVWBBgC9sBE', firstVideoTitle: text('sections.premiere-color-grading-playlist.firstVideoTitle'),
      videoLabel: text('sections.premiere-color-grading-playlist.videoLabel'), categoryLabel: text('sections.premiere-color-grading-playlist.categoryLabel'),
      thumbnailAltPrefix: text('sections.premiere-color-grading-playlist.thumbnailAltPrefix'), openPlaylistLabel: text('sections.premiere-color-grading-playlist.openPlaylistLabel'),
      videos: [
        { id: 'reference-one', videoId: 'YVWBBgC9sBE', title: text('sections.premiere-color-grading-playlist.videos.reference-one.title') },
        { id: 'reference-two', videoId: '3c-n237covg', title: text('sections.premiere-color-grading-playlist.videos.reference-two.title') },
        { id: 'reference-three', videoId: '7e2COWlMeT0', title: text('sections.premiere-color-grading-playlist.videos.reference-three.title') },
        { id: 'reference-four', videoId: 'TUba4fCrFaY', title: text('sections.premiere-color-grading-playlist.videos.reference-four.title') },
        { id: 'reference-five', videoId: 'JyMJ93jIVTY', title: text('sections.premiere-color-grading-playlist.videos.reference-five.title') },
      ],
    },
    {
      id: 'teaching-resources-library', type: 'teachingResources', tone: 'dark', heading: text('sections.teaching-resources-library.heading'),
      introduction: text('sections.teaching-resources-library.introduction'), categories: collection('teachingResourceCategories'), resources: collection('teachingResources'),
    },
    {
      id: 'mastery-through-structure', type: 'split', showOnPage: false,
      heading: text('projects.mastery.heading'), paragraphs: paragraphs('projects.mastery.paragraphs'), detailParagraphs: paragraphs('projects.mastery.detailParagraphs'),
      imageSrc: placeholderImage, imageAlt: text('projects.mastery.imageAlt'),
    },
    {
      id: 'from-exercise-to-product', type: 'gallery', showOnPage: false,
      heading: text('projects.authentic.heading'), paragraphs: paragraphs('projects.authentic.paragraphs'), detailParagraphs: paragraphs('projects.authentic.detailParagraphs'),
      images: [
        { id: 'exhibition', src: exhibitionImage, alt: text('projects.authentic.images.exhibition.alt'), caption: text('projects.authentic.images.exhibition.caption') },
        { id: 'green-screen', src: greenScreenImage, alt: text('projects.authentic.images.green-screen.alt'), caption: text('projects.authentic.images.green-screen.caption') },
        { id: 'game-development', src: gameDevelopmentImage, alt: text('projects.authentic.images.game-development.alt'), caption: text('projects.authentic.images.game-development.caption') },
      ],
    },
    {
      id: 'arts-method', type: 'split', showOnPage: false,
      heading: text('projects.arts.heading'), paragraphs: paragraphs('projects.arts.paragraphs'), detailParagraphs: paragraphs('projects.arts.detailParagraphs'),
      imageSrc: artsImage, imageAlt: text('projects.arts.imageAlt'),
    },
    {
      id: 'reusable-learning-resources', type: 'gallery', showOnPage: false,
      heading: text('projects.resources.heading'), paragraphs: paragraphs('projects.resources.paragraphs'), detailParagraphs: paragraphs('projects.resources.detailParagraphs'),
      images: [
        { id: 'exhibition', src: exhibitionImage, alt: text('projects.resources.images.exhibition.alt'), caption: text('projects.resources.images.exhibition.caption') },
        { id: 'green-screen', src: greenScreenImage, alt: text('projects.resources.images.green-screen.alt'), caption: text('projects.resources.images.green-screen.caption') },
        { id: 'game-development', src: gameDevelopmentImage, alt: text('projects.resources.images.game-development.alt'), caption: text('projects.resources.images.game-development.caption') },
      ],
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
