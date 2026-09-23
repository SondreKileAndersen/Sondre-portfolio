
import { text } from '../../../lib/pageContent'
import type { ContentFor, ProjectStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  sourcePageId: 'resource-coordination',
  id: "teaching-studio-project",
  slug: text("slug"),
  title: text("title"),
  sourceSectionId: "teaching-studio",
  eyebrow: text("eyebrow"),
  introduction: text("introduction"),
  metadata: [
    {
      id: "organization",
      label: text("metadata.organization.label"),
      value: text("metadata.organization.value"),
    },
    {
      id: "role",
      label: text("metadata.role.label"),
      value: text("metadata.role.value"),
    },
    {
      id: "area",
      label: text("metadata.area.label"),
      value: text("metadata.area.value"),
    },
  ],
  path: text("path"),
} as const satisfies ProjectStructure

export type PageContent = ContentFor<typeof structure>
