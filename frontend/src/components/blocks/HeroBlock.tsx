import type { HeroSection } from '../../types/page'

export function HeroBlock({
  heading,
  imageSrc,
  imageAlt,
  paragraphs,
}: HeroSection) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <figure className="hero-portrait">
        <img src={imageSrc} alt={imageAlt} />
      </figure>
      <div className="hero-content">
        <h1 id="hero-heading">{heading}</h1>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
