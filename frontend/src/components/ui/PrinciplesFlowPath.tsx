import { useEffect, useId, useRef, type RefObject } from 'react'

type Point = { x: number; y: number }

export function PrinciplesFlowPath({ sectionRef, ready }: {
  sectionRef: RefObject<HTMLElement | null>
  ready: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const revealRef = useRef<SVGPathElement>(null)
  const maskId = `principles-flow-${useId().replace(/:/g, '')}`

  useEffect(() => {
    const section = sectionRef.current
    const svg = svgRef.current
    const path = pathRef.current
    const reveal = revealRef.current
    if (!section || !svg || !path || !reveal) return
    const items = Array.from(section.querySelectorAll<HTMLElement>('.principles-block__items > li'))
    const title = section.querySelector('h2')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let measureFrame = 0
    let animationFrame = 0
    let startTime: number | null = null
    let progress = 0
    let length = 0
    let anchors: number[] = []
    let started = false
    let disposed = false

    const paint = () => {
      reveal.setAttribute('stroke-dashoffset', String(length * (1 - progress)))
      items.forEach((item, index) => {
        if (progress === 1 || length * progress + 1 >= anchors[index]) {
          item.classList.add('principles-feature--visible')
        }
      })
    }

    const measure = () => {
      measureFrame = 0
      if (disposed) return
      const bounds = section.getBoundingClientRect()
      const points: Point[] = items.flatMap(item => {
        const icon = item.querySelector('svg')
        if (!icon) return []
        const rect = icon.getBoundingClientRect()
        return [{ x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top }]
      })
      if (!points.length) return
      const stacked = points.length > 1 && Math.abs(points[0].x - points[1].x) < 1
      let previous: Point = stacked
        ? { x: points[0].x, y: points[0].y - 35 }
        : { x: points[0].x - 45, y: points[0].y + 45 }
      if (title && !stacked) {
        const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT)
        let lastText: Text | null = null
        while (walker.nextNode()) {
          if (walker.currentNode.textContent?.trim()) lastText = walker.currentNode as Text
        }
        if (lastText) {
          const end = lastText.data.trimEnd().length
          const range = document.createRange()
          range.setStart(lastText, end - 1)
          range.setEnd(lastText, end)
          const lastLetter = range.getBoundingClientRect()
          const x = lastLetter.right + 10 - bounds.left
          if (x < points[0].x - 20) previous = { x, y: lastLetter.top + lastLetter.height / 2 - bounds.top }
        }
      }
      let d = `M ${previous.x} ${previous.y}`
      const configuredSoftness = parseFloat(getComputedStyle(section).getPropertyValue('--principles-curve-softness'))
      const softness = Number.isFinite(configuredSoftness) ? Math.max(0, Math.min(1, configuredSoftness)) : .4
      const handleRatio = 1 - softness * .5
      anchors = points.map((point, index) => {
        if (stacked) {
          const bend = (point.y - previous.y) / 2
          d += ` C ${previous.x} ${previous.y + bend}, ${point.x} ${point.y - bend}, ${point.x} ${point.y}`
        } else {
          const bend = point.x - previous.x
          if (index === 0) {
            const lead = Math.min(12, bend * .15)
            const startX = previous.x + lead
            const copy = items[index].querySelector('.principles-block__feature-copy')?.getBoundingClientRect()
            const clearSpace = copy ? copy.left - bounds.left - startX - 20 : Infinity
            const handle = Math.max(8, Math.min((point.x - startX) * .3, clearSpace))
            d += ` L ${startX} ${previous.y}`
            d += ` C ${startX + handle} ${previous.y}, ${startX + handle} ${point.y}, ${point.x} ${point.y}`
          } else {
            const handle = bend * handleRatio
            d += ` C ${previous.x + handle} ${previous.y}, ${point.x - handle} ${point.y}, ${point.x} ${point.y}`
          }
        }
        previous = point
        path.setAttribute('d', d)
        return path.getTotalLength()
      })
      svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`)
      reveal.setAttribute('d', d)
      length = path.getTotalLength()
      reveal.setAttribute('stroke-dasharray', `${length} ${length}`)
      paint()
    }
    const scheduleMeasure = () => {
      if (!disposed && !measureFrame) measureFrame = requestAnimationFrame(measure)
    }
    const animate = (time: number) => {
      animationFrame = 0
      if (disposed) return
      startTime ??= time
      const value = getComputedStyle(section).getPropertyValue('--principles-animation-duration').trim()
      const duration = (parseFloat(value) || 2.2) * (value.endsWith('ms') ? 1 : 1000)
      progress = Math.min(1, (time - startTime) / duration)
      paint()
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }
    const revealImmediately = () => {
      if (!motion.matches) return
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
      progress = 1
      paint()
    }
    const visibility = new IntersectionObserver(([entry]) => {
      if (!ready || !entry.isIntersecting || started || motion.matches) return
      started = true
      section.classList.add('principles-block--visible')
      animationFrame = requestAnimationFrame(animate)
      visibility.disconnect()
    }, { threshold: 0, rootMargin: '-15% 0px -15% 0px' })
    const observer = new ResizeObserver(scheduleMeasure)
    const styleObserver = new MutationObserver(scheduleMeasure)
    styleObserver.observe(document.head, { subtree: true, childList: true, characterData: true })
    styleObserver.observe(section, { attributes: true, attributeFilter: ['style'] })
    styleObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    observer.observe(section)
    if (title) observer.observe(title)
    items.forEach(item => observer.observe(item))
    visibility.observe(section)
    window.addEventListener('resize', scheduleMeasure)
    motion.addEventListener('change', revealImmediately)
    void document.fonts.ready.then(scheduleMeasure)
    measure()
    revealImmediately()
    return () => {
      disposed = true
      cancelAnimationFrame(measureFrame)
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
      styleObserver.disconnect()
      visibility.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      motion.removeEventListener('change', revealImmediately)
    }
  }, [sectionRef, ready])

  return <svg ref={svgRef} className="principles-block__path" aria-hidden="true" focusable="false">
    <defs>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <path ref={revealRef} fill="none" stroke="white" strokeWidth="6" />
      </mask>
    </defs>
    <path ref={pathRef} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="7 9" strokeLinecap="round" mask={`url(#${maskId})`} />
  </svg>
}
