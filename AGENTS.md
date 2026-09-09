# AGENTS.md

## Project goal

This project should use a content-driven React/Next.js structure for a flexible portfolio website.

The architecture must separate:

* content/data
* rendering logic
* reusable React components
* styling

Do not hardcode large amounts of portfolio content directly inside page JSX unless explicitly requested.

## Core architecture rule

Use this mental model:

```txt
content/data
↓
page/section objects
↓
renderer component
↓
specific block component
↓
JSX output
```

Pages should generally be represented as data objects with shared metadata and a list of sections/blocks.

Example:

```ts
const pages = [
  {
    slug: "av-consulting",
    navTitle: "AV Consulting",
    title: "AV Consulting",
    template: "standard",
    seo: {
      title: "AV Consulting",
      description: "AV consulting experience and supplier work.",
      keywords: ["AV", "consulting", "portfolio"]
    },
    sections: [
      {
        id: "av-intro",
        type: "text",
        heading: "AV Consulting",
        body: "Short introduction..."
      },
      {
        id: "av-image",
        type: "image",
        src: "/media/av-room.jpg",
        alt: "AV room with technical equipment"
      },
      {
        id: "av-suppliers",
        type: "logoGrid",
        heading: "Suppliers",
        logos: []
      }
    ]
  }
];
```

## Required pattern for sections

When rendering sections, use a central `SectionRenderer` or equivalent mapping layer.

The renderer is responsible for connecting section `type` values to React components.

Example:

```tsx
function SectionRenderer({ section }) {
  if (section.type === "text") {
    return <TextBlock {...section} />;
  }

  if (section.type === "image") {
    return <ImageBlock {...section} />;
  }

  if (section.type === "logoGrid") {
    return <LogoGridBlock {...section} />;
  }

  return null;
}
```

Do not scatter section-type logic randomly across many page files.

## Component rules

Create reusable block components for recurring content types.

Expected block components may include:

* `TextBlock`
* `ImageBlock`
* `LogoGridBlock`
* `GalleryBlock`
* `ProjectGridBlock`
* `QuoteBlock`
* `MarkdownBlock`
* `CTA_Block`

Each block component should receive data through props.

Example:

```tsx
function ImageBlock({ src, alt, caption }) {
  return (
    <figure>
      <img src={src} alt={alt} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
```

## Content rules

Short text may live directly in data objects.

Long text should not be placed directly inside JSX. Prefer one of these:

* `paragraphs: string[]` for several short paragraphs
* Markdown/MDX files for long descriptions, articles, or case studies
* CMS/API data later if the project becomes backend-driven

Example:

```ts
{
  id: "av-long-description",
  type: "markdown",
  file: "av-consulting-description.md"
}
```

## Media organization rule

Store page-specific media in a folder named after the Norwegian page slug:

```txt
src/media/
  hjem/
  ressurskoordinering/
  prosjekter/
```

Keep media used by only one page in that page folder. Use a clearly named
shared folder only when the same asset is genuinely reused across pages. Put
new assets with an unknown destination in `src/media/ikke-plassert/` until their
page is known; do not guess ownership or leave loose files in `src/media/`.

When moving media, update every import and verify the production build.

## Navigation rule

Navigation should be generated from page data, not hardcoded as repeated links.

Example:

```tsx
function Navigation({ pages }) {
  return (
    <nav>
      {pages
        .filter(page => page.showInNav !== false)
        .map(page => (
          <a key={page.slug} href={`/${page.slug}`}>
            {page.navTitle}
          </a>
        ))}
    </nav>
  );
}
```

## Localization rule

The site is Norwegian-first but must remain ready for additional languages.

Use this separation:

```txt
src/i18n/locales/<language>.ts  -> short shared UI and accessibility text
src/data/pages/<language>.ts   -> localized page metadata and portfolio content
src/i18n/config.ts             -> supported languages and fallback configuration
```

Rules:

* Do not add user-facing text directly to React components when it belongs in
  shared UI. Add it to the active locale in `src/i18n/locales/` and access it
  with `useTranslation()`.
* Keep long portfolio content in typed language-specific page data, not in
  translation calls inside JSX.
* Use stable, language-independent page `id` values for identity, React keys,
  hierarchy, and matching equivalent pages between languages.
* Treat `slug`, `path`, `navTitle`, `title`, headings, paragraphs, alt text, and
  SEO text as localizable values.
* Use `parentId` for page hierarchy. Never connect localized pages by slug.
* Keep Norwegian as `defaultLanguage` and `fallbackLng` until explicitly
  requested otherwise.
* Do not add or enable a language until its UI resources and page data exist.
* When adding a language, update `supportedLanguages`, i18n resources,
  `pagesByLanguage`, routing, the document `lang`, and language-switching links
  together.

## Key rule

When using `.map()`, use stable keys from the data.

Prefer:

```tsx
key={section.id}
key={page.slug}
key={project.id}
```

Avoid generated random keys during render.

Avoid array index as key unless the list is static and never reordered.

## Flexibility rule

Do not force all pages into one rigid class or object with many unrelated optional fields.

Prefer:

* shared base page metadata
* flexible `sections`
* specific block components
* optional custom templates for very unique pages

If a page needs a unique layout, create a page template or page component, but keep reusable content blocks and shared metadata.

## Adding new content

If the requested content type already exists, add only data.

Example:

```ts
{
  id: "new-image",
  type: "image",
  src: "/media/new-image.jpg",
  alt: "Description"
}
```

If the requested content type does not exist, add:

1. a new section type
2. a reusable block component
3. a renderer case in `SectionRenderer`
4. example data using the new section type

Teaching resources are a special recurring content collection. Store each
resource as its own `.ts` document below
`src/data/teachingResources/<language>/`, and store that resource's files under
`src/media/pedagogikk/undervisningsopplegg/<resource-id>/`, and render them
through `TeachingResourcesBlock`. Do not hardcode individual resource cards in
the Pedagogikk page or component JSX. Resource discovery must remain recursive
through `import.meta.glob`; `index.ts`, `toolCatalog.ts`, and
`TEMPLATE.resource.ts` must remain excluded. Tool definitions and logo sources
belong in `toolCatalog.ts`; resource documents should reference catalog entries
through the `@teaching-resources` import alias so they remain independent of
folder depth. Do not generate relative imports to shared teaching-resource files.
instead of repeating logo URLs. Adding a resource document must not require
editing a central import list. Follow
`docs/ADDING_TEACHING_RESOURCE.md`.

Teaching-resource attachments belong in a typed `files` array with stable file
IDs, localized labels, URLs, and optional download behavior. One file opens
directly; multiple files must use the shared file chooser in
`TeachingResourcesBlock`. Keep legacy `resourceUrl` readable, but use `files`
for new and updated resource documents.

For teaching resources, the first folder below the language directory is the
single source of truth for category membership. Category definitions map a
stable `id` to a physical `folder`, and the recursive loader derives
`categoryId` from the import path. New resource documents must not contain a
manually maintained `categoryId`.

## Preferred folder structure

Use or move toward this structure:

```txt
src/
  data/
    pages/
      index.ts
      no.ts
    projects.ts
    suppliers.ts

  i18n/
    config.ts
    locales/
      no.ts

  components/
    layout/
      Header.tsx
      Navigation.tsx
      Footer.tsx

    blocks/
      TextBlock.tsx
      ImageBlock.tsx
      LogoGridBlock.tsx
      MarkdownBlock.tsx
      ProjectGridBlock.tsx

    ui/
      Button.tsx
      Card.tsx
      Container.tsx
      Section.tsx

  pages/
    AboutMePage.tsx
    CodingPage.tsx
    TeachingPage.tsx
    AVConsultingPage.tsx
    PhotofakePage.tsx
    CosmicAnchorPage.tsx

  lib/
    content.ts
    markdown.ts

  types/
    page.ts
    section.ts
    media.ts
```

If using Next.js App Router, adapt the route folder structure, but keep the same separation between data, renderers, block components, and styling.

## Before making changes

Before implementing portfolio/page/content changes:

1. Check this `AGENTS.md`.
2. Check `docs/CONTENT_ARCHITECTURE.md` if it exists.
3. Check the localization rules before adding user-facing text or routes.
4. Preserve the content-driven section/block architecture.
5. Do not replace the structure with hardcoded page JSX unless explicitly requested.
6. Prefer small, reusable components over large page files.

## Done criteria

A change is complete only when:

* content remains separated from rendering where practical
* navigation still comes from page data
* repeated UI is handled by reusable components
* section rendering still goes through a clear renderer/mapping layer
* new content types are documented with an example
* shared UI text is localized and page content stays in language-specific data
* stable page IDs and `parentId` are not replaced by localized slugs
