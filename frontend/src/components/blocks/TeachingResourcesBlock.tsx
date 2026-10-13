import { useEffect, useRef, useState, type MouseEvent } from 'react'
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

function getPreviewFile(files: TeachingResourceFile[]): TeachingResourceFile | undefined {
  if (files.length === 0) return undefined

  const previewPriority = (file: TeachingResourceFile) => {
    const value = `${file.id} ${file.label} ${file.url}`.toLowerCase()

    if (/\.pdf(?:\?|$)|\bpdf\b/.test(value)) return 0
    if (/\.pptx?(?:\?|$)|\.odp(?:\?|$)|powerpoint|presentasjon|slides?/.test(value)) return 1
    if (/\.docx?(?:\?|$)|\.odt(?:\?|$)|\bword\b|oppgave|veiledning|guide/.test(value)) return 2
    if (/\.html?(?:\?|$)|\.mp4(?:\?|$)|\.webm(?:\?|$)|\.mov(?:\?|$)/.test(value)) return 3
    if (/\.zip(?:\?|$)|\.rar(?:\?|$)|\.7z(?:\?|$)|\.psd(?:\?|$)|\.ai(?:\?|$)|\.aep(?:\?|$)|\.prproj(?:\?|$)|prosjektfil|kilde/.test(value)) return 10
    return 4
  }

  return [...files].sort((a, b) => previewPriority(a) - previewPriority(b))[0]
}

export function TeachingResourceCard({
  resource,
  onChooseFiles,
  expanded = true,
  onToggle,
  detailsId,
  plainMedia = false,
}: {
  resource: TeachingResource
  onChooseFiles: (resource: TeachingResource) => void
  expanded?: boolean
  onToggle?: () => void
  detailsId?: string
  plainMedia?: boolean
}) {
  const { t } = useTranslation()
  const [detailsMounted, setDetailsMounted] = useState(expanded)
  useEffect(() => {
    if (expanded) { setDetailsMounted(true); return }
    const timer = window.setTimeout(() => setDetailsMounted(false), 400)
    return () => window.clearTimeout(timer)
  }, [expanded])
  const files = getResourceFiles(resource)
  const previewFile = getPreviewFile(files)
  const previewUrl = resource.previewUrl ?? previewFile?.url
  const downloadIcon = <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
    <path d="M12 3v11m-4-4 4 4 4-4M4 17v3h16v-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
  const previewIcon = <svg viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

  const openPreviewFromCard = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return
    if (window.getSelection()?.toString()) return
    if (onToggle) { if (!expanded) onToggle(); return }
    if (!previewUrl) return
    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <article
      className={`teaching-resource-card ${formatClassNames[resource.format]}${onToggle ? ' teaching-resource-card--expandable' : ''}${plainMedia ? ' teaching-resource-card--plain-media' : ''}`}
      data-category={resource.categoryId}
      onClick={openPreviewFromCard}
    >
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
        {onToggle ? <button className="teaching-resource-card__title teaching-resource-card__toggle" type="button" aria-expanded={expanded} aria-controls={detailsId} onClick={() => { if (!expanded) onToggle() }}>{resource.title}</button> : <strong className="teaching-resource-card__title">{resource.title}</strong>}
        <div className={`teaching-resource-card__reveal${onToggle ? ' teaching-resource-card__reveal--animated' : ''}${expanded ? ' teaching-resource-card__reveal--open' : ''}`} id={detailsId} aria-hidden={!expanded} inert={!expanded}>
        <div className="teaching-resource-card__details">
        {(expanded || detailsMounted) && <>
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
          <div className="teaching-resource-card__actions">
            {previewUrl && (
              <a
                className="teaching-resource-card__preview-action"
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={t('teachingResources.previewResource', { title: resource.title })}
              >
                <span className="teaching-resource-card__preview-icon">{previewIcon}</span>
              </a>
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
        </>}
        </div>
        </div>
      </div>
    </article>
  )
}

export function ResourceFilesDialog({
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
  id,
  heading,
  introduction,
  notice,
  categories,
  resources,
}: TeachingResourcesSection) {
  const [selectedResource, setSelectedResource] = useState<TeachingResource | null>(null)
  const populatedCategories = categories.filter((category) =>
    resources.some((resource) => resource.categoryId === category.id),
  )

  return (
    <section className="teaching-resources" id={id}>
      <header className="teaching-resources__header">
        <h2>{heading}</h2>
        {introduction && <div className="teaching-resources__intro-copy">
          {introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>}
        {notice && <p className="teaching-resources__notice"><em>{notice}</em></p>}
        <span className="teaching-resources__intro-arrow" aria-hidden="true" />
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
              .sort((first, second) => first.title.localeCompare(second.title, 'no'))
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
