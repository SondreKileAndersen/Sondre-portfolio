import { useEffect, useId, useRef, type RefObject } from 'react'
import type { LearningJourneyStepSection } from '../types/page'

type Props = {
  groupRef: RefObject<HTMLDivElement | null>
  sections: LearningJourneyStepSection[]
}

// Layout coordinates remain stable while the images scale and float.
function layoutOffset(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let current: HTMLElement | null = element
  while (current && current !== ancestor) {
    x += current.offsetLeft
    y += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return { x, y }
}

export function LearningJourneyPath({ groupRef, sections }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const revealRef = useRef<SVGPathElement>(null)
  const maskId = `journey-path-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const group = groupRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const reveal = revealRef.current
    if (!group || !svg || !path || !reveal) return

    const steps = [...group.querySelectorAll<HTMLElement>('.learning-journey-step')]
    const visuals = steps.map(step => step.querySelector<HTMLElement>('.learning-journey-step__visual'))
    const heading = group.querySelector<HTMLElement>('.learning-journey-group__heading')
    const headingCircle = heading?.querySelector<HTMLElement>('.learning-journey-group__heading-circle')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let measureFrame = 0
    let started = false
    let animationFrame = 0
    let previousTime = 0
    let displayed = 0
    let target = 0
    let length = 0
    let imageDistances: number[] = []
    const paint = () => {
      reveal.setAttribute('stroke-dashoffset', String(Math.max(0, length - displayed)))
    }

    // The curve is monotonic in Y. Translate scroll position to arc length,
    // rather than using vertical distance as though the path were straight.
    const distanceAtY = (y: number) => {
      let low = 0
      let high = length
      for (let iteration = 0; iteration < 24; iteration += 1) {
        const middle = (low + high) / 2
        if (path.getPointAtLength(middle).y < y) low = middle
        else high = middle
      }
      return (low + high) / 2
    }

    const animate = (time: number) => {
      animationFrame = 0
      if (disposed || motion.matches) return
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, .1) : 1 / 60
      previousTime = time
      const configuredSpeed = Number.parseFloat(getComputedStyle(group).getPropertyValue('--journey-line-speed'))
      const speed = Number.isFinite(configuredSpeed) && configuredSpeed > 0 ? configuredSpeed : 500
      displayed = Math.min(target, displayed + speed * elapsed)
      steps.forEach((step, index) => {
        if (displayed >= imageDistances[index]) step.classList.add('learning-journey-step--reached')
      })
      paint()
      if (displayed < target) animationFrame = requestAnimationFrame(animate)
      else previousTime = 0
    }

    const updateTarget = () => {
      if (disposed || !length) return
      const configuredStop = Number.parseFloat(getComputedStyle(group).getPropertyValue('--journey-line-stop-position'))
      const stopPosition = Number.isFinite(configuredStop) ? Math.max(0, Math.min(1, configuredStop)) : .6
      const stopY = innerHeight * stopPosition - group.getBoundingClientRect().top
      target = started ? Math.max(displayed, distanceAtY(stopY)) : 0
      if (motion.matches) {
        group.classList.remove('learning-journey-group--animated')
        displayed = length
        steps.forEach(step => step.classList.add('learning-journey-step--reached'))
        paint()
      } else {
        group.classList.add('learning-journey-group--animated')
        paint()
        if (!animationFrame && displayed < target) animationFrame = requestAnimationFrame(animate)
      }
    }

    const measure = () => {
      measureFrame = 0
      if (disposed) return
      const points = visuals.map((visual, index) => {
        if (!visual) return null
        const offset = layoutOffset(visual, group)
        const anchorX = Math.max(0, Math.min(1, sections[index]?.lineAnchorX ?? .5))
        return { x: offset.x + visual.offsetWidth * anchorX, y: offset.y + visual.offsetHeight / 2 }
      })
      if (!points.length || points.some(point => !point)) return
      if (headingCircle && points[0]) {
        // Keep the title fixed when the decorative circle is moved or resized.
        group.style.setProperty('--journey-heading-left', `${points[0].x - 32}px`)
      }
      const headingOffset = heading ? layoutOffset(heading, group) : { x: 0, y: 0 }
      const circleRect = headingCircle?.getBoundingClientRect()
      const groupRect = group.getBoundingClientRect()
      let previous = {
        x: circleRect
          ? circleRect.left + circleRect.width / 2 - groupRect.left
          : heading ? headingOffset.x + heading.offsetWidth / 2 : group.clientWidth / 2,
        y: circleRect
          ? circleRect.bottom - groupRect.top - 1
          : heading ? headingOffset.y + heading.offsetHeight + 12 : 0,
      }
      let d = `M ${previous.x} ${previous.y}`
      points.forEach((point, index) => {
        if (!point) return
        const bend = (point.y - previous.y) * .7
        d += ` C ${previous.x} ${previous.y + bend}, ${point.x} ${point.y - bend}, ${point.x} ${point.y}`
        previous = point

        const visual = visuals[index]!
        // The whole image grows from its configured anchor. Individual floating cards
        // keep their existing stagger, rotation and entrance duration.
        const visualOffset = layoutOffset(visual, group)
        visual.style.setProperty('--journey-origin-x', `${point.x - visualOffset.x - visual.offsetWidth / 2}px`)
        visual.style.setProperty('--journey-origin-y', '0px')
        visual.querySelectorAll<HTMLElement>('[data-starter-card]').forEach(card => {
          const cardOffset = layoutOffset(card, group)
          const radians = (Number.parseFloat(getComputedStyle(card).getPropertyValue('--card-rotation')) || 0) * Math.PI / 180
          const dx = point.x - cardOffset.x
          const dy = point.y - cardOffset.y
          card.style.setProperty('--journey-card-origin-x', `${dx * Math.cos(radians) + dy * Math.sin(radians)}px`)
          card.style.setProperty('--journey-card-origin-y', `${-dx * Math.sin(radians) + dy * Math.cos(radians)}px`)
        })
      })
      const oldLength = length
      svg.setAttribute('viewBox', `0 0 ${group.clientWidth} ${group.offsetHeight}`)
      path.setAttribute('d', d)
      reveal.setAttribute('d', d)
      length = path.getTotalLength()
      if (oldLength) {
        displayed = Math.min(length, displayed / oldLength * length)
        target = Math.min(length, target / oldLength * length)
      }
      imageDistances = points.map(point => distanceAtY(point!.y))
      reveal.setAttribute('stroke-dasharray', `${length} ${length}`)
      paint()
      updateTarget()
    }

    const scheduleMeasure = () => {
      if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure)
    }
    const visibilityObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      started = true
      updateTarget()
      visibilityObserver.disconnect()
    }, { rootMargin: '0px 0px -20% 0px' })
    visibilityObserver.observe(heading ?? steps[0] ?? group)
    const observer = new ResizeObserver(scheduleMeasure)
    const styleObserver = new MutationObserver(scheduleMeasure)
    styleObserver.observe(document.head, { subtree: true, childList: true, characterData: true })
    styleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    if (headingCircle) styleObserver.observe(headingCircle, { attributes: true, attributeFilter: ['style', 'class'] })
    observer.observe(group)
    if (heading) observer.observe(heading)
    if (headingCircle) observer.observe(headingCircle)
    visuals.forEach(visual => visual && observer.observe(visual))
    steps.forEach(step => observer.observe(step))
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('resize', scheduleMeasure)
    motion.addEventListener('change', scheduleMeasure)
    void document.fonts.ready.then(scheduleMeasure)
    measure()

    return () => {
      disposed = true
      observer.disconnect()
      visibilityObserver.disconnect()
      styleObserver.disconnect()
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('resize', scheduleMeasure)
      motion.removeEventListener('change', scheduleMeasure)
      cancelAnimationFrame(measureFrame)
      cancelAnimationFrame(animationFrame)
    }
  }, [groupRef, sections])

  return <svg ref={svgRef} className="learning-journey-group__line" aria-hidden="true" focusable="false">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <path ref={revealRef} fill="none" stroke="white" strokeWidth="8" />
      </mask>
    </defs>
    <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 12" strokeLinecap="round" mask={`url(#${maskId})`} />
  </svg>
}
