# Research visualizations: integration and validation

The four primary figures are embedded in `/forskning#master-visualizations`,
inside the existing fourth master-study part. PhotoFake and the other three
master-study parts are unchanged by this integration. Start locally with
`npm.cmd run dev` from `frontend/`.

## Files

- `frontend/src/data/research-visualization/`: original package moved intact
  from `data/pages/arts-metoden/codex_kvalitative_data_pakke/`.
- `frontend/src/lib/researchVisualization/model.ts`: typed data adapter,
  scoping, grouping, relation overview memberships and export payloads.
- `frontend/src/components/research/`: figures and the shared source panel.
- `frontend/src/components/blocks/ResearchVisualizationsBlock.tsx` and its CSS:
  filter state, views, export controls and layout.
- Existing `SectionRenderer`, `ResearchStudyBlock`, page types, Forskning
  structure/content and Norwegian UI resources connect the block to the site.
- `frontend/scripts/test-research.cjs`: dataset and adapter regression tests.
- `frontend/scripts/test-research-browser.cjs`: optional end-to-end browser
  check using built-in Node APIs and the local Chromium DevTools protocol.

## Meaning of filters

Direct, analytical and exploratory are independent booleans, defaulting to
on/on/off from the manifest. Switching views preserves all filters. Changing
filters closes stale source selections. Status filters apply only to matrix
provenance, never to a direct record for the same endpoints. Original matrix
cells retain their clear/possible/none values; none is not disproof.

Person-specific views scope displayed evidence to that person. Global memo
and matrix synthesis is hidden unless the separate overlay is enabled; it is
explicitly labeled as cross-informant interpretation. Z requires an explicit
checkbox and is excluded from A–E counts. Samlet is never counted as an
informant. The comparison is based on its curated source-linked stances and
has no Z cells. It is shown with the direct layer and is empty if that layer
is disabled. Context and format filters use annotations only. The process and
original matrix have no such edge/cell annotations, so selecting a specific
context or format hides those global models.

The conceptual model's equal-size nodes describe analytical categories,
not measured importance. Its central connection represents the memo synthesis,
not a new empirical relation. The relation overview shows all seven sources
as separate rows, even when they share the same moment memberships. Row and
cell inspection scopes provenance to that source or pair. All layers off
shows the explicit empty state instead of a seven-row result.

## Checks performed

- `npm.cmd run test:research`: passed dataset invariants and all eight layer
  combinations (0, 38, 41, 79, 6, 44, 47, 85 relation records with Z enabled).
  Also tested shared network/relation overview memberships, sources, matrix statuses,
  person scoping, expert exclusion, global synthesis and context filtering.
- `npm.cmd run test:content`: passed the existing 19-page architecture,
  translation, stable-ID, route and content-composition checks.
- `npm.cmd run build`: passed TypeScript and the production Vite build.
- Headless Edge through its local DevTools protocol: tested all eight toggle
  combinations in the actual UI, 28 original-matrix cells, 50 comparison cells,
  negative-case label, source opening by keyboard, Escape dismissal, process
  empty state, person filtering, and mobile/desktop rendering. No runtime
  exceptions or document overflow at a 390px viewport. SVG diagrams use their
  own horizontally scrollable region on narrow screens.
- The original matrix image was visually inspected against the rendered
  matrix source structure. Canonical data and sources were not rewritten.

The command `python scripts/validate_dataset.py` was attempted in the package
directory, but the machine exposes only an unavailable Windows Python alias.
The Node regression suite therefore runs equivalent dataset checks using the
existing project runtime. The original Python script remains unchanged.

Run the browser check with `npm.cmd run test:research:browser` from `frontend/`.
It starts and stops its own Vite server and headless browser. The default
browser is Edge at its standard Windows location; `BROWSER_EXECUTABLE` can
override the executable path. Ports 5197 and 9337 must be free. Screenshots
and exported JSON/CSV/SVG are saved in a newly created temporary directory
printed by the script. Downloads were checked for filter metadata, scoped
observations, and a standalone SVG. The test uses a separate temporary browser
profile, without accessing the user's normal browsing session.

The research test also checks every original file against the package's
`SHA256SUMS.txt`. Intentional research-data revisions must update that
baseline together with their documented methodological justification.

## Methodological limits

The direct layer remains a conservatively curated subset of the codebook;
the remaining notes have not been automatically upgraded using keywords.
Observations are codebook paraphrases, not verbatim transcripts or independent
interview events. Five flagged extracts require manual source review.
Standpoints are selectively annotated, and absent entries are not disagreement.
There are no importance scores, causal effects or transition probabilities.

The implementation has not been fully audited against every page of the
source PDF. The five flagged extracts, 38 direct relations and selected
negative cases still require the researcher's scholarly review before the
figures can be described as publication-ready. Neither secondary game-design
traceability nor unverified design decisions are shown.

## Movable diagram nodes and moment colors

The concept, relation-network and process diagrams support pointer dragging
(mouse, pen and touch). A shared SVG geometry helper converts screen positions
to diagram coordinates, constrains nodes to the canvas, and reconnects paths
at the actual rectangle boundary when nodes move or cross sides. Arrow keys
move a focused node by 10px, or 30px with Shift. Enter/Space still inspect its
sources. A 4px drag threshold separates a click from a move; a completed drag
does not open the source panel. Invisible wide hit targets keep thin edges
clickable. Process arrows retain their direction markers.

Positions are presentation state, preserved across filters and view switches
within the current mounted block. They are not written to the research data
or persisted across a page reload. The localized reset control restores the
initial layout. Resizing clamps visible boxes inside the new diagram bounds.
SVG export includes the current positions, colors and line opacity.

The relation network's initial/reset composition follows the approved reference:
developer foundation above, project foundation below, mediation on the left,
press material on the right, with all seven source nodes at specified interior
positions. `networkLayout` in the presentation data stores reference centers;
these scale with the canvas and do not rearrange when filters change. Manual
dragging remains available and reset always restores this composition.

`data/researchVisualizationPresentation.ts` defines the moment palette:
M_DEV #FAF8CD, M_FORM #C1F8D9, M_PRESS #D9E6FA, M_PROJ #FAD4D7.
It also maps process-node IDs to their corresponding moments. This is display
configuration; the original package and its checksums remain unchanged.
The same colors are used in concept/network nodes, corresponding paths,
process moments, matrix/relation overview headers and the overview finding cards.
Line dash patterns still identify the evidence tier independently of color.
Analytical lines use 1.5px strokes at 45% opacity; exploratory lines use 1px
strokes at 40% opacity. Source selection remains available on every relation.

SVG coordinate scaling now tracks rendered width so labels use the same
`--body-font-size` as the explanatory paragraphs. Node dimensions come from
measured text or wrapped descriptions, with a small shared padding. Font-load
and resize events remeasure the layout.

The browser regression suite additionally checks pointer/touch/keyboard
movement, updating edge geometry, drag-click suppression, exact moment colors,
label/body font-size equality, compact bounds, view-switch persistence and reset.

The relation overview now encodes original analytical matrix status rather than
binary membership: clear is a moment-colored circle, possible is gray, and none
is a genuinely empty cell. Active direct or exploratory records cannot promote
a possible matrix cell to clear. The overview requires the analytical layer
and global-model visibility; person/context filters and matrix-status switches
retain the same safeguards as the original matrix. Hidden cells are labeled
as filtered, distinct from an empty none cell. Source inspection retains the
original matrix-cell reference alongside active supporting relations.
The browser test verifies 16 colored cells, 9 gray cells and 3 empty cells.

In the relation overview, horizontal decorative connectors run between the
centers of the first and last visible clear (colored) markers in each row.
A row with only one clear marker has no connector. Possible markers are
hollow gray outlines, with the table surface masking any line behind them.
The decorative lines do not create relationships or affect source selection;
filtering clear statuses removes their connectors. Browser checks cover marker
alignment, endpoints, single-marker rows and the hollow-marker appearance.

The relation overview is transposed: its X axis contains the seven separate
paratext/source columns and its Y axis the four moment rows. Moment colors
follow the row headings and their clear markers. Each of the 28 cells retains
its original source-to-moment matrix identity and source inspector. Horizontal
connectors now span the first/last clear source column for each moment.
The separate original-matrix tab has been removed; its canonical data and
source links remain available through the relation overview. Browser
checks verify axis labels, all 28 unchanged statuses, connectors and column
source inspection. The wide overview scrolls horizontally on narrow screens.

Relation-overview labels are plain text buttons without frames. Moment row headers retain their palette-colored backgrounds, without inner button frames. No additional
rectangular button backgrounds are used. Hovering a source heading, or focusing it by keyboard,
keeps only moment rows with a visible clear classification fully opaque; all
other rows, including labels, markers and connectors, fade to 8% opacity.
Leaving the heading restores all rows. This is temporary visual emphasis, not
a filter or a change in classification. Touch does not create sticky hover.
Source inspection remains available and reduced-motion preferences remove the
fade transition. Browser checks cover both possible and absent connections,
restoration, and removal of text-button frames.

## Reordering source columns

Drag any source-heading text horizontally to reorder that column, or use
Alt+Left/Right while the heading has focus. The same ordered source IDs drive
headings, all moment cells and the first/last-clear-marker connectors. Source
inspection and hover emphasis remain keyed by source ID, not column position.
A horizontal drag threshold suppresses accidental source clicks; vertical touch
movements remain available for page scrolling. The localized reset control
restores the original seven-column order.

`columnOrder.ts` separates the pointer gesture and saved presentation preference
from the canonical dataset. The order is held in the containing block so it
survives view/filter changes and saved in localStorage under the stable block
ID. Invalid/stale saved IDs are discarded and newly known IDs appended. If
storage is unavailable, reordering still works in memory. No research data is
rewritten. Browser checks cover mouse/touch/keyboard moves, cell identity and
classification, recomputed connector endpoints, persistence, reset and source
click suppression during dragging.

Moment-heading hover and keyboard focus provide the reciprocal emphasis:
source columns without a visible clear classification for that moment fade
to 8% opacity, including column labels, cells, markers and connector segments.
Leaving the heading restores the overview. Pointer hover takes precedence over
keyboard emphasis on the other axis. Touch remains exempt from sticky hover;
classification and source inspection are unchanged. Browser checks verify
clear, possible and absent source columns plus full restoration on leave.

When a moment is emphasized, other moment rows also fade. In its selected row,
only clear source connections remain fully visible. Column fading now applies
to marker/button content rather than the cell itself, keeping the horizontal
connector continuous. During this emphasis connectors render above hollow
possible markers, while filled clear markers remain above the line. Browser
checks verify the selected-row emphasis and the uninterrupted connector layer.

## Overview width and heading text

The empty top-left corner has no visible title. Source-column headings use
normal weight and localized display names, including Direkte kontakt (E-post)
and Synlig aktivitet på utvikling. Display headings live in the Norwegian UI
resources; canonical research wording is unchanged. Soft hyphens allow
Prosjekt-nettside, Utvikler-side and Presse-pakke at narrow widths, without
showing a hyphen when the whole word fits. Accessible names omit soft hyphens.

Adjust `--research-overview-width` at the top of
`frontend/src/components/blocks/researchVisualizations.css` to set the table
width, for example `100%`, `1000px` or `64rem`. A fixed table layout keeps the
seven source columns equally wide; the moment-label column uses 12rem. A 760px
minimum preserves readable horizontal scrolling on small screens. Dots and
connector segments remain centered as the width changes.

Column-heading display now uses one unbroken line rotated upward to the right.
Adjust `--research-overview-heading-angle` near the top of
`researchVisualizations.css` (default `45deg`). Positive values tilt upward;
header space follows the angle. This overrides soft-hyphen wrapping in this
view without changing the underlying localized labels. Transparent heading
cells do not intercept pointers over neighboring rotated labels, preserving
hover, source clicks and column dragging. Browser checks and build pass.

Source headings now have a diagonal rule beneath the entire label, joining an
8px vertical tick at the column center. The rotated button uses its lower-left
corner as its anchor. Hover or keyboard focus makes the label bold (700), while
its resting weight stays the body weight. The angle variable still controls
both text and its rule. Browser interactions and production build pass.

## Current analytical data revision

The original 16/9/3 matrix and 85-active-relation baseline above are historical.
Version 1.1.0 uses `analysis_matrix.json`, with 11 clearly justified functions,
9 indirect/conditional functions and 8 not sufficiently justified cells.
All views share 77 currently included relations; excluded historical records
retain their original evidence. See `RESEARCH_DATA_REVISION.md` for the ten
changes, source documents, revised semantics and regeneration/validation.
This revision changes data and methodological wording; visual design is retained.

## Contextual source panel

The figure and source panel share a desktop grid. `--research-overview-width` controls the figure share (60%); the remaining width holds the panel. The panel matches the plot height and scrolls internally. Below 1000px it sits beneath the figure. Hover, keyboard focus and selection update the panel; X or Escape clears it. The last selection remains available when the pointer moves into the panel.

The panel shows human-readable relation summaries and informant paraphrases, with informants named explicitly. Technical relation/observation identifiers, provenance fields, source-status codes, PDF links, memo sections and revised-matrix records are omitted from this presentation. Canonical data and exports retain their provenance.

## Standalone connection overview

`master-connection-overview` is a separate page section after the master study, rendered through `SectionRenderer` with the existing `researchVisualizations` block and `presentation: 'overview'`. Its single relations view renders `RelationRowsFigure` directly, with no view menu or network/overview submenu. It retains its own filters, source panel, exports and persistent column order. The exploration section retains the network, concept, comparison and process views. Both sections consume the shared research model.

For the standalone overview, ResizeObserver aligns the source panel from the first moment row to the bottom of the connection legend, excluding the tall rotated headings. Panel typography uses the measured column-label font size, including its heading and observation paragraphs. Mobile retains the stacked scrollable panel.

Source selection now changes on activation/click only; hover/focus retain visual relation emphasis without changing the panel. Selected column/moment labels use bold text, while the selected matrix point has an outer black ring. Unselected moment labels use normal weight. The source title is a slightly enlarged bold paragraph and the close button is removed (Escape still clears selection). Curated panels omit counts, method/code-ID labels and case-analysis/warning sections at user request; canonical evidence and exports retain these details. The blank-cell legend sentence is omitted.

Source panels now omit the selection title and classification text. Each curated cell starts with localized assessment wording, a moment-colored pill and its paratext name, followed by a divider and informants. Desktop panels remain fixed after their natural position reaches the viewport top margin and yield to the next source slot (or footer); mobile keeps normal stacked flow. Hover growth uses 180ms transitions, disabled for reduced-motion preferences.
The assessment introduction is also sticky within its own evidence section while scrolling inside the panel; the next cell introduction naturally replaces it.

The overview source panel extends through the explanatory paragraph below the legend. Download/export controls have been removed from the UI. Informant records use compact bullet lists, capitalized and punctuated for display only; raw evidence remains unchanged. The assessment and its emphasis share typography, and only the sticky assessment divider remains above the first informant. Context sections render only when nonblank scoped codes exist.

The overview now derives mark visibility from remaining curated code text in the active informant/expert scope. Cleared cells (all four external-project-info pairs and project-grounding/activity) have no point or source button. Connectors and hover emphasis use the same effective statuses; grouped source selections omit these empty cells. Canonical analytical classifications are preserved as historical/review metadata. The default overview contains 10 clear points, 5 indirect points and 13 blank cells.

The user retired P_PROJECTWEB (Ekstern info om prosjektet) entirely. data/active_scope.json centrally removes that identity from active concepts, relations, matrix cells and curated evidence in the shared model; source imports remain historical records. Network nodes, selectable columns, saved column order validation, source lookup and model exports all use these active collections. There are six active paratexts and 24 matrix cells. This retirement is separate from the earlier evidence-only cell removals.

A decorative pointer-hand guide with a radial wash matching the figure background is shown over the overview until its first pointer, click or keyboard activation. It never intercepts input. Session storage preserves dismissal for the current tab, with an in-memory fallback when storage is unavailable. Hover alone does not dismiss it.

Paratext column labels now live in the table footer, below the moment rows. Their positive rotation slopes down to the right; each continuous SVG connector starts at the top of the footer, descends through its tick and follows the top edge of the rotated label. Dragging, keyboard reordering, selection and hover behavior are retained.

The overview has centered gray headings over the moment and paratext regions, an upper rule above the first moment row and a narrower first paratext column. Its small two-line legend sits in the moment column of the footer. The external-information footnote now precedes the analytical interpretation note. Point cells have no horizontal padding so their markers remain centered over column ticks at compact widths.

The overview order is now fixed in overviewSourceOrder: direct contact, Steam, trailer, external developer information, development activity and press kit. Dragging, keyboard sorting, saved-order loading and sorting controls are removed from this view. Footer height follows measured rotated-label geometry, bringing the footnote and explanatory paragraph closer; the compact legend is vertically centered in that footer space.

Paratext labels have returned to the table header, sloping upward to the right with continuous ticks and label strokes. The moment/paratext group names now sit in the footer; the paratext bracket uses a lower horizontal rule and upward-facing outer ends. The compact legend follows below the footer group labels.

Responsive overview widths are configured in CSS: --research-overview-width-target (50%, relative to the site maximum content width, or px/rem), --research-overview-width-min (30rem) and --research-source-width-min (20rem). The source column absorbs available-width changes first; once its minimum is reached, the figure shrinks toward its minimum. Below the combined minimums plus column gap, the source moves below the figure and above the inline legend/footnote/description. The compact legend is horizontal again. Very narrow screens scroll the minimum-width table within its own region without widening the page. Sticky source positioning follows this layout state rather than a fixed viewport breakpoint.
