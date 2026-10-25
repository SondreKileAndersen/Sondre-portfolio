import formIcon from '../../../media/forskning/Vurderingsmomenter ikoner/Formidlingsrammer.svg'
import timelineDeveloper from '../../../media/forskning/Timeline/Spillutvikling.svg'
import timelineCommunicator from '../../../media/forskning/Timeline/Spillformidler.svg'
import timelineStart from '../../../media/forskning/Timeline/Pre-alpha.png'
import timelineDemo from '../../../media/forskning/Timeline/Game Demo.png'
import timelineRelease from '../../../media/forskning/Timeline/Release.png'
import projectIcon from '../../../media/forskning/Vurderingsmomenter ikoner/Prosjektgrunnlag.svg'
import developerIcon from '../../../media/forskning/Vurderingsmomenter ikoner/Utviklergrunnlag.svg'
import pressIcon from '../../../media/forskning/Vurderingsmomenter ikoner/Pressemateriale.svg'
import figure7 from '../../../media/forskning/Fig 7.jpg'
import collectionImage from '../../../media/forskning/Innhenting og organisering.jpg'
import spssAnalysis from '../../../media/forskning/SPSS Fancy.jpg'
import nettskjemaImage from '../../../media/forskning/Nettskjema.jpg'
import visualizationImage from '../../../media/forskning/Datavisualisering.jpg'
import acrobatComments from '../../../media/forskning/Kommentarer.png'
import masterCover from '../../../media/forskning/Master Forside.jpg'
import figure8 from '../../../media/forskning/Fig 8.jpg'
import figure1Before from '../../../media/forskning/Fig 1 Before.jpg'
import figure1After from '../../../media/forskning/Fig 1 After.jpg'
import figure2Before from '../../../media/forskning/Fig 2 Before.png'
import figure2After from '../../../media/forskning/Fig 2 After.jpg'
import figure3Before from '../../../media/forskning/Fig 3 Before.jpg'
import figure3After from '../../../media/forskning/Fig 3 After.jpg'
import figure4Before from '../../../media/forskning/Fig 4 Before.jpg'
import figure4After from '../../../media/forskning/Fig 4 After.jpg'
import figure5Before from '../../../media/forskning/Fig 5 Before.jpg'
import figure5After from '../../../media/forskning/Fig 5 After.jpg'
import figure6Before from '../../../media/forskning/Fig 6 Before.jpg'
import figure6After from '../../../media/forskning/Fig 6 After.jpg'
import photofakeIntroImage from '../../../media/forskning/Photofake Brian Monarch.jpg'
import temporarySupervisorPortrait from '../../../media/hjem/Sondre_Caps.jpg'
import { text, paragraphs } from '../../../lib/pageContent'
import type { ContentFor, PageStructure } from '../../../lib/pageContent'


// Endre bare denne listen for å endre rekkefølgen i galleriet og forstørrelsen.
const figureOrder = [7, 1, 3, 5, 4, 8, 2, 6] as const

function orderedFigures<const T extends { id: string }>(figures: readonly T[]) {
  return figureOrder.map(number => {
    const figure = figures.find(item => item.id === `figure-${number}`)
    if (!figure) throw new Error(`Missing research figure ${number}`)
    return figure
  })
}

// Existing images are temporary and do not depict the research projects.
export const structure = { id:'research', startTone:'light',slug:text('slug'),path:text('path'),navTitle:text('navTitle'),title:text('title'),
sections:[
{id:'research-intro', type:'hero', tone:'light', heading:text("intro.heading"), imageSrc:visualizationImage, imageAlt:text('intro.imageAlt'), paragraphs:paragraphs("intro.paragraphs"), actions:[{id:'photofake',label:text("intro.photofake"),href:text("intro.photofakeHref"),icon:'arrowDown'},{id:'master',label:text("intro.master"),href:text("intro.masterHref"),icon:'arrowDown'}]},
{id:'photofake', type:'split', tone:'light', background:'subtle',
  heading:text("photofake.heading"),
  imageSrc:photofakeIntroImage,imageAlt:text("photofake.imageAlt"),imagePosition:'left',imageFit:'contain',layout:'coverIntro',
  paragraphs:paragraphs("photofake.paragraphs"),actionLabel:text("photofake.actionLabel"),actionHref:text("photofake.actionHref"),actionExternal:true,actionAfterParagraph:0},
{id:'research-work', type:'process',variant:'horizontalCards', tone:'light', background:'subtle',
  heading:text("work.heading"),
  paragraphs:paragraphs('work.paragraphs'),
  steps:[
{id:'work-0',columnSpan:2,label:text("work0.label"),description:text("work0.description"),image:{src:collectionImage,alt:text('work0.image.alt')}},
{id:'work-1',columnSpan:2,label:text("work1.label"),description:text("work1.description"),image:{src:spssAnalysis,alt:text('work1.image.alt')}},
{id:'work-3',columnSpan:2,label:text("work3.label"),description:text("work3.description"),image:{src:visualizationImage,alt:text('work3.image.alt')}},
{id:'work-2',columnSpan:3,label:text("work2.label"),description:text("work2.description"),image:{src:nettskjemaImage,alt:text('work2.image.alt')}},
{id:'work-4',columnSpan:3,label:text("work4.label"),description:text("work4.description"),image:{src:acrobatComments,alt:text('work4.image.alt')}}]},
{id:'research-articles', type:'publicationList', tone:'light', background:'subtle',
  heading:text("articles.heading"),
  publications: [
    {
      id: 'article-0', title: text('article0.title'),
      authors: paragraphs('article0.authors'), status: text('articles.status'),
      label: text('article0.label'), items: paragraphs('article0.items'), tags: paragraphs('article0.tags'),
    },
    {
      id: 'article-1', title: text('article1.title'),
      authors: paragraphs('article1.authors'), status: text('articles.status'),
      label: text('article1.label'), items: paragraphs('article1.items'), tags: paragraphs('article1.tags'),
    },
  ]},
{
  id: 'research-image-comparisons', type: 'imageCompare', tone: 'light', background:'subtle',
  heading: text('comparison.heading'),
  introduction: text('comparison.introduction'),
  groups: orderedFigures([
    {
      id: 'figure-7',
      heading: text('comparison.7.heading'),
      images: [{ id: 'after', src: figure7, alt: text('comparison.7.after.alt') }],
    },
    {
      id: 'figure-5',
      heading: text('comparison.5.heading'),
      images: [{ id: 'after', src: figure5After, alt: text('comparison.5.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure5Before, alt: text('comparison.5.before.alt'), label: text('comparison.before.label') }],
    },
    {
      id: 'figure-4',
      heading: text('comparison.4.heading'),
      images: [{ id: 'after', src: figure4After, alt: text('comparison.4.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure4Before, alt: text('comparison.4.before.alt'), label: text('comparison.before.label') }],
    },
    {
      id: 'figure-6',
      heading: text('comparison.6.heading'),
      images: [{ id: 'after', src: figure6After, alt: text('comparison.6.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure6Before, alt: text('comparison.6.before.alt'), label: text('comparison.before.label') }],
    },
    {
      id: 'figure-1',
      heading: text('comparison.1.heading'),
      images: [{ id: 'after', src: figure1After, alt: text('comparison.1.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure1Before, alt: text('comparison.1.before.alt'), label: text('comparison.before.label') }],
    },
    {
      id: 'figure-2',
      heading: text('comparison.2.heading'),
      images: [{ id: 'after', src: figure2After, alt: text('comparison.2.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure2Before, alt: text('comparison.2.before.alt'), label: text('comparison.before.label') }],
    },
    {
      id: 'figure-8',
      heading: text('comparison.8.heading'),
      images: [{ id: 'after', src: figure8, alt: text('comparison.8.after.alt') }],
    },
    {
      id: 'figure-3',
      heading: text('comparison.3.heading'),
      images: [{ id: 'after', src: figure3After, alt: text('comparison.3.after.alt'), label: text('comparison.after.label') },
        { id: 'before', src: figure3Before, alt: text('comparison.3.before.alt'), label: text('comparison.before.label') }],
    }
  ]),
},

{
  id: 'research-supervisor', type: 'quote', tone: 'light',
  // Set to true once the reference is approved for publication.
  showOnPage: false,
  heading: text('supervisor.heading'),
  quote: text('supervisor.quote'),
  title: text('supervisor.title'),
  role: text('supervisor.role'),
  // Replace this temporary portrait with a photo of Nils Arne Bakke.
  imageSrc: temporarySupervisorPortrait,
  imageAlt: text('supervisor.imageAlt'),
},
{
  "id": "masteroppgaven",
  "type": "researchStudy",
  "tone": "light",
  "parts": [
    {
      "id": "master-intro",
      variant: 'cover',
      "label": text('master.intro.label'),
      "heading": text('master.heading'),
      "subtitle": text('master.subtitle'),
      "description": text('master.metadata'),
      "paragraphs": paragraphs('master.intro.paragraphs'),
      "image": {
        src: masterCover,
        href: text('master.forside.href'),
        file:'src/media/forskning/Master Forside.jpg',
        "variant": "document",
        position: 'right',
        "alt": text('master.forside.alt')
      }
    },
    {
      "id": "master-summary",
      premise: {},
      "label": text('master.summary.label'),
      "heading": text('master.summary.heading'),
      "paragraphs": paragraphs('master.summary.paragraphs'),
      "question": {
        "label": text('master.question.label'),
        "text": text('master.question.text'),
        footnote: { label: text('master.question.footnote.label'), text: text('master.question.footnote.text') },
      },
      "abstract": {
        "label": text('master.abstract.label'),
        "text": text('master.abstract.text')
      },
      norwegianAbstract: { label: text('master.abstract.no.label'), text: text('master.abstract.no.text') },
      illustration: {
  id: 'master-development-timeline', type: 'developmentTimeline',
  heading: text('timeline.heading'),
  labels: [
    { id: 'development', iconSrc: timelineDeveloper, label: text('timeline.development') },
    { id: 'assessment', iconSrc: timelineCommunicator, label: text('timeline.assessment') },
  ],
  stages: [
    { id: 'start', label: text('timeline.start'), note: text('timeline.start.note'), focus: { label: text('timeline.start.focus.label') }, src: timelineStart, alt: text('timeline.start.alt'), appearance: 'solid' },
    { id: 'demo', label: text('timeline.demo'), src: timelineDemo, alt: text('timeline.demo.alt'), appearance: 'outline', items: paragraphs('timeline.demo.items') },
    { id: 'release', label: text('timeline.release'), src: timelineRelease, alt: text('timeline.release.alt'), appearance: 'outline', items: paragraphs('timeline.release.items') },
  ],
      },
      practical: {
        text: text('master.practical.text'),
        prefix: text('master.practical.prefix'),
        label: text('master.practical.label'),
        href: text('master.practical.href'),
        description: text('master.practical.description'),
      }
    },
    {
      "id": "master-method",
      factsAppearance: 'compact',
      "label": text('master.method.label'),
      "heading": text('master.method.heading'),
      "paragraphs": paragraphs('master.method.paragraphs'),
      "facts": [
        { id: 'research-design', icon: 'workflow', label: text('master.fact.design') },
        { id: 'literature-review', icon: 'books', label: text('master.fact.literature') },
        { id: 'participant-recruitment', icon: 'people', label: text('master.fact.recruitment') },
        { id: 'interviews', icon: 'conversation', label: text('master.fact.interviews') },
        { id: 'data-analysis', icon: 'search', label: text('master.fact.analysis') },
        { id: 'research-ethics', icon: 'shieldLock', label: text('master.fact.ethics') },
      ]
    },
    {
      "id": "master-findings",
      "label": text('master.findings.label'),
      "heading": text('master.findings.heading'),
      "subtitle": text('master.findings.subtitle'),
      "paragraphs": paragraphs("master.findings.paragraphs"),
      "findings": [
        {
          "id": "mediation",
          momentId: 'M_FORM',
          iconSrc: formIcon,
          "label": text('master.finding.mediation.label'),
          "text": text('master.finding.mediation.text')
        },
        {
          "id": "project",
          momentId: 'M_PROJ',
          iconSrc: projectIcon,
          "label": text('master.finding.project.label'),
          "text": text('master.finding.project.text')
        },
        {
          "id": "developer",
          momentId: 'M_DEV',
          iconSrc: developerIcon,
          "label": text('master.finding.developer.label'),
          "text": text('master.finding.developer.text')
        },
        {
          "id": "materials",
          momentId: 'M_PRESS',
          iconSrc: pressIcon,
          "label": text('master.finding.materials.label'),
          "text": text('master.finding.materials.text')
        }
      ],
      "outcome": text('master.findings.outcome'),
    }
  ]
}, {
  id: 'master-connection-overview', type: 'researchVisualizations', datasetId: 'master', presentation: 'overview', tone: 'light',
  heading: text('master.overview.heading'), paragraphs: paragraphs('master.overview.paragraphs'),
  views: [{ id: 'master-overview', kind: 'relations', heading: text('master.overview.heading'), paragraphs: paragraphs('master.overview.description') }],
}] } as const satisfies PageStructure
export type PageContent = ContentFor<typeof structure>
