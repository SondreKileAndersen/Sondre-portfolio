# Content Architecture

When responsive sections switch to one column, copy precedes images or galleries.
This applies to split/gallery blocks, teaching introductions and research cover
introductions at their existing layout breakpoints. The home hero deliberately
keeps its portrait before the copy, following its mobile reference layout.

Hero sections may set `paragraphLayout: 'equalWidthLines'` to display each
localized paragraph as an editorial line of equal width. `EqualWidthLines`
uses SVG `textLength` with `lengthAdjust="spacing"` to adjust character spacing
without stretching letters. The research introduction supplies an example;
its two lines remain in `forskning/no.ts`, and the layout choice stays in structure.

`developmentTimeline` renders a responsive development timeline through
`DevelopmentTimelineBlock` and `SectionRenderer`. The research page provides
an example: `{ id: 'timeline', type: 'developmentTimeline', heading: text('timeline.heading'),
labels: [{ id: 'assessment', iconSrc: communicatorIcon, label: text('timeline.assessment') }],
stages: [{ id: 'demo', label: text('timeline.demo'), src: demoImage,
alt: text('timeline.demo.alt'), appearance: 'outline', items: paragraphs('timeline.demo.items') }] }`.
Stage order, assets and solid/outline appearance belong in shared structure;
headings, labels, image descriptions and assessment lists belong in locale data.
The page section retains the standard page padding. Only the inner figure uses
`--timeline-width` (default `52rem`) as a maximum width. A single CSS grid keeps
all three phases horizontal; a small-screen media query adjusts type and image
sizes without transforms, JavaScript measurement, fixed minimum widths or scrolling.
Circle images retain their aspect ratio; information cards use the timeline palette.

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

`publicationList` renders publication-style citations with complete author names,
article title, localized manuscript status and expandable contribution details.
Each entry has stable `id`, `title`, `authors: string[]`, `status`, `label`, and
optional `items`/`tags`. Example: `{ id: 'article', title: text('article.title'),
authors: paragraphs('article.authors'), status: text('article.status'),
label: text('article.label'), items: paragraphs('article.items') }`.
Research uses this for the two unpublished manuscripts. Author arrays live in
the language file and must contain confirmed full names in author order; an
empty array omits the author line until confirmed. No publication year, DOI,
journal, or archive URL is inferred for unpublished work. Rendering goes through
`SectionRenderer` and the reusable `PublicationListBlock`.

`galleryMode: 'portraitStrip'` shows a static row of three tall images with
staggered top edges and individual shadows, as in `equipment-loan-gallery`.
`displayImageIds: ['storage-overview', 'loan-station', 'labelled-camera-bags']`
selects and orders overview images without removing media from the project
detail page. Each gallery image may set `cropX: 52` to control its horizontal
portrait crop (0 = left, 100 = right). The full image height is shown, without
additional zoom or vertical positioning.
Sources remain unchanged; CSS crops the overview.

Gallery sections support `galleryMode: 'maskedPanels'`, for example the
`equipment-loan-gallery` section. `MaskedImageGallery` keeps each image in a
fixed canvas sized for its expanded view, with `object-fit: contain` so the
whole active image is visible. Only each panel's clip-path changes. White gaps
separate the images; inactive images occupy narrow strips in their original
order. The wider, shorter gallery and its active panel have shadows. Clicking
a strip or optional autoplay changes the active image, without arrow controls. Hover and focus
pause autoplay; reduced motion disables autoplay and mask transitions.

`imageCompare` renders a circular carousel of research figures, with the active
group large in front and neighbors arranged on either side using wrapped indices.
Each successive depth is half the size of the preceding depth. Click side cards,
swipe horizontally, or use keyboard arrows to navigate across the last/first
boundary. Any click outside the main image advances just one step on that
side, regardless of which background card was clicked. There are no arrow
buttons. Each group has a stable `id`, localized
`heading`, and an `images` array. Image IDs are `after` and optionally `before`; each has
a shared `src`, localized `alt`, and an optional localized `label`. The after
image fits the active card; a small before image overlaps its bottom center with
a drop shadow. Both use rounded corners and corner labels. Single figures
need only an after image and may omit its label. Main image, before preview,
and labels form one card and scale/move together, including on smaller screens.
The before preview is absolutely positioned so centering uses only the after
image, and is hidden on inactive cards. All cards use one responsive standard
frame, independent of which figure is active. Inactive images scale proportionally
to the standard height with their natural width, without cropping or padding.
Their links align left on the left side and right on the right side; any overlap
comes from neighboring cards covering them rather than cropping their content.
The active image keeps its natural aspect ratio within that transparent frame.
`--research-gallery-scale` controls each depth's scale multiplier.
`--research-gallery-spread` specifies the fraction of each scaled card's width
exposed at its outward edge (left edge on the left, right edge on the right).
The edge positions accumulate per depth, keeping the visible fraction equal
despite different scales; a narrower active image can expose more of its
neighbors. ResizeObserver measures the standard frame, and each image's natural
aspect ratio defines its proportional size. Links use one absolute layout in
both focused and background states; position and fit-scale transition together
with the existing depth transform, avoiding an abrupt layout-mode switch.
The before preview fades in at the active image's lower edge. Labels remain
anchored to their actual images. Reduced motion removes these transitions.

All adjustable research-gallery styling is collected in
`src/researchGallerySettings.css`: background, spread, depth scale, standard
frame/stage dimensions, preview dimensions/overlap, timing, rounding and shadow.
`--research-gallery-focus-figure-1` through `-8` independently multiply each
figure's focused size (1 = unchanged). Stable `data-figure-id` values connect
these overrides to the shared renderer. Focus multipliers affect neither
background image sizes nor their standard positions. Before-preview positioning
accounts for the focus multiplier. CSS edits update the measured settings.

Clicking the active main image or its before preview opens `ImagePreviewDialog`
as a native modal with a dark backdrop, focus containment, scroll lock, Escape
and close controls. The outside arrow controls and keyboard arrows loop through
main images only; before images can be opened but are excluded from that loop.
The regular carousel enlarges the immediate neighbor on the hovered side,
matching its one-step navigation. Each additional depth blends further toward
the section background via an opaque color overlay, without revealing cards
through each other. `--research-gallery-hover-scale`,
`--research-gallery-tint-strength`, `--research-gallery-tint-curve`,
`--research-gallery-tint-duration` and `--research-gallery-overlay-background`
are in `researchGallerySettings.css` alongside the other settings.
The carousel maintains four layers on each side, repeating the far-end figure
where needed to close the circle. The fourth layer is always completely tinted
to the section background and has no shadow. Side hover is determined only by
the pointer's X position outside the focused main image; hovering its image or
before preview never triggers neighboring enlargement.
Pointer navigation and hover additionally require hitting an actual image link.
The gallery stage, measurement frames and motion/card wrappers do not capture
pointer clicks. Empty space above/below/between figures is inactive, as is the
fully background-colored fourth layer. Touch swipes must start on an image;
keyboard navigation remains available through focused gallery/card controls.
While the pointer remains in the gallery, a requestAnimationFrame hit-test
checks its last viewport coordinates against `document.elementFromPoint`.
Thus moving images update side hover even with a stationary mouse, including
after an advance. Masks and current stacking determine whether a real image
is hit; empty areas and the active pair do not trigger side hover. The loop
stops when the pointer leaves or the preview dialog opens.
Tint uses `strength * (depth / 4) ** curve` at intermediate depths. Curve 1
is linear; higher values keep nearer figures clearer, lower values tint them
earlier. The focused figure remains untinted and the fourth depth stays fully
background-colored. Opacity, background-color and shadow fade as cards move.
When focus changes, `useGalleryDepartingCopy` temporarily mirrors the outgoing
card above the stack, following its computed geometry and tint each frame.
The copy fades out while the real card fades into its new background position,
including its shadow. The gallery uses `lib/crossfadeLayers.ts` with a shared
animation clock and reduced-motion handling. Floating teaching cards promote
their original DOM node before paint, without opacity fades or duplicate-card
handoffs; their existing scale transition remains. Gallery copy timing is
configurable in `researchGallerySettings.css`;
all gallery timing derives from `--research-gallery-duration` (400ms by default).
Movement, scaling, masking and tint use the full duration; preview fade uses
62.5%, copy fade-in 75%, copy fade-out delay 50% and fade-out duration 25%.
Thus all related effects finish within the configured total. Teaching-card
timing remains independent. The shared crossfade helper resolves CSS `calc()`
times to milliseconds through computed CSS before starting animations. Copies are
inert, hidden from accessibility, and removed on completion or interruption.
`--research-gallery-hidden-crop: 50%` masks the inward half of background
images: the right half on the left side, and the left half on the right side.
The outward visible content retains its original scale and alignment. The mask
opens completely for focus and closes for background with the same duration
and easing as movement/scaling. Outgoing copies mirror the current clip-path
each frame, keeping the mask aligned during the crossfade. Before previews and
the fullscreen overlay are unaffected.
`--research-gallery-autoplay-interval` controls automatic one-step advances to
the right (3000ms by default; 0 disables). A fresh interval starts after each
advance or pause. Hover, keyboard-visible focus, an open preview, a hidden tab,
or reduced-motion preferences pause automatic advances. Pointer focus alone
does not prevent playback from resuming after the pointer leaves.
The `figureOrder` array near the top of `data/pages/forskning/structure.ts`
controls figure order in the gallery, autoplay and modal navigation. Edit its
numbers instead of moving figure definitions. The gallery starts on the first
listed figure; before images and focus-size overrides follow their stable IDs.
The stage reserves vertical space for the largest configured focus multiplier,
the before preview's overhang and `--research-gallery-edge-space` for shadows.
Its minimum height is independent of the active figure, preventing clipping
without changing the section height on each advance. Horizontal overflow is
clipped independently while vertical overflow remains visible.
Each image pair has a fixed measurement frame and one `.image-pair__motion`
wrapper containing both figures. Position, focus fit and depth transforms move
the pair together; the before preview is anchored to its own main image's bottom
edge, never to the globally active image's geometry. It only fades independently
when hidden. The outgoing-copy effect mirrors the shared motion wrapper and the
before preview's fading state. Stage clearance includes preview scaling too.
Example: `{ id: 'figure', heading: text('figure.heading'),
images: [{ id: 'after', src: figure, alt: text('figure.alt') }] }`.
See `research-image-comparisons` for the complete example. Research sections
explicitly use `tone: 'light'` throughout, and the research footer also uses
the light palette.

`split` may include additional `actions` with stable `id`, localized `label`
and `href`, and optional `external: true` to open securely in a new tab.
Example: `actions: [{ id: 'instagram', label: text('instagram.label'),
href: text('instagram.href'), external: true }]`. The OsloMet teaching section
uses this alongside its existing project link.

`quote` renders a reference with a circular portrait, semantic blockquote,
and attribution. Keep `imageSrc` in shared structure; `heading`, `quote`,
`title` (the person's name), `role`, and `imageAlt` use localized text.
Example resolved data: `{ id: 'reference', type: 'quote', heading: 'Reference',
quote: 'Their recommendation.', title: 'Name', role: 'Professor',
imageSrc: portrait, imageAlt: 'Portrait of Name' }`.
The research page's `research-supervisor` section is a complete example.

The research page reuses `hero`, `split`, `cardGrid`, and `process` blocks.
`cardGrid` cards may omit images and supply a localized `label`, `items`,
and `tags` for contribution lists. Example: `{ id: 'article', title: 'Title',
label: 'Contribution', items: ['Analysis'], tags: ['SPSS'] }`.
`process` supports `variant: 'grid'` for equal work blocks and an optional
`outcome` paragraph after them. `split` supports `actionExternal: true` and
`actionAfterParagraph: 0` to place a secure external link after the first
paragraph. The complete localized example is in `pages/forskning/structure.ts`.

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
Journey steps accept explicit `tone` settings. The pedagogy journey uses light
tone throughout, including its group heading and footer image. Step surfaces
inherit their resolved palette instead of forcing dark colors. Keep light
steps free of panel clipping, so the curve shares the group stacking context
and remains behind the visuals. Numbered circles are not rendered. Floating cards,
their media frames and thumbnails use the shared `--corner-radius`.
A `split` section can set `secondaryImageSrc` and `secondaryImageAlt` to place
two images side by side. `FeatureImageMosaic` remains available for galleries
with a large image and two smaller images.

Pedagogikk's reusable `teachingInstitutionCards` section keeps institution
logos and card order in `structure.ts`. The localized `role` appears directly
under the title, while the `subjects` string list appears under a shared
"Emner" label. Unlike the general `institutionCards` block, it has no
description or icon highlights.

Consecutive `learningJourneyStep` sections are grouped by the page renderer.
`LearningJourneyPath` measures the untransformed centers of the visual areas
and connects them to the group heading with a curved SVG path. Its visible
stroke stays dashed; an SVG mask reveals it at a constant speed once the group
heading enters the upper 80% of the viewport. `--journey-line-speed` controls
the speed in pixels per second (500 by default). Drawing pauses at the viewport
fraction `--journey-line-stop-position` (0.6 by default, slightly below center)
and continues at the same speed as scrolling makes more of the path available.
Image entrance animations do not pause the line. Previously
revealed portions stay visible. Only images and
floating cards animate, growing from their visual area's center when the
visible tip reaches that point. Text stays visible throughout.
ResizeObserver and font readiness keep the curve aligned after layout changes;
reduced-motion preferences show the complete curve and visuals immediately.
The curve remains hidden on narrow mobile layouts, as before.
`--journey-line-color` supplies the same light blue to the entire dashed curve
and the circle behind the beginning of the group heading. That heading uses
the body font in bold at the shared section-title size. The path starts at
the circle's lower edge, including when the heading wraps.
Steps can set `lineAnchorX` between 0 and 1 to move the curve and entrance
origin horizontally inside the visual area (default 0.5). The first card
group uses `lineAnchorX: 0.3` for a point farther left.
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

Sections may set `headingStyle: 'ruled'` and `headingAccent: 'green' | 'yellow' |
'blue' | 'light-blue' | 'turquoise'`. The central renderer exposes this shared presentation;
CSS applies the same serif heading, scale, line height and short rule used by
teaching showcases. Example: `{ id: 'equipment', type: 'split', tone: 'light',
headingStyle: 'ruled', headingAccent: 'yellow', /* existing split fields */ }`.
Resource coordination explicitly uses light tone throughout and selects its
heading accents in shared page structure.
The rule is anchored above the complete content column, including any eyebrow,
rather than to the heading itself, so it cannot cross the eyebrow text.

Showcase split sections center media against the text content, excluding the
decorative rule above the heading. Single-image showcases follow `imagePosition`.
All logical sections use `--section-gap` in `styles.css`: 48px on small
screens, scaling to 96px. `sectionSpacing.css`, imported after block styling,
assigns half this gap to each side of a section. The tallest content column
defines its height; section minimum heights and tone-dependent spacing are
overridden. The first section additionally reserves the overlaid header.
Do not add per-section spacing values to page data. Journey headings and
footer images follow the same rhythm. Staggered showcase images stay within
their media container; floating resource stacks reserve their actual rotated
card height through a ResizeObserver, including image/font loads, without
following entrance or hover animation. Expanded cards retain the collapsed
stack's layout space and center vertically on their enclosing journey section;
the center updates when that section resizes. Decorative heading rules
are excluded from alignment and spacing.

Floating resource cards animate opening and closing from their current visible
geometry over 400ms. After a card has been opened, it resumes only its floating
animation when collapsed; the initial entrance animation must not replay.

Split callouts support `theme: 'yellow'` for a cream background, gold heading
and example label, and a gold showcase rule. Example: `callout: { theme:
'yellow', heading: text('callout.heading'), text: text('callout.text') }`.

Pages may set `theme: 'green' | 'yellow' | 'blue' | 'light-blue'` in shared structure.
The app applies it through a `site-theme` wrapper, independently of section
light/dark tones. CSS tokens `--theme-green`, `--theme-yellow`, and
`--theme-blue` resolve to `--page-accent` and contrasting `--page-accent-text`.
Home uses green, pedagogy light blue (`--theme-light-blue`, shared with the
journey curve and heading circle), and resource coordination blue (the current
dark-background palette color). The filled Contact button and shared accents
follow these tokens. Pedagogy callouts and their labels/icons use matching
light-blue tints. Generated project pages inherit their source page theme;
unassigned pages, including research, retain the default blue accent for now.

Images and frames share `--corner-radius` in `src/styles.css`. Standard frame
rules use this variable instead of independent radii. Override it locally or
apply `radius-none` for square corners; circular portraits/controls and logo
artwork retain explicit shape exceptions. Section backgrounds span the viewport
without rounded corners or side insets.

`split` supports `layout: 'stacked'` to render its text above its image(s),
independently of the usual alternating image position. The digital-teaching
section in `pedagogikk/structure.ts` is a complete example.
Omit it or use `layout: 'split'` for the two-column layout.
`layout: 'showcase'` places the copy and actions on the left and a five-image
collage on the right. The first image spans both collage rows; the remaining
four form two columns with a small stagger. An optional
`callout: { icon: 'lightbulb', text: text('callout') }` adds a highlighted note.
The icon is optional. A localized `action: { label: text('link.label'),
href: text('link.href'), external: true }` can place a link inside the note.
Journey highlights may also use `variant: 'callout'`, as in the ARTS highlight.
Both use the shared `content-callout` frame, with normal-weight links.
The teacher-education section demonstrates this layout and localized callout.
An optional `imageStrip` array of `{ id, src, alt }` replaces the single/pair
display with a horizontal row of equal-size images cropped to their frames. Alternate
images sit lower. Equal grid columns fill the full main content width.
The shared `--image-strip-height` and `--image-strip-offset` CSS values control
the height and stagger of the tall, narrow frames.
The teacher-education section demonstrates the structure, with image sources
and order in shared data and alt text in the locale file.

Every logical page section alternates light/dark by its position in the shared
`sections` array, starting with `startTone: 'light' | 'dark'` in that page's
shared structure (light if omitted). `sectionTone.ts`, `App`, and `SectionRenderer`
apply the one sequence across every block type and through case-study groups.
Group wrappers and development tracing wrappers do not count as sections.
Image/text positioning has its own case-study sequence and does not determine
background color. Palette colors are controlled by `--palette-*` in styles.css.

The content width is controlled by `--main-content-max-width` at the top of
`src/styles.css`. Main sections always span the full viewport so their
light and dark background colors reach both screen edges. This also applies
to journey blocks and shared case-study surfaces. Content retains its shared
maximum width and internal horizontal padding.
Footers retain full-width backgrounds. Text sections can set `surface: 'full'`
to retain a full-width background, as in the resource-coordination intro.
Case-study groups can set `caseStudyGroup.sharedSurface: true` to share one
surface and the first section's tone across the group. The three Kuben cases
use this with `tone: 'light'`; their content remains separate reusable sections.
The teaching-resource library uses one dark surface for its introduction and
cards, without a decorative triangle; video teaching explicitly uses light tone.
Their responsive inline padding
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

Principles `leadImage` uses a circular crop. Configure its framing in shared
page structure with `zoom: 1`, `positionX: 0`, `positionY: 0`, and
`flipHorizontal: true`. Zoom is a scale factor; X/Y move the image by a
percentage of the frame (positive right/down), independently of the intro animation.

Principle features can set `iconTone: 'blue' | 'yellow' | 'green'` to render
the line icon on a softly tinted circular background. Example:
`{ id: 'traceable', icon: 'search', iconTone: 'green', /* localized text */ }`.
Resource coordination uses blue, yellow and green in its shared feature order.
The intro title begins 1400ms after portrait readiness and reveals linearly
over 400ms. Its animation-end event starts a 2.2s linear reveal of the dashed
SVG wave in `PrinciplesFlowPath`. Three equal-width feature columns alternate
between peaks and troughs. Each feature's heading and description animate
together: odd features downward from the upper icon, even features upward
from the lower icon. The path reaches each icon before revealing its feature,
and all features are explicitly visible when the reveal completes. Geometry
updates on resize and font loading. Narrow screens stack the features along
a vertical dashed path; reduced motion shows the full path and text immediately.
`--principles-curve-softness` in `principlesFlow.css` controls the bends between
features: 0 retains the original steep bends, 1 gives the gentlest bends, and
0.4 is the default. The title connection begins with a short horizontal lead
before curving upward. CSS changes remeasure the SVG without requiring a reload.
Feature columns use the configured text maximum width and equal spacing, with
the last text field flush to the main content edge. Spare desktop width adds
up to 100px before the first feature, giving the title connection a gentler
curve. Below 1200px the heading occupies its own row; below 900px the feature
flow stacks vertically.

Reusable blocks may expose a named visual `variant` while retaining their
content-driven data shape. The resource-coordination page uses:

- `TitleBlock` with `variant: "editorial"` for an introduction, image collage,
  highlights, and handwritten-style note.
- `TextBlock` with `variant: "principles"` for a feature flow with line
  icons, and `variant: "cta"` for a closing section.
- `GalleryBlock` and `SplitBlock` with `variant: "caseStudy"` for portfolio
  cases. `tone`, `eyebrow`, `note`, and optional `caseStudyGroup` settings remain page data.

Line icons use stable names from `LineIconName` and render through the shared
`components/ui/LineIcon.tsx` component. Consecutive cases with the same
`caseStudyGroup.id` are grouped by `CaseStudyGroup` to share surfaces and layout sequencing. Institution logos are stored
in `src/media/Institusjoner logo/` and render without a frame, background, or visual
effect. Add content in page data; do not duplicate these layouts inside page
JSX.

## Standard project detail pages

Project definitions may set `showPreviewImage: false` to omit the detail-page
preview and its caption while retaining the source image on the overview.
The equipment-for-learning project demonstrates this setting.
Use `excludedGalleryImageIds: ['yamaha-mixer-guide']` in a project definition
to omit selected gallery images and captions from its detail page by stable ID.

Both `institutionCards` and `teachingInstitutionCards` support `appearance:
'branded'`. They share `InstitutionCardFrame` for the card surface and decorative
logo watermark, and the same branded CSS for colors, layout and responsiveness.
Example: `{ id: 'institutions', type: 'institutionCards', appearance: 'branded',
cards: [/* existing institution data */] }`. Resource coordination uses this
appearance while retaining its descriptions and icon highlights.

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
imageFit: 'contain'`. The heading uses the shared
`--section-title-font-size` scale; localized text remains in the page locale.
Floating journey cards may contain only `id`, `resourceId`, and `categoryId`;
thumbnail, title, description, tools and files resolve from the resource
collection. Four stack positions are shared across steps rather than tied
to resource IDs. A final journey step may set
`footerImage: { src: studentImage, alt: text('image.alt') }` to retain an image
below the complete group of numbered steps. The group renders this image
from shared structure and resolved localized alt text.
### Three and four institution cards

`teachingInstitutionCards` can set `appearance: 'branded'` for navy gradient
cards in a two-column grid (one on mobile). This appearance keeps identity
and subjects side by side inside each card, with a subtle internal divider.
An oversized decorative mask uses each card's own institution logo, tinted
blue and cropped at the lower-right edge. The original logo stays in the
identity area; text, roles and subjects still resolve from localized data.
The pedagogy institution section demonstrates this appearance with four cards.

`teachingInstitutionCards` accepts `variant: 'three' | 'four'`. All institution
collections show at most two cards per row and switch to one on narrow screens.
The four-card variant uses a container query at 35.5rem for two columns;
card headers and subject sections align through grid subgrid.

```ts
{ id: 'schools', type: 'teachingInstitutionCards', variant: 'four',
  subjectsLabel: text('schools.subjectsLabel'), cards: [/* four cards */] }
```

Institution logos belong in shared structure; school names, periods, roles,
subject lists and logo alt text belong in language-specific page content.

### Research study block

`researchStudy` renders a numbered editorial study using a single light surface.
Its ordered `parts` accept localized headings and paragraphs, optional question,
abstract disclosure, icon facts, findings, outcome and document/landscape image.
Example: `{ id: 'study', type: 'researchStudy', tone: 'light', parts: [
{ id: 'study-intro', label: text('study.label'), heading: text('study.heading'),
paragraphs: paragraphs('study.paragraphs') } ] }`.
The research page supplies a complete four-part example. Missing study images
render labeled placeholders with HTML comments identifying the expected file.
Add `master-forside.png` and `master-koding.png` under `frontend/src/media/forskning/`
to replace them automatically on the next build.

### Interactive research visualizations

The research-study part `master-findings` embeds a `researchVisualizations`
section through its optional `visualization` field. Both the outer study and
the nested section resolve through `SectionRenderer`; no route or fifth study
part is added. The visualization module is loaded lazily.

Example shared structure:

```ts
visualization: {
  id: 'study-visualizations', type: 'researchVisualizations', datasetId: 'master',
  heading: text('study.visualizations.heading'),
  paragraphs: paragraphs('study.visualizations.paragraphs'),
  views: [{ id: 'study-model', kind: 'concepts',
    heading: text('study.model.heading'), paragraphs: paragraphs('study.model.paragraphs') }],
}
```

`views` supports `concepts`, `relations`, `comparison`, and `process`. Order,
stable IDs, dataset choice and view kinds belong in page structure. Editorial
explanations belong in the page's language file; shared controls use
`useTranslation()` with `i18n/locales/no.ts`. Source paraphrases and original
concept labels remain in the canonical research dataset, preserving their
wording. A future translation can supply display labels keyed by concept IDs
without translating or replacing the underlying source evidence.

The canonical package lives at `frontend/src/data/research-visualization/`.
Its JSON, CSV exports, sources, scripts and methodological documentation stay
together. JSON is the sole data source; CSV files are inspection exports.
`lib/researchVisualization/model.ts` contains the typed adapter and common
filtering pipeline. SVG/table components never maintain their own datasets.
`projectPairs` feeds both network and relation overview; original matrix status is a
separate analytical axis. Global memo/matrix interpretation is hidden in an
individual view unless explicitly enabled. Expert Z is opt-in and never
counted as a primary informant. No selected tiers produces an empty relation
layer; conceptual definitions remain readable. The process is analytical-only.

JSON and CSV exports identify their scope as the active relation selection,
include filter metadata, and retain original provenance. JSON additionally
contains scoped observations, active evidence IDs, memos and matrix cells.
SVG export is available for the network and process and embeds filter and
method metadata. The comparison has no invented Z cells or statistical scores.
Secondary figures about game design are not integrated into the research page.

Run `npm.cmd run test:research`, `npm.cmd run test:content`, and
`npm.cmd run build` from `frontend/`. The Node research test executes the actual
production adapter, tests all eight tier combinations, provenance and scope,
and mirrors the package validator's dataset invariants. The original Python
validator is retained for environments with Python installed.

The relation overview now encodes original analytical matrix status rather than
binary membership: clear is a moment-colored circle, possible is gray, and none
is a genuinely empty cell. Active direct or exploratory records cannot promote
a possible matrix cell to clear. The overview requires the analytical layer
and global-model visibility; person/context filters and matrix-status switches
retain the same safeguards as the original matrix. Hidden cells are labeled
as filtered, distinct from an empty none cell. Source inspection retains the
original matrix-cell reference alongside active supporting relations.
The browser test verifies 16 colored cells, 9 gray cells and 3 empty cells.

The current relation dataset is revision 1.1.0 (2026-10-21). The shared adapter
loads `analysis_matrix.json`; `original_matrix.json` is now historical only.
`matrix_revision.json` records ten approved changes, with user-supplied review
sources and per-cell rationales. Relation records with `analysis_included:false`
remain in the canonical archive but are excluded from every active tier,
figure and export. There are 11 clear, 9 conditional and 8 unmarked cells.
See `docs/RESEARCH_DATA_REVISION.md` for the complete change log, provenance,
regeneration instructions and revised validation baselines.

Sections support `background: 'subtle'` in shared structure. SectionRenderer
maps this to the shared `--section-subtle-background` color in styles.css.
Consecutive sections with this setting form a continuous tinted area. The
research page applies it from `photofake` through `research-work`.

Process steps support an optional square `image` above their label:
`{ id: 'analysis', label: text('analysis.label'), description: text('analysis.description'),
image: { src: analysisImage, alt: text('analysis.image.alt'),
overlay: { src: toolLogo, alt: text('analysis.logo.alt') } } }`.
The optional overlay places a contained logo in front of the background image.
The research page's five PhotoFake work steps provide a complete example.

`process` supports `variant: 'horizontalCards'`: square media sits left of the
step copy, using equal-height rows in a six-column grid. Each step declares
`columnSpan` in shared structure; spans `2, 2, 2, 3, 3` create full-width rows
of three and two cards. Below 1100px cards stack while retaining media on the
left. The PhotoFake work section supplies the example.

`split` with `layout: 'coverIntro'` shares `coverIntroduction.css` with the
research study's `variant: 'cover'`. Both use a left-aligned 15rem image,
full-width copy beside it, centered vertical alignment and the same responsive
stacking. Backgrounds remain section data. The PhotoFake introduction is the
example; image choice and copy remain in shared structure and locale content.
`nProcess step images support optional `mobileSrc` for an alternate crop below 650px. Example: `image: { src: desktopImage, mobileSrc: mobileImage, alt: text('image.alt') }`. The research survey step uses this for its logo-free mobile image.

Split sections support an optional objectPosition crop anchor, for example objectPosition: 'right top'. The OsloMet purchasing image uses it; generated project previews retain the same anchor.

Normal split and gallery sections share the stacking breakpoint in frontend/src/sectionLayout.css: @media (max-width: 760px). Edit this one value to control when media moves below copy. Columns remain flexible above it; cover images retain object-fit cropping and their configured objectPosition. Deliberately stacked layouts and cover introductions retain their own behavior.

The home page's localized navigationCards section is the canonical footer navigation. getPages appends that same resolved section exactly once at the end of every page, including generated project pages. It always renders through SectionRenderer and NavigationCardsBlock. Update the cards in hjem/structure.ts and hjem/no.ts to change them everywhere.
