import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  TeachingResource,
  TeachingResourceFile,
  TeachingResourceFormat,
  TeachingResourceTool,
} from '../../types/teachingResource'
import type { TeachingResourcesSection } from '../../types/page'

const formatClassNames: Record<TeachingResourceFormat, string> = {
  pdf: 'teaching-resource-card--pdf',
  video: 'teaching-resource-card--video',
  presentation: 'teaching-resource-card--presentation',
  other: 'teaching-resource-card--other',
}

function ToolBadge({ tool }: { tool: TeachingResourceTool }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = tool.logoSrc && !logoFailed

  return (
    <li title={tool.name}>
      {showLogo ? (
        <img
          src={tool.logoSrc}
          alt={tool.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span>{tool.name}</span>
      )}
    </li>
  )
}

function getResourceFiles(resource: TeachingResource): TeachingResourceFile[] {
  if (resource.files?.length) return resource.files
  if (resource.resourceUrl) {
    return [{ id: `${resource.id}-primary`, label: resource.title, url: resource.resourceUrl }]
  }
  return []
}

function TeachingResourceCard({
  resource,
  onChooseFiles,
}: {
  resource: TeachingResource
  onChooseFiles: (resource: TeachingResource) => void
}) {
  const { t } = useTranslation()
  const files = getResourceFiles(resource)
  const downloadIcon = <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
    <path d="M12 3v11m-4-4 4 4 4-4M4 17v3h16v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  return (
    <article className={`teaching-resource-card ${formatClassNames[resource.format]}`} data-category={resource.categoryId}>
      <div
        className="teaching-resource-card__media"
        data-category={resource.categoryId}
      >
        <img src={resource.thumbnailSrc} alt={resource.thumbnailAlt} loading="lazy" decoding="async" />
        <span className="teaching-resource-card__type">
          {resource.typeLabel}
        </span>
      </div>
      <div className="teaching-resource-card__content">
        <strong className="teaching-resource-card__title">{resource.title}</strong>
        <p>{resource.description}</p>
        <div className="teaching-resource-card__footer">
          {resource.tools.length > 0 && (
            <div className="teaching-resource-card__tool-row">
              <ul>
                {resource.tools.map((tool) => (
                  <ToolBadge key={tool.id} tool={tool} />
                ))}
              </ul>
            </div>
          )}
          {files.length === 1 && <a
            className="teaching-resource-card__action-icon"
            href={files[0].url}
            target="_blank"
            rel="noreferrer"
            download={files[0].download || undefined}
            aria-label={files[0].label}
          >{downloadIcon}</a>}
          {files.length > 1 && <button
            className="teaching-resource-card__action-icon"
            type="button"
            aria-label={t('teachingResources.filesFor', { title: resource.title })}
            onClick={() => onChooseFiles(resource)}
          >{downloadIcon}</button>}
        </div>
      </div>
    </article>
  )
}

function ResourceFilesDialog({
  resource,
  onClose,
}: {
  resource: TeachingResource | null
  onClose: () => void
}) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (resource && !dialog.open) dialog.showModal()
    if (!resource && dialog.open) dialog.close()
  }, [resource])

  const files = resource ? getResourceFiles(resource) : []

  return (
    <dialog
      className="teaching-resource-files"
      ref={dialogRef}
      aria-label={resource ? t('teachingResources.filesFor', { title: resource.title }) : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {resource && (
        <div className="teaching-resource-files__panel">
          <header>
            <strong>{resource.title}</strong>
            <button
              type="button"
              aria-label={t('teachingResources.closeFiles')}
              onClick={onClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <p>{t('teachingResources.chooseFile')}</p>
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  download={file.download || undefined}
                >
                  {file.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  )
}

export function TeachingResourcesBlock({
  heading,
  introduction,
  categories,
  resources,
}: TeachingResourcesSection) {
  const [selectedResource, setSelectedResource] = useState<TeachingResource | null>(null)
  const populatedCategories = categories.filter((category) =>
    resources.some((resource) => resource.categoryId === category.id),
  )

  return (
    <section className="teaching-resources">
      <header className="teaching-resources__header">
        <h2>{heading}</h2>
        {introduction && <p>{introduction}</p>}
      </header>
      {populatedCategories.map((category) => (
        <section className="teaching-resources__category" key={category.id}>
          <header>
            <h2>{category.title}</h2>
            {category.description && <p>{category.description}</p>}
          </header>
          <div className="teaching-resources__grid">
            {resources
              .filter((resource) => resource.categoryId === category.id)
              .map((resource) => (
                <TeachingResourceCard
                  key={resource.id}
                  resource={resource}
                  onChooseFiles={setSelectedResource}
                />
              ))}
          </div>
        </section>
      ))}
      <ResourceFilesDialog
        resource={selectedResource}
        onClose={() => setSelectedResource(null)}
      />
    </section>
  )
}
