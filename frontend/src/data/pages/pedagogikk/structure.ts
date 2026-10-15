import heroImage from '../../../media/pedagogikk/F21-meg-studio-elever.jpg'
import placeholderImage from '../../../media/pedagogikk/F21 Studio.webp'
import artsImage from '../../../media/pedagogikk/ARTS.png'
import exhibitionImage from '../../../media/pedagogikk/Utstilling 2.jpg'
import greenScreenImage from '../../../media/pedagogikk/F21-Green-screen.png'
import gameDevelopmentImage from '../../../media/pedagogikk/F21-spillutvikling.jpg'
import oslometSmalImage from '../../../media/pedagogikk/OsloMet Smal.jpg'
import premiereThumbnail from '../../teachingResources/no/film/Adobe Premiere Pro 101/thumbnail.png'
import graphicDesignThumbnail from '../../teachingResources/no/grafisk-design/Grafiske virkemidler/thumbnail.png'
import lightingThumbnail from '../../teachingResources/no/foto/Lyssetting for film og foto/thumbnail.png'
import figmaThumbnail from '../../teachingResources/no/interaksjonsdesign/Figma 101 - Introduksjon/thumbnail.png'
import { teachingTools } from '../../teachingResources/no/toolCatalog'
import f21Logo from '../../../media/Institusjoner logo/f21-logo.webp'
import kubenLogo from '../../../media/Institusjoner logo/IM Kuben - Vektor blå.png'
import oslometLogo from '../../../media/Institusjoner logo/OsloMet Logo.png'
import ntnuLogo from '../../../media/Institusjoner logo/ntnu.png'
import { text, paragraphs, collection } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'dark', id: 'pedagogy', slug: text('slug'), path: text('path'), navTitle: text('navTitle'), title: text('title'),
  sections: [
    {
      id: 'pedagogy-intro', type: 'learningJourneyIntro',
      heading: text('sections.pedagogy-intro.heading'),
      paragraphs: paragraphs('sections.pedagogy-intro.paragraphs'),
      specializationsLabel: text('sections.pedagogy-intro.specializationsLabel'),
      specializations: paragraphs('sections.pedagogy-intro.specializations'),
      imageSrc: heroImage, imageAlt: text('sections.pedagogy-intro.imageAlt'),
    },
    {
      id: 'teaching-institutions', type: 'teachingInstitutionCards', preserveNextTone: true,
      variant: 'four',
      subjectsLabel: text('sections.teaching-institutions.subjectsLabel'),
      cards: [
        {
          id: 'kuben-school',
          title: text('sections.teaching-institutions.cards.kuben-school.title'),
          period: text('sections.teaching-institutions.cards.kuben-school.period'),
          roles: paragraphs('sections.teaching-institutions.cards.kuben-school.roles'),
          logoSrc: kubenLogo,
          logoAlt: text('sections.teaching-institutions.cards.kuben-school.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.kuben-school.subjects'),
        },
                {
          id: 'fyrstikkalleen-school',
          title: text('sections.teaching-institutions.cards.fyrstikkalleen-school.title'),
          period: text('sections.teaching-institutions.cards.fyrstikkalleen-school.period'),
          roles: paragraphs('sections.teaching-institutions.cards.fyrstikkalleen-school.roles'),
          logoSrc: f21Logo,
          logoAlt: text('sections.teaching-institutions.cards.fyrstikkalleen-school.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.fyrstikkalleen-school.subjects'),
        },
        {
          id: 'oslomet',
          title: text('sections.teaching-institutions.cards.oslomet.title'),
          period: text('sections.teaching-institutions.cards.oslomet.period'),
          roles: paragraphs('sections.teaching-institutions.cards.oslomet.roles'),
          logoSrc: oslometLogo,
          logoAlt: text('sections.teaching-institutions.cards.oslomet.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.oslomet.subjects'),
        },
        {
          id: 'ntnu',
          title: text('sections.teaching-institutions.cards.ntnu.title'),
          period: text('sections.teaching-institutions.cards.ntnu.period'),
          roles: paragraphs('sections.teaching-institutions.cards.ntnu.roles'),
          logoSrc: ntnuLogo,
          logoAlt: text('sections.teaching-institutions.cards.ntnu.logoAlt'),
          subjects: paragraphs('sections.teaching-institutions.cards.ntnu.subjects'),
        },
      ],
    },
    {
      id: 'shared-starting-point', type: 'learningJourneyStep', number: '01', imagePosition: 'left', visual: 'starterCards',
      groupHeading: text('sections.learning-journey.heading'),
      lead: text('sections.shared-starting-point.lead'),
      body: text('sections.shared-starting-point.body'),
      examplesLabel: text('sections.shared-starting-point.examplesLabel'),
      resources: collection('teachingResources'),
      examples: [
        { id: 'graphic-design', categoryId: 'graphic-design', label: text('sections.shared-starting-point.examples.graphic-design.label'), description: text('sections.shared-starting-point.examples.graphic-design.description') },
        { id: 'lighting', categoryId: 'photo', label: text('sections.shared-starting-point.examples.lighting.label'), description: text('sections.shared-starting-point.examples.lighting.description') },
        { id: 'premiere', categoryId: 'film', prefix: text('sections.shared-starting-point.examples.premiere.prefix'), label: text('sections.shared-starting-point.examples.premiere.label'), description: text('sections.shared-starting-point.examples.premiere.description') },
        { id: 'figma', categoryId: 'interaction-design', prefix: text('sections.shared-starting-point.examples.figma.prefix'), label: text('sections.shared-starting-point.examples.figma.label'), description: text('sections.shared-starting-point.examples.figma.description') },
      ],
      ctaLabel: text('sections.shared-starting-point.ctaLabel'),
      cards: [
        { id: 'premiere', resourceId: 'adobe-premiere-pro-101-nasa-trailer', imageSrc: premiereThumbnail, categoryId: 'film', logoSrc: teachingTools.premierePro.logoSrc, title: text('sections.shared-starting-point.cards.premiere.title'), label: text('sections.shared-starting-point.cards.premiere.label') },
        { id: 'graphic-design', resourceId: 'graphic-design-visual-elements', imageSrc: graphicDesignThumbnail, categoryId: 'graphic-design', title: text('sections.shared-starting-point.cards.graphic-design.title'), label: text('sections.shared-starting-point.cards.graphic-design.label') },
        { id: 'lighting', resourceId: 'lighting-for-film-and-photography', imageSrc: lightingThumbnail, categoryId: 'photo', title: text('sections.shared-starting-point.cards.lighting.title'), label: text('sections.shared-starting-point.cards.lighting.label') },
        { id: 'figma', resourceId: 'figma-101-interactive-app-introduction', imageSrc: figmaThumbnail, categoryId: 'interaction-design', logoSrc: teachingTools.figma.logoSrc, title: text('sections.shared-starting-point.cards.figma.title'), label: text('sections.shared-starting-point.cards.figma.label') },
      ],
    },
    {
      id: 'methodical-repertoire', type: 'learningJourneyStep', number: '02', imagePosition: 'right', visual: 'image',
      spacingBefore: 'relaxed',
      spacingAfter: 'compact',
      variant: 'accented',
      imageFit: 'contain',
      heading: text('sections.methodical-repertoire.heading'),
      paragraphs: paragraphs('sections.methodical-repertoire.paragraphs'), imageSrc: artsImage, imageAlt: text('sections.methodical-repertoire.imageAlt'),
      resources: collection('teachingResources'),
      previewResourceId: 'arts-method-for-media-production',
      highlights: [
        {
          id: 'arts', heading: text('sections.methodical-repertoire.highlights.arts.heading'),
          descriptionParts: [
            { id: 'arts-link', text: text('sections.methodical-repertoire.highlights.arts.description.arts'), resourceId: 'arts-method-for-media-production' },
            { id: 'rest', text: text('sections.methodical-repertoire.highlights.arts.description.rest') },
          ],
        },
      ],
    },
    {
      id: 'authentic-exercises', type: 'learningJourneyStep', number: '03', imagePosition: 'left', visual: 'starterCards',
      spacingAfter: 'spacious',
      heading: text('sections.authentic-exercises.heading'),
      paragraphs: paragraphs('sections.authentic-exercises.paragraphs'),
      examplesLabel: text('sections.authentic-exercises.examplesLabel'),
      examples: [
        { id: 'dialogue', categoryId: 'film', label: text('sections.authentic-exercises.examples.dialogue.label'), description: text('sections.authentic-exercises.examples.dialogue.description') },
        { id: 'thumbnails', categoryId: 'graphic-design', label: text('sections.authentic-exercises.examples.thumbnails.label'), description: text('sections.authentic-exercises.examples.thumbnails.description') },
        { id: 'workflow', categoryId: 'process', label: text('sections.authentic-exercises.examples.workflow.label'), description: text('sections.authentic-exercises.examples.workflow.description') },
        { id: 'specialization', categoryId: 'interaction-design', label: text('sections.authentic-exercises.examples.specialization.label'), description: text('sections.authentic-exercises.examples.specialization.description') },
      ],
      resources: collection('teachingResources'),
      cards: [
        { id: 'dialogue', resourceId: 'film-dialogue-shot-reverse-shot-exercise', categoryId: 'film' },
        { id: 'thumbnails', resourceId: 'poster-and-thumbnail-design', categoryId: 'graphic-design' },
        {
          id: 'workflow', resourceId: 'media-production-project-workflow', categoryId: 'process',
          imageSrc: gameDevelopmentImage, imageAlt: text('sections.authentic-exercises.imageAlt'),
          plainMedia: true, stackZ: 5, enterDelay: 1800,
        },
        { id: 'specialization', resourceId: 'interaction-design-specialization-assignment', categoryId: 'interaction-design' },
      ],
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
      id: 'shared-direction', type: 'learningJourneyClosing', tone: 'dark', showOnPage: false,
      eyebrow: text('sections.shared-direction.eyebrow'),
      quote: text('sections.shared-direction.quote'),
      imageSrc: placeholderImage, imageAlt: text('sections.shared-direction.imageAlt'),
    },
    {
      id: 'premiere-color-grading-playlist', type: 'youtubePlaylist', tone: 'dark',
      eyebrow: text('sections.premiere-color-grading-playlist.eyebrow'),
      heading: text('sections.premiere-color-grading-playlist.heading'),
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
      introduction: paragraphs('sections.teaching-resources-library.introduction'),
      notice: text('sections.teaching-resources-library.notice'),
      categories: collection('teachingResourceCategories'), resources: collection('teachingResources'),
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
