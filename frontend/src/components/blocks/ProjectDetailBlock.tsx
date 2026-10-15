import type { ProjectDetailSection } from '../../types/page'

export function ProjectDetailBlock({
  eyebrow,
  heading,
  introduction,
  metadata,
  previewImage,
  paragraphs,
  gallery,
  outcome,
}: ProjectDetailSection) {
  return (
    <article className="project-detail">
      <header className="project-detail__header">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{heading}</h1>
        {introduction && <p className="project-detail__lead">{introduction}</p>}
      </header>

      <dl className="project-detail__metadata">
        {metadata.map((item) => (
          <div key={item.id}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <figure className="project-detail__preview">
        <img src={previewImage.src} alt={previewImage.alt} loading="eager" fetchPriority="high" decoding="async" />
        <figcaption>{previewImage.caption}</figcaption>
      </figure>

      <div className="project-detail__body">
        {[...paragraphs, ...(outcome ? [outcome] : [])].map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      {gallery && gallery.length > 0 && (
        <div className="project-detail__gallery">
          {gallery.map((image) => (
            <figure key={image.id}>
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </article>
  )
}
