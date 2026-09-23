
import { text } from '../../../lib/pageContent'
import type { ContentFor, ProjectStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light',
  sourcePageId: 'resource-coordination',
  id: "oslomet-purchasing-project",
  slug: text("slug"),
  title: text("title"),
  sourceSectionId: "oslomet-purchasing",
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
      id: "duration",
      label: text("metadata.duration.label"),
      value: text("metadata.duration.value"),
    },
    {
      id: "system",
      label: text("metadata.system.label"),
      value: text("metadata.system.value"),
    },
  ],
  path: text("path"),
} as const satisfies ProjectStructure

export type PageContent = ContentFor<typeof structure>
