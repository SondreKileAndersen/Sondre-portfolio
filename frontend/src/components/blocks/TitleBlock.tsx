import type { TitleSection } from '../../types/page'
import { AutoImageCollage } from '../ui/AutoImageCollage'
import { LineIcon } from '../ui/LineIcon'

export function TitleBlock({
  heading,
  variant = 'default',
  eyebrow,
  introduction,
  collageImages,
  note,
  highlights,
}: TitleSection) {
  if (variant === 'editorial') {
    return (
      <section className="editorial-hero">
        <div className="editorial-hero__content">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{heading}</h1>
          {introduction && <p className="editorial-hero__introduction">{introduction}</p>}
          {highlights && (
            <ul className="editorial-hero__highlights">
              {highlights.map((highlight) => (
                <li key={highlight.id}>
                  <LineIcon name={highlight.icon} />
                  <span>{highlight.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="editorial-hero__collage">
          {collageImages && <AutoImageCollage images={collageImages} />}
          {note && <p className="editorial-note">{note}</p>}
        </div>
      </section>
    )
  }

  return <h1 className="title-block">{heading}</h1>
}
