import { text } from '../../../lib/pageContent'
import type { ContentFor, ProjectStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light', sourcePageId: 'pedagogy', sourceSectionId: 'arts-method',
  id: 'arts-method-project', slug: text('slug'), path: text('path'), title: text('title'),
  eyebrow: text('eyebrow'), introduction: text('introduction'),
  metadata: [
    { id: 'area', label: text('metadata.area.label'), value: text('metadata.area.value') },
    { id: 'role', label: text('metadata.role.label'), value: text('metadata.role.value') },
    { id: 'method', label: text('metadata.method.label'), value: text('metadata.method.value') },
  ],
} as const satisfies ProjectStructure
export type PageContent = ContentFor<typeof structure>
