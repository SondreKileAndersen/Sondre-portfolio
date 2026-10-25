import type { PublicationListSection } from '../../types/page'

export function PublicationListBlock({ heading, publications }: PublicationListSection) {
  return <section className="publication-list">
    <h2>{heading}</h2>
    <ol className="publication-list__entries">
      {publications.map(publication => <li key={publication.id}>
        <p className="publication-list__citation">
          {publication.authors.length > 0 && <span className="publication-list__authors">{publication.authors.join('; ')}. </span>}
          <cite>{publication.title}</cite>. <span className="publication-list__status">{publication.status}.</span>
        </p>
        {publication.items?.length ? <details className="publication-list__details">
          <summary>{publication.label}</summary>
          <ul>{publication.items.map(item => <li key={item}>{item}</li>)}</ul>
          {publication.tags?.length ? <p className="publication-list__topics">{publication.tags.join(' · ')}</p> : null}
        </details> : null}
      </li>)}
    </ol>
  </section>
}
