import { text } from '../../../lib/pageContent'
import type { ContentFor, ProjectStructure } from '../../../lib/pageContent'

export const structure = {
  startTone: 'light', sourcePageId: 'pedagogy', sourceSectionId: 'reusable-learning-resources',
  id: 'reusable-learning-resources-project', slug: text('slug'), path: text('path'), title: text('title'),
  eyebrow: text('eyebrow'), introduction: text('introduction'),
  metadata: [
    { id: 'area', label: text('metadata.area.label'), value: text('metadata.area.value') },
    { id: 'role', label: text('metadata.role.label'), value: text('metadata.role.value') },
    { id: 'focus', label: text('metadata.focus.label'), value: text('metadata.focus.value') },
  ],
} as const satisfies ProjectStructure
export type PageContent = ContentFor<typeof structure>
