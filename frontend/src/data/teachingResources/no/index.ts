import type {
  TeachingResource,
  TeachingResourceCategory,
  TeachingResourceDocument,
} from '../../../types/teachingResource'

export const teachingResourceCategories: TeachingResourceCategory[] = [
  { id: 'film', folder: 'film', title: 'Film' },
  { id: 'photo', folder: 'foto', title: 'Foto' },
  { id: 'graphic-design', folder: 'grafisk-design', title: 'Grafisk design' },
  { id: 'interaction-design', folder: 'interaksjonsdesign', title: 'Interaksjonsdesign' },
  { id: 'audio', folder: 'lyd', title: 'Lyd' },
  { id: 'it-operations', folder: 'IT-Drift', title: 'IT-drift' },
  { id: 'process', folder: 'prosess', title: 'Prosess' },
]

const resourceModules = import.meta.glob<{ default: TeachingResourceDocument }>(
  [
    './**/*.ts',
    '!./index.ts',
    '!./toolCatalog.ts',
    '!./TEMPLATE.resource.ts',
  ],
  { eager: true },
)

export const teachingResources = Object.entries(resourceModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, 'no'))
  .map(([path, module]): TeachingResource => {
    const categoryFolder = path.match(/^\.\/([^/]+)\//)?.[1]
    const category = teachingResourceCategories.find(
      (candidate) => candidate.folder === categoryFolder,
    )

    if (!category) {
      throw new Error(
        `Teaching resource "${path}" is not inside a registered category folder.`,
      )
    }

    return {
      ...module.default,
      categoryId: category.id,
    }
  })
