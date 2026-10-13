# Content Architecture

This project uses a content-driven portfolio structure.

Pages are data.
Sections are blocks.
React components render blocks.
CSS controls visual design.

## Media organization

Page-specific assets are grouped by the Norwegian page slug:

```txt
src/media/
  hjem/
    Sondre_Caps.jpg
  ressurskoordinering/
    Lydstudio.jpg
    Lager 1.jpg
    ...
  ikke-plassert/
```

`ikke-plassert` is a temporary holding folder for assets that are not connected
to a page yet. Move an asset into its page folder when it is used. Do not keep
loose files directly in `src/media/`.

Do not hardcode long portfolio content directly inside page JSX unless the content is intentionally unique and not reusable.

## Example flow

A page contains sections:

```ts
sections: [
  {
    id: "intro",
    type: "text",
    heading: "About me",
    body: "Short intro..."
  },
  {
    id: "profile-image",
    type: "image",
    src: "/media/profile.jpg",
    alt: "Profile photo"
  }
]
```

SectionRenderer reads section.type.

If type is "image", it renders ImageBlock.

If type is "text", it renders TextBlock.

The data decides what exists.
The component decides how it is rendered.
The CSS decides how it looks.

## Current section types

The pedagogikk page also uses reusable `learningJourneyIntro`,
`learningJourneyStep`, and `learningJourneyClosing` sections. A step chooses a
visual variant in shared structure, while Norwegian copy stays in `no.ts`:

```ts
{
  id: 'authentic-exercises',
  type: 'learningJourneyStep',
  number: '03',
  imagePosition: 'left',
  visual: 'mosaic',
  eyebrow: text('sections.authentic-exercises.eyebrow'),
  heading: text('sections.authentic-exercises.heading'),
  paragraphs: paragraphs('sections.authentic-exercises.paragraphs'),
  images: [/* three stable image objects */],
}
```

The other step visuals are `starterCards`, `image`, and `resourceScreen`.
A `split` section can set `secondaryImageSrc` and `secondaryImageAlt` to place
two images side by side. `FeatureImageMosaic` remains available for galleries
with a large image and two smaller images.

Pedagogikk's reusable `teachingInstitutionCards` section keeps institution
logos and card order in `structure.ts`. The localized `role` appears directly
under the title, while the `subjects` string list appears under a shared
"Emner" label. Unlike the general `institutionCards` block, it has no
description or icon highlights.

Consecutive `learningJourneyStep` sections are grouped by the page renderer.
The group measures the numbered markers and reveals one continuous dashed line
as the visitor scrolls. Scrolling sets a destination, while the line travels
at the fixed `--journey-line-speed` CSS value (pixels per second) in
`frontend/src/styles.css`. Marker and content entrance animations run only
after the visible line reaches each step, and respect reduced-motion preferences.
As each new step appears, the full-length solid segment between it and the
preceding number fades in, while the dashed scroll line continues onward.
Legacy project-source sections may set `showOnPage: false` to preserve linked
project detail pages without duplicating them in the visible page flow.

The portfolio currently supports these content sections:

```ts
{ id: "about-title", type: "title", heading: "Om meg" }

{
  id: "home-hero",
  type: "hero",
  heading: "Hei, mitt navn er Sondre Kile Andersen",
  imageSrc: profileImage,
  imageAlt: "Sondre Kile Andersen",
  paragraphs: ["Introductory text", "Supporting text"]
}
```

`TitleBlock` and `HeroBlock` render these section types through `SectionRenderer`.

The standard content layout is a two-column `split` section. Set
`imagePosition` to alternate the image and text without changing JSX:

```ts
{
  id: "example-split",
  type: "split",
  heading: "Section heading",
  paragraphs: ["Section text"],
  imageSrc: "/media/example.jpg",
  imageAlt: "Descriptive alternative text",
  caption: "Visible image caption",
  imagePosition: "left"
}
```

Use `imagePosition: "right"` for the next section to create an alternating
image/text, text/image pattern. `SplitBlock` renders both variants through
`SectionRenderer`.

`split` sections support an optional `caption` and `imageFit`. Use
`imageFit: "contain"` for logos and other graphics that should not be cropped.

Use a `text` section for an introduction or conclusion that has no image:

```ts
{
  id: "example-intro",
  type: "text",
  heading: "Optional heading",
  paragraphs: ["Localized text"]
}
```

Use a `gallery` section when several related images belong to one text block.
Each image requires a stable ID, descriptive alt text, and a visible caption:

```ts
{
  id: "equipment-gallery",
  type: "gallery",
  heading: "Equipment storage",
  paragraphs: ["Localized section text"],
  galleryPosition: "right",
  images: [
    {
      id: "storage-overview",
      src: storageImage,
      alt: "Organized equipment storage",
      caption: "A visible description of the image."
    }
  ]
}
```

`TextBlock` and `GalleryBlock` render these types through `SectionRenderer`.

Gallery structures may set `autoplay: true` and `interval: 4000` (milliseconds)
to reuse `AutoImageCollage` instead of static images. The full `images` list
cycles automatically, pauses on hover, and supports the shared arrow controls.
Source images remain available to linked project detail pages.

A gallery may also render a reusable visual process beneath its heading. The
process accepts any number of stable items and inserts arrows between them; it
is not tied to a particular project or pair of icons:

```ts
visualTransition: {
  steps: [
    { id: "source", src: sourceIcon, alt: "Source" },
    { id: "result", src: resultIcon, alt: "Result" }
  ]
}
```

The `principles` text variant accepts an optional `leadImage` object. This is a
generic image slot; a page may use a portrait, illustration, or other suitable
image without adding page-specific media handling to `TextBlock`.

Use `cardGrid` for repeated institution, project, or resource cards. A card may
have an optional action label and link:

```ts
{
  id: "institution-cards",
  type: "cardGrid",
  cards: [
    {
      id: "school",
      title: "School name",
      text: "Localized description",
      imageSrc: schoolImage,
      imageAlt: "School logo"
    }
  ]
}
```

Use `process` for a named sequence of stable steps rather than hardcoding the
graphic in JSX:

```ts
{
  id: "example-process",
  type: "process",
  heading: "Process name",
  paragraphs: ["Localized introduction"],
  steps: [
    {
      id: "first-step",
      label: "Analyze",
      description: "Localized explanation"
    }
  ]
}
```

`CardGridBlock` and `ProcessBlock` render these types through
`SectionRenderer`.

Use `youtubePlaylist` for an embedded, localized YouTube playlist. The first
video is shown in the player, while the component reads the remaining video IDs
from YouTube's iframe API and renders linked thumbnail previews:

```ts
{
  id: "editing-playlist",
  type: "youtubePlaylist",
  heading: "Video lessons",
  playlistId: "PLAYLIST_ID",
  playlistUrl: "https://www.youtube.com/playlist?list=PLAYLIST_ID",
  firstVideoId: "VIDEO_ID"
}
```

Visible labels, descriptions, titles, and accessible text belong in the
language-specific page data. `YouTubePlaylistBlock` is registered once through
`SectionRenderer`; do not embed playlist iframes directly in page JSX.

Use `logoMarquee` for a low, full-content-width row of equally high logos that
loops continuously. Define logos in page data; the component duplicates the
rendered list only to create the seamless visual loop:

```ts
{
  id: "suppliers",
  type: "logoMarquee",
  logos: [
    { id: "supplier", src: supplierLogo, alt: "Supplier name" }
  ]
}
```

`LogoMarqueeBlock` owns the animation, edge fade, equal logo height, duplicated
track, and reduced-motion behavior. The viewport center is the mouse anchor,
with a 10px dead zone on either side; horizontal displacement sets signed speed
in pixels per second. Moving right
increases the usual right-to-left scrolling speed; moving left reverses it.
`--logo-marquee-speed` controls automatic speed and
`--logo-marquee-pointer-sensitivity` controls speed per pixel from the anchor.
The shared `CarouselArrow` component supplies gallery controls. The marquee uses
its gray pointing-hand hint, which fades in on hover.
Do not duplicate logo entries in page data.

Marquee logos use their source alpha channel as a CSS mask, filled with
`--logo-marquee-gray` (also used by the mouse hint). Original RGB colors do not
affect the output. Source assets must have transparent backgrounds; an opaque
background is part of the mask. Edge antialiasing retains the source alpha.

### Teaching resources

The `teachingResources` section renders the complete resource library grouped
by category. Every resource is a separate `.ts` document below
`src/data/teachingResources/<language>/`; files live in one folder per resource
under `src/media/pedagogikk/undervisningsopplegg/`.

```ts
{
  id: "teaching-resources-library",
  type: "teachingResources",
  heading: "Undervisningsopplegg",
  categories: teachingResourceCategories,
  resources: teachingResources
}
```

Each resource has a stable ID, category, title, short description, format,
thumbnail, tools, optional tool logos, and an optional `files` collection. A
single file opens directly; multiple files are exposed through the shared file
chooser. `resourceUrl` remains supported only for legacy single-file data. Cards must
be created from resource data through `TeachingResourcesBlock`, never manually
inside page JSX. `index.ts` discovers resource documents recursively with
`import.meta.glob`, while `index.ts`, `toolCatalog.ts`, and
`TEMPLATE.resource.ts` are explicitly excluded. New resource documents must
appear without a central import or registry change.

The resource's first folder below the language directory is the single source
of truth for category membership. Each centralized category definition maps a
stable category `id` to a physical `folder`. The loader derives `categoryId`
from the import path and overrides legacy values found inside documents. New
resource documents must omit `categoryId`; moving their folder must also move
their rendered card automatically.

Tool definitions are centralized in
`src/data/teachingResources/<language>/toolCatalog.ts`. A definition may use a
local import or a direct HTTPS image URL. Store the original source page in
`sourceUrl` when using an external logo. Resource documents reference catalog
entries instead of duplicating tool metadata or logo URLs. See
`docs/ADDING_TEACHING_RESOURCE.md` for the authoring steps.

Imports of shared teaching-resource code must use the configured
`@teaching-resources` alias, for example
`@teaching-resources/defineTeachingResource` and
`@teaching-resources/no/toolCatalog`. This keeps resource documents valid at
any folder depth; do not count parent folders with relative `../` imports.

## Localization architecture

Each page has one shared structure and text-only locale files:

```txt
src/data/pages/
  index.ts
  ressurskoordinering/
    structure.ts
    no.ts
    en.ts
  pedagogikk/
    structure.ts
    no.ts
    en.ts
src/lib/pageContent.ts
src/i18n/locales/no.ts
src/i18n/config.ts
```

`structure.ts` owns stable IDs, hierarchy, section types/order, image sources,
icon choices, layout settings, and project source relationships. Localized
fields use `text("key")` for strings and `paragraphs("key")` for string lists.
Reference keys use stable item IDs, not array positions. Moving sections,
cards or images requires editing only the shared structure.

`no.ts` and `en.ts` contain strings/string lists only: localized slugs, paths,
titles, paragraphs, captions, alt text, and link URLs. Both use `PageContent`,
derived from the shared structure by `ContentFor<typeof structure>`. Complete
translations use `satisfies PageContent`, rejecting missing/wrong text fields.
Image imports and their `src` placement always belong in `structure.ts`, because
the same media is shared by every language. Only localized image descriptions
such as `alt` text and captions belong in `no.ts` and `en.ts`. The content test
rejects runtime imports in page language files to enforce this boundary.

Example shared structure:

```ts
import { text, paragraphs } from "../../../lib/pageContent"
import type { ContentFor, PageStructure } from "../../../lib/pageContent"

export const structure = {
  id: "example",
  slug: text("slug"), path: text("path"),
  navTitle: text("navTitle"), title: text("title"),
  sections: [{
    id: "intro", type: "text",
    heading: text("intro.heading"),
    paragraphs: paragraphs("intro.paragraphs"),
  }],
} as const satisfies PageStructure

export type PageContent = ContentFor<typeof structure>
```

Example Norwegian content:

```ts
import type { PageContent } from "./structure"

export const no = {
  slug: "eksempel", path: "/eksempel",
  navTitle: "Eksempel", title: "Eksempel",
  "intro.heading": "En overskrift",
  "intro.paragraphs": ["Første avsnitt.", "Andre avsnitt."],
} satisfies PageContent
```

`lib/pageContent.ts` composes references and checks invalid/missing text at
runtime. The central `data/pages/index.ts` registry registers each structure
once with `localizedContent(structure, { no })`, resolves the selected language,
attaches language-specific teaching collections, and generates project pages.
Components and SectionRenderer receive ordinary resolved props, not bilingual
data. Shared UI strings remain in `i18n/locales/<language>.ts`.

The section examples elsewhere in this document show the resolved component
data shape. In authoring files, replace translated fields with references.

### English workspaces and activation

Only Norwegian is active. Each page has an empty `en.ts` translation workspace
typed as `Partial<PageContent>`. It is not registered as a supported locale,
and does not disguise Norwegian text as English. Complete the translations
and change the export to `satisfies PageContent` before registration.

Before enabling English:

1. Complete every page locale and `i18n/locales/en.ts` shared UI resources.
2. Provide English teaching-resource collections with recursive discovery.
3. Add `en` to each existing `localizedContent` entry and `collectionsByLanguage`.
   Never duplicate the structures, registry order, or rendering logic.
4. Enable English in supportedLanguages and i18n resources together.
5. Add language-switching links matched by stable page ID and update routing,
   document language and language-specific metadata as appropriate.
6. Run `npm.cmd run test:content` and `npm.cmd run build`.

Norwegian remains the default/fallback. Page hierarchy uses `parentId`.
Projects use `sourcePageId` and `sourceSectionId`, not localized slugs.
Project paths are localized content, not a Norwegian prefix in the generator.
See [EDITING_CONTENT.md](EDITING_CONTENT.md) for the practical editing guide.

## Shared layout controls

Every logical page section alternates light/dark by its position in the shared
`sections` array, starting with `startTone: 'light' | 'dark'` in that page's
shared structure (light if omitted). `sectionTone.ts`, `App`, and `SectionRenderer`
apply the one sequence across every block type and through sticky brand groups.
Group wrappers and development tracing wrappers do not count as sections.
Image/text positioning has its own case-study sequence and does not determine
background color. Palette colors are controlled by `--palette-*` in styles.css.

The content width is controlled by `--main-content-max-width` at the top of
`src/styles.css`. Main sections always span the full viewport so their
background colors reach both screen edges. Their responsive inline padding
centers and constrains only the content on wide screens. On screens narrower
than the maximum, `--main-content-padding` supplies the small internal space
between content and the viewport edge. These variables do not affect the
header or navigation.

Heading typography uses one global two-level scale in `src/styles.css`: `h1`
for page titles and `h2` for section titles. Components must not assign their
own heading font sizes or introduce `h3`–`h6` for visual sizing. Smaller card
names and labels use semantic `strong` or `span` elements instead.

## Reusable section contract

Every entry in a page's `sections` array is a reusable block. Its `type` is
resolved only by `components/SectionRenderer.tsx`, and each renderer lives in
`components/blocks/`. Page-specific text, media, item order, icons and links
belong in `data/pages/<page>/structure.ts` and the matching language file.
Block components must not test page IDs, slugs, institution names or section
IDs to decide their layout. Named `variant` values are reusable visual choices,
not aliases for a particular page.

To use an existing section on another page, add another data object with a
stable section ID and the same `type`; no JSX or renderer change is required.
Only a genuinely new content shape requires a new section type, block component
and `SectionRenderer` case.

`SplitBlock` follows the portfolio's alternating two-column pattern. Sections
with the image on the right use the dark color variables in `src/styles.css`;
sections with the image on the left use the light color variables. Branded case studies receive alternating position and tone automatically
from the renderer; do not duplicate those choices in locale files.

## Editorial section variants

Reusable blocks may expose a named visual `variant` while retaining their
content-driven data shape. The resource-coordination page uses:

- `TitleBlock` with `variant: "editorial"` for an introduction, image collage,
  highlights, and handwritten-style note.
- `TextBlock` with `variant: "principles"` for a dark feature strip with line
  icons, and `variant: "cta"` for a closing section.
- `GalleryBlock` and `SplitBlock` with `variant: "caseStudy"` for portfolio
  cases. `tone`, `eyebrow`, `note`, and an optional `brand` remain page data.

Line icons use stable names from `LineIconName` and render through the shared
`components/ui/LineIcon.tsx` component. Consecutive cases with the same
`brand.groupId` are grouped by `CaseStudyGroup`, giving them one sticky company
logo that stops when the next brand group starts. Institution logos are stored
in `src/media/Institusjoner logo/` and render without a frame, background, or visual
effect. Add content in page data; do not duplicate these layouts inside page
JSX.

## Standard project detail pages

`institutionCards` renders reusable institution experience cards with original
logos, role summaries, descriptions, and icon highlights. Example:

```ts
{
  id: 'institutions',
  type: 'institutionCards',
  cards: [{
    id: 'institution', title: 'Institution', role: 'Role · Area',
    description: 'Short summary', logoSrc: institutionLogo, logoAlt: 'Institution',
    highlights: [{ id: 'equipment', label: 'Equipment', icon: 'camera' }]
  }]
}
```

Institution cards participate in the same automatic light/dark sequence as
every other logical page section, without hardcoded page-data tones.

Project detail pages use one typed `projectDetail` section rendered by the
shared `ProjectDetailBlock`. It accepts an eyebrow, title, introduction,
preview image, long-form paragraphs, optional gallery, and a stable metadata
array. Metadata can contain organization, role, period, duration, tools, or
other project-specific facts without changing component JSX.

Resource-coordination project pages are generated by
`data/projects/createProjectPage.ts`. Each definition points to an existing
section by `sourceSectionId`; the generator reuses that section's paragraphs
and images so overview and detail pages stay synchronized. Generated pages use
`showInNav: false`, while overview cases link directly to their routes.

Case-study sections may define short `paragraphs` for the overview and longer
`detailParagraphs` for the generated detail page. The case-study overview
variant intentionally renders only the first image and omits captions; all
source images and their captions remain available to `ProjectDetailBlock`.

### Linked floating teaching-resource cards

A `learningJourneyStep` with `visual: 'starterCards'` can resolve its cards
from the localized teaching-resource collection. Each card's `resourceId`
references a resource document; its stable `id` matches an example's `id`:

```ts
resources: collection('teachingResources'),
cards: [
  { id: 'premiere', resourceId: 'adobe-premiere-pro-101-nasa-trailer', /* shared visual settings */ },
],
examples: [
  { id: 'premiere', categoryId: 'film', label: text('example.label'), description: text('example.description') },
],
```

`LearningJourneyStepBlock` owns hover and expansion state. Both the library
and floating collection render `TeachingResourceCard` and use the same
`ResourceFilesDialog`. Hover or keyboard focus brings the matching card
forward and stops its floating animation. Clicking an example or card title
toggles the resource description and file actions; preview and download
controls retain their own behavior. Resource text and attachments come from
the resource document, rather than duplicated page content.
A `learningJourneyStep` may set `variant: 'accented'` for a short gold rule
under its heading, a gold rule beside highlight labels, and matching image
and marker borders. Example shared settings: `variant: 'accented',
spacingBefore: 'relaxed', imageFit: 'contain'`. The heading uses the shared
`--section-title-font-size` scale; localized text remains in the page locale.
Floating journey cards may contain only `id`, `resourceId`, and `categoryId`;
thumbnail, title, description, tools and files resolve from the resource
collection. Four stack positions are shared across steps rather than tied
to resource IDs. A final journey step may set
`footerImage: { src: studentImage, alt: text('image.alt') }` to retain an image
below the complete group of numbered steps. The group renders this image
from shared structure and resolved localized alt text.
### Three and four institution cards

`teachingInstitutionCards` accepts `variant: 'three' | 'four'`. Omitting it
keeps the original three-card layout and all its viewport breakpoints.
Use `variant: 'four'` for four equal columns, two columns, or one column.
The four-card variant uses named container queries: 72.5rem fits four
17rem cards plus three 1.5rem gaps; 35.5rem fits two cards plus one gap.
Card headers and subject sections align through grid subgrid.

```ts
{ id: 'schools', type: 'teachingInstitutionCards', variant: 'four',
  subjectsLabel: text('schools.subjectsLabel'), cards: [/* four cards */] }
```

Institution logos belong in shared structure; school names, periods, roles,
subject lists and logo alt text belong in language-specific page content.