type CrossfadeOptions = {
  incoming: HTMLElement
  outgoing: HTMLElement
  styleSource: HTMLElement
  synchronize: () => void
  onFinish: () => void
  properties?: { fadeInDuration: string; fadeOutDelay: string; fadeOutDuration: string }
}

// Shared by the floating teaching cards and the research-gallery copies.
export function crossfadeLayers({ incoming, outgoing, styleSource, synchronize, onFinish, properties }: CrossfadeOptions) {
  const styles = getComputedStyle(styleSource)
  const readTime = (property: string, fallback: number) => {
    let value = styles.getPropertyValue(property).trim()
    // Custom properties preserve calc() text. Let CSS resolve derived times
    // before passing numeric milliseconds to the Web Animations API.
    if (value.startsWith('calc(')) {
      const probe = document.createElement('span')
      probe.style.display = 'none'
      probe.style.transitionDuration = value
      document.body.appendChild(probe)
      value = getComputedStyle(probe).transitionDuration
      probe.remove()
    }
    const amount = Number.parseFloat(value)
    return Number.isFinite(amount) ? Math.max(0, amount * (value.endsWith('ms') ? 1 : 1000)) : fallback
  }
  const fadeInDuration = readTime(properties?.fadeInDuration ?? '--starter-card-fade-in-duration', 300)
  const fadeOutDelay = readTime(properties?.fadeOutDelay ?? '--starter-card-fade-out-delay', 0)
  const fadeOutDuration = readTime(properties?.fadeOutDuration ?? '--starter-card-fade-out-duration', 300)
  let frame = 0
  let incomingFade: Animation | undefined
  let outgoingFade: Animation | undefined
  const stop = () => {
    cancelAnimationFrame(frame)
    incomingFade?.cancel()
    outgoingFade?.cancel()
  }
  synchronize()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onFinish()
    return stop
  }
  const follow = () => { synchronize(); frame = requestAnimationFrame(follow) }
  frame = requestAnimationFrame(follow)
  const common: KeyframeAnimationOptions = { easing: 'ease', fill: 'forwards' }
  incomingFade = incoming.animate([{ opacity: 0 }, { opacity: 1 }], { ...common, duration: fadeInDuration })
  outgoingFade = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], { ...common, delay: fadeOutDelay, duration: fadeOutDuration })
  const startTime = document.timeline.currentTime
  incomingFade.startTime = startTime
  outgoingFade.startTime = startTime
  const lastFade = fadeOutDelay + fadeOutDuration >= fadeInDuration ? outgoingFade : incomingFade
  lastFade.onfinish = () => { stop(); onFinish() }
  return stop
}
