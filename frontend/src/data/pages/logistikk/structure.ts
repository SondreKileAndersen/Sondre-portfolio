import oslometLogo from "../../../media/Institusjoner logo/OsloMet Logo.png"
import kubenLogo from "../../../media/Institusjoner logo/IM Kuben - Vektor blå.png"
import multiCameraStudioImage from "../../../media/logistikk/5s5a2889.webp"
import studioImage from "../../../media/logistikk/Lydstudio.jpg"
import yamahaMixerGuide from "../../../media/logistikk/YAMAHA Lydmikser tilkoblet OBS.png"
import lagerThreeImage from "../../../media/logistikk/Lager 3.jpg"
import lagerTwoImage from "../../../media/logistikk/Lager 2.jpg"
import lagerOneImage from "../../../media/logistikk/Lager 1.jpg"
import assetTigerImage from "../../../media/logistikk/Asset-Tiger.jpg"
import fourSoundLogo from "../../../media/Institusjoner logo/4 sound.png"
import dustinLogo from "../../../media/Institusjoner logo/Dustin_logo.png"
import fotoNoLogo from "../../../media/Institusjoner logo/Foto.no.png"
import gerdmansLogo from "../../../media/Institusjoner logo/Gerdmans.png"
import kemLogo from "../../../media/Institusjoner logo/KEM.png"
import kreatimaLogo from "../../../media/Institusjoner logo/Kreatima.png"
import kreativshopLogo from "../../../media/Institusjoner logo/Kreativshop.webp"
import lekolarLogo from "../../../media/Institusjoner logo/Lekolar.png"
import maskeLogo from "../../../media/Institusjoner logo/Maske.webp"
import mediabilityLogo from "../../../media/Institusjoner logo/Mediability.png"
import norengrosLogo from "../../../media/Institusjoner logo/Norengros.png"
import panduroLogo from "../../../media/Institusjoner logo/Panduro.avif"
import scandinavianPhotoLogo from "../../../media/Institusjoner logo/Scandinavian photo.png"
import selfmadeLogo from "../../../media/Institusjoner logo/Selfmade.png"
import sloydDetaljerLogo from "../../../media/Institusjoner logo/Sløyd-detaljer.png"
import somsenteretLogo from "../../../media/Institusjoner logo/Sømsenteret.png"
import tegneLogo from "../../../media/Institusjoner logo/Tegne.png"
import thauglandLogo from "../../../media/Institusjoner logo/Thaugland.png"
import thomannLogo from "../../../media/Institusjoner logo/Thomann.png"
import videoUtstyrLogo from "../../../media/Institusjoner logo/Videoutstyr Norge AS.webp"
import { text, paragraphs } from '../../../lib/pageContent'
import paperSystemIcon from '../../../media/logistikk/papir-til-system.svg'
import computerIcon from '../../../media/logistikk/datamaskin.svg'
import portraitImage from '../../../media/logistikk/Meg inne portrett farger.png'
import assetTigerLogo from '../../../media/Institusjoner logo/assettiger-logo-yellow.png'
import tampermonkeyLogo from '../../../media/Institusjoner logo/Tampermonkey-black.png'
import excelLogo from '../../../media/Institusjoner logo/Excel-Logo-Symbol-Tekst.png'
import osloMetUnit4 from '../../../media/logistikk/OsloMet, Unit-4.png'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'

export const structure = {
  theme: 'blue',
  startTone: 'light',
  id: "resource-coordination",
  slug: text("slug"),
  path: text("path"),
  navTitle: text("navTitle"),
  title: text("title"),
  sections: [
    {
      id: "resource-coordination-intro",
      tone: 'light',
      type: "text",
      surface: "full",
      variant: "principles",
      leadImage: {
        src: portraitImage,
        alt: text('sections.resource-coordination-intro.leadImage.alt'),
        width: 1199,
        height: 1312,
        fetchPriority: 'high',
        // Zoom: 1 = original size. X/Y: percentage of the frame; positive = right/down.
        zoom: 1.2,
        positionX: -1,
        positionY: 10,
        flipHorizontal: true,
      },
      introSequence: true,
      heading: text("sections.resource-coordination-intro.heading"),
      paragraphs: paragraphs("sections.resource-coordination-intro.paragraphs"),
      features: [
        {
          id: "understandable",
          iconTone: 'blue',
          heading: text("sections.resource-coordination-intro.features.understandable.heading"),
          description: text("sections.resource-coordination-intro.features.understandable.description"),
          icon: "arrowUp",
        },
        {
          id: "transferable",
          iconTone: 'yellow',
          heading: text("sections.resource-coordination-intro.features.transferable.heading"),
          description: text("sections.resource-coordination-intro.features.transferable.description"),
          icon: "people",
        },
        {
          id: "traceable",
          iconTone: 'green',
          heading: text("sections.resource-coordination-intro.features.traceable.heading"),
          description: text("sections.resource-coordination-intro.features.traceable.description"),
          icon: "check",
        },
      ],
    },
    {
      id: "resource-coordination-institutions",
      appearance: 'branded',
      tone: 'light',
      type: "institutionCards",
      cards: [
        {
          id: "kuben-experience",
          title: text("sections.resource-coordination-institutions.cards.kuben-experience.title"),
          period: text("sections.resource-coordination-institutions.cards.kuben-experience.period"),
          role: text("sections.resource-coordination-institutions.cards.kuben-experience.role"),
          description: text("sections.resource-coordination-institutions.cards.kuben-experience.description"),
          logoSrc: kubenLogo,
          logoAlt: text("sections.resource-coordination-institutions.cards.kuben-experience.logoAlt"),
          highlights: [
            {
              id: "equipment",
              label: text("sections.resource-coordination-institutions.cards.kuben-experience.highlights.equipment.label"),
              icon: "cube",
            },
            {
              id: "loans",
              label: text("sections.resource-coordination-institutions.cards.kuben-experience.highlights.loans.label"),
              icon: "monitor",
            },
            {
              id: "workflow",
              label: text("sections.resource-coordination-institutions.cards.kuben-experience.highlights.workflow.label"),
              icon: "workflow",
            },
          ],
        },
        {
          id: "oslomet-experience",
          title: text("sections.resource-coordination-institutions.cards.oslomet-experience.title"),
          period: text("sections.resource-coordination-institutions.cards.oslomet-experience.period"),
          role: text("sections.resource-coordination-institutions.cards.oslomet-experience.role"),
          description: text("sections.resource-coordination-institutions.cards.oslomet-experience.description"),
          logoSrc: oslometLogo,
          logoAlt: text("sections.resource-coordination-institutions.cards.oslomet-experience.logoAlt"),
          highlights: [
            {
              id: "purchasing",
              label: text("sections.resource-coordination-institutions.cards.oslomet-experience.highlights.purchasing.label"),
              icon: "cube",
            },
            {
              id: "ordering",
              label: text("sections.resource-coordination-institutions.cards.oslomet-experience.highlights.ordering.label"),
              icon: "workflow",
            },
            {
              id: "suppliers",
              label: text("sections.resource-coordination-institutions.cards.oslomet-experience.highlights.suppliers.label"),
              icon: "people",
            },
          ],
        },
      ],
    },
    {
      id: "equipment-for-learning",
      tone: 'light',
      headingStyle: 'ruled',
      headingAccent: 'turquoise',
      type: "split",
      variant: "caseStudy",
      eyebrow: text("sections.equipment-for-learning.eyebrow"),
      caseStudyGroup: { id: "kuben", sharedSurface: true },
      actionLabel: text("sections.equipment-for-learning.actionLabel"),
      actionHref: text("sections.equipment-for-learning.actionHref"),
      heading: text("sections.equipment-for-learning.heading"),
      paragraphs: paragraphs("sections.equipment-for-learning.paragraphs"),
      detailParagraphs: paragraphs("sections.equipment-for-learning.detailParagraphs"),
      outcome: text('sections.equipment-for-learning.outcome'),
      imageSrc: multiCameraStudioImage,
      imageAlt: text("sections.equipment-for-learning.imageAlt"),
      caption: text("sections.equipment-for-learning.caption"),
    },
    {
      id: "equipment-loan-gallery",
      galleryMode: 'portraitStrip',
      displayImageIds: ['storage-overview', 'loan-station', 'labelled-camera-bags'],
      tone: 'light',
      headingStyle: 'ruled',
      headingAccent: 'turquoise',
      type: "gallery",
      variant: "caseStudy",
      eyebrow: text("sections.equipment-loan-gallery.eyebrow"),
      caseStudyGroup: { id: "kuben", sharedSurface: true },
      actionLabel: text("sections.equipment-loan-gallery.actionLabel"),
      actionHref: text("sections.equipment-loan-gallery.actionHref"),
      heading: text("sections.equipment-loan-gallery.heading"),
      visualTransition: {
        steps: [
          {
            id: 'document',
            src: paperSystemIcon,
            iconTone: 'blue',
            alt: text('sections.equipment-loan-gallery.visualTransition.steps.document.alt'),
          },
          {
            id: 'computer',
            src: computerIcon,
            iconTone: 'green',
            alt: text('sections.equipment-loan-gallery.visualTransition.steps.computer.alt'),
          },
        ],
      },
      paragraphs: paragraphs("sections.equipment-loan-gallery.paragraphs"),
      toolLogos: [
        {
          id: 'excel',
          src: excelLogo,
          alt: text('sections.equipment-loan-gallery.toolLogos.excel.alt'),
        },
        {
          id: 'assettiger',
          src: assetTigerLogo,
          alt: text('sections.equipment-loan-gallery.toolLogos.assettiger.alt'),
        },
        {
          id: 'tampermonkey',
          src: tampermonkeyLogo,
          alt: text('sections.equipment-loan-gallery.toolLogos.tampermonkey.alt'),
        },
      ],
      detailParagraphs: paragraphs("sections.equipment-loan-gallery.detailParagraphs"),
      outcome: text('sections.equipment-loan-gallery.outcome'),
      images: [
        {
          id: "storage-overview",
          src: lagerThreeImage,
          cropX: 48, // Venstre bilde (Lager 3): 0 = venstre, 100 = høyre.
          alt: text("sections.equipment-loan-gallery.images.storage-overview.alt"),
          caption: text("sections.equipment-loan-gallery.images.storage-overview.caption"),
        },
        {
          id: "labelled-camera-bags",
          src: lagerTwoImage,
          cropX: 42, // Høyre bilde (Lager 2).
          alt: text("sections.equipment-loan-gallery.images.labelled-camera-bags.alt"),
          caption: text("sections.equipment-loan-gallery.images.labelled-camera-bags.caption"),
        },
        {
          id: "loan-station",
          src: lagerOneImage,
          cropX: 40, // Midterste bilde (Lager 1).
          alt: text("sections.equipment-loan-gallery.images.loan-station.alt"),
          caption: text("sections.equipment-loan-gallery.images.loan-station.caption"),
        },
        {
          id: 'asset-tiger-system',
          src: assetTigerImage,
          alt: text('sections.equipment-loan-gallery.images.asset-tiger-system.alt'),
          caption: text('sections.equipment-loan-gallery.images.asset-tiger-system.caption'),
        },
      ],
    },
    {
      id: "teaching-studio",
      tone: 'light',
      headingStyle: 'ruled',
      headingAccent: 'turquoise',
      type: "gallery",
      variant: "caseStudy",
      eyebrow: text("sections.teaching-studio.eyebrow"),
      caseStudyGroup: { id: "kuben", sharedSurface: true },
      actionLabel: text("sections.teaching-studio.actionLabel"),
      actionHref: text("sections.teaching-studio.actionHref"),
      heading: text("sections.teaching-studio.heading"),
      paragraphs: paragraphs("sections.teaching-studio.paragraphs"),
      detailParagraphs: paragraphs("sections.teaching-studio.detailParagraphs"),
      outcome: text('sections.teaching-studio.outcome'),
      images: [
        {
          id: "teaching-studio-overview",
          src: studioImage,
          alt: text("sections.teaching-studio.images.teaching-studio-overview.alt"),
          caption: text("sections.teaching-studio.images.teaching-studio-overview.caption"),
        },
        {
          id: "yamaha-mixer-guide",
          src: yamahaMixerGuide,
          alt: text("sections.teaching-studio.images.yamaha-mixer-guide.alt"),
          caption: text("sections.teaching-studio.images.yamaha-mixer-guide.caption"),
          imageFit: "contain",
        },
      ],
    },
    {
      id: "oslomet-purchasing",
      tone: 'light',
      headingStyle: 'ruled',
      headingAccent: 'yellow',
      type: "split",
      variant: "caseStudy",
      eyebrow: text("sections.oslomet-purchasing.eyebrow"),
      caseStudyGroup: { id: "oslomet" },
      actionLabel: text("sections.oslomet-purchasing.actionLabel"),
      actionHref: text("sections.oslomet-purchasing.actionHref"),
      heading: text("sections.oslomet-purchasing.heading"),
      paragraphs: paragraphs("sections.oslomet-purchasing.paragraphs"),
      detailParagraphs: paragraphs("sections.oslomet-purchasing.detailParagraphs"),
      outcome: text('sections.oslomet-purchasing.outcome'),
      imageSrc: osloMetUnit4,
      objectPosition: 'right top',
      imageAlt: text("sections.oslomet-purchasing.imageAlt"),
      caption: text("sections.oslomet-purchasing.caption"),
    },
    {
      id: "resource-coordination-suppliers",
      headingStyle: 'ruled',
      headingAccent: 'light-blue',
      type: "logoMarquee",
      tone: "light",
      heading: text("sections.resource-coordination-suppliers.heading"),
      introduction: text("sections.resource-coordination-suppliers.introduction"),
      logos: [
        {
          id: "4-sound",
          src: fourSoundLogo,
          alt: text("sections.resource-coordination-suppliers.logos.4-sound.alt"),
        },
        {
          id: "dustin",
          src: dustinLogo,
          alt: text("sections.resource-coordination-suppliers.logos.dustin.alt"),
        },
        {
          id: "foto-no",
          src: fotoNoLogo,
          alt: text("sections.resource-coordination-suppliers.logos.foto-no.alt"),
        },
        {
          id: "gerdmans",
          src: gerdmansLogo,
          alt: text("sections.resource-coordination-suppliers.logos.gerdmans.alt"),
        },
        {
          id: "kem",
          src: kemLogo,
          alt: text("sections.resource-coordination-suppliers.logos.kem.alt"),
        },
        {
          id: "kreatima",
          src: kreatimaLogo,
          alt: text("sections.resource-coordination-suppliers.logos.kreatima.alt"),
        },
        {
          id: "kreativshop",
          src: kreativshopLogo,
          alt: text("sections.resource-coordination-suppliers.logos.kreativshop.alt"),
        },
        {
          id: "lekolar",
          src: lekolarLogo,
          alt: text("sections.resource-coordination-suppliers.logos.lekolar.alt"),
        },
        {
          id: "maske",
          src: maskeLogo,
          alt: text("sections.resource-coordination-suppliers.logos.maske.alt"),
        },
        {
          id: "mediability",
          src: mediabilityLogo,
          alt: text("sections.resource-coordination-suppliers.logos.mediability.alt"),
        },
        {
          id: "norengros",
          src: norengrosLogo,
          alt: text("sections.resource-coordination-suppliers.logos.norengros.alt"),
        },
        {
          id: "panduro",
          src: panduroLogo,
          alt: text("sections.resource-coordination-suppliers.logos.panduro.alt"),
        },
        {
          id: "scandinavian-photo",
          src: scandinavianPhotoLogo,
          alt: text("sections.resource-coordination-suppliers.logos.scandinavian-photo.alt"),
        },
        {
          id: "selfmade",
          src: selfmadeLogo,
          alt: text("sections.resource-coordination-suppliers.logos.selfmade.alt"),
        },
        {
          id: "sloyd-detaljer",
          src: sloydDetaljerLogo,
          alt: text("sections.resource-coordination-suppliers.logos.sloyd-detaljer.alt"),
        },
        {
          id: "somsenteret",
          src: somsenteretLogo,
          alt: text("sections.resource-coordination-suppliers.logos.somsenteret.alt"),
        },
        {
          id: "tegne",
          src: tegneLogo,
          alt: text("sections.resource-coordination-suppliers.logos.tegne.alt"),
        },
        {
          id: "thaugland",
          src: thauglandLogo,
          alt: text("sections.resource-coordination-suppliers.logos.thaugland.alt"),
        },
        {
          id: "thomann",
          src: thomannLogo,
          alt: text("sections.resource-coordination-suppliers.logos.thomann.alt"),
        },
        {
          id: "videoutstyr",
          src: videoUtstyrLogo,
          alt: text("sections.resource-coordination-suppliers.logos.videoutstyr.alt"),
        },
      ],
    },
  ],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
