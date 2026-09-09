import type { TitleSection } from '../../types/page'

export function TitleBlock({ heading }: TitleSection) {
  return <h1 className="title-block">{heading}</h1>
}
