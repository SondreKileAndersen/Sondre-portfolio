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

The portfolio is Norwegian-first. Only Norwegian is currently enabled, but the
content and UI layers are prepared for more languages.

```txt
src/
  i18n/
    config.ts
    locales/
      no.ts

  data/
    pages/
      index.ts
      no.ts
```

`src/i18n/locales/no.ts` contains short, reusable interface strings such as
navigation labels, actions, errors, and accessibility text. React components
read these strings through `useTranslation()`.

`src/data/pages/no.ts` contains localized page metadata, routes, headings, alt
text, and portfolio content. Long content must remain in the page/section data
rather than being embedded in components or translation calls.

### Stable identity and localized routes

Every page has a stable `id` that is independent of language. The ID connects
equivalent pages and page hierarchy. Slugs and paths are localized:

```ts
// Norwegian
{
  id: "about",
  slug: "om-meg",
  path: "/om-meg",
  navTitle: "Om meg"
}

// Possible future English equivalent
{
  id: "about",
  slug: "about",
  path: "/en/about",
  navTitle: "About"
}
```

Child pages use `parentId`, never a localized parent slug:

```ts
{
  id: "cosmic-anchor",
  parentId: "projects"
}
```

### Adding a future language

Do not activate a language until these steps are completed together:

1. Add `src/i18n/locales/<language>.ts` with all shared UI strings.
2. Add `src/data/pages/<language>.ts` with the same stable page IDs.
3. Register resources and the language code in `src/i18n/config.ts`.
4. Register its pages in `src/data/pages/index.ts`.
5. Add locale-aware routes and a language switcher that maps pages by `id`.
6. Update `<html lang>`, page titles, metadata, canonical URLs, and `hreflang`.

Norwegian remains the default and fallback language until another language is
explicitly requested and fully implemented.

## Shared layout controls

The content width is controlled by `--main-content-max-width` at the top of
`src/styles.css`. Main sections always span the full viewport so their
background colors reach both screen edges. Their responsive inline padding
centers and constrains only the content on wide screens. On screens narrower
than the maximum, `--main-content-padding` supplies the small internal space
between content and the viewport edge. These variables do not affect the
header or navigation.

`SplitBlock` follows the portfolio's alternating two-column pattern. Sections
with the image on the right use the dark color variables in `src/styles.css`;
sections with the image on the left use the light color variables. Keep
alternating `imagePosition` values in page data to preserve this rhythm.
