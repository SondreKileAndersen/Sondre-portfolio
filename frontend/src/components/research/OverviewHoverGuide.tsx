import { useEffect, useRef, type RefObject } from 'react'
import { PointingHandIcon } from '../ui/PointingHandIcon'

export type GuideTarget = 'moment' | 'point' | 'source' | null
type Position = { x: number; y: number }

export function OverviewHoverGuide({ tableRef, onTarget, enabled }: {
  enabled: boolean
  tableRef: RefObject<HTMLTableElement | null>
  onTarget: (target: GuideTarget) => void
}) {
  const handRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const table = tableRef.current
    const hand = handRef.current
    const stage = table?.closest<HTMLElement>('.research-viz__stage--overview')
    const container = table?.parentElement
    if (!table || !hand || !stage || !container || !enabled) return
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    let timer = 0
    let controller: AbortController | undefined
    const animations = new Set<Animation>()
    const duration = (name: string, fallback: number) => {
      const value = getComputedStyle(stage).getPropertyValue(name).trim()
      const number = parseFloat(value)
      return Number.isFinite(number) ? Math.max(1, number * (value.endsWith('ms') ? 1 : 1000)) : fallback
    }
    const stop = () => {
      clearTimeout(timer)
      timer = 0
      controller?.abort()
      controller = undefined
      animations.forEach(animation => animation.cancel())
      animations.clear()
      hand.hidden = true
      onTarget(null)
    }
    const run = async (signal: AbortSignal) => {
      const wait = (ms: number) => new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(id); reject(new DOMException('Aborted', 'AbortError')) }
        const id = window.setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, ms)
        signal.addEventListener('abort', abort, { once: true })
        if (signal.aborted) abort()
      })
      const animate = async (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError')
        const animation = element.animate(frames, options)
        animations.add(animation)
        try { await animation.finished } finally { animations.delete(animation); animation.cancel() }
      }
      const positions = (): Position[] => {
        const box = container.getBoundingClientRect()
        const moment = table.querySelector('[data-moment-id=M_FORM] th button')!.getBoundingClientRect()
        const point = table.querySelector('[data-moment-id=M_FORM] [data-source-id=P_EMAIL] .research-viz__dot')!.getBoundingClientRect()
        const heading = table.querySelector('[data-source-heading=P_EMAIL]')!.getBoundingClientRect()
        return [
          { x: moment.left + moment.width / 2 - box.left, y: heading.top + heading.height * .48 - box.top },
          { x: moment.left + moment.width / 2 - box.left, y: moment.top + moment.height / 2 - box.top },
          { x: point.left + point.width / 2 - box.left, y: point.top + point.height / 2 - box.top },
          { x: heading.left + heading.width / 2 - box.left, y: heading.bottom - 12 - box.top },
        ]
      }
      const transform = ({ x, y }: Position) => `translate(${x}px, ${y}px)`
      const targets: GuideTarget[] = [null, 'moment', 'point', 'source']
      hand.hidden = false
      hand.style.opacity = '0'
      hand.style.transform = transform(positions()[0])
      let current = 0
      let starting = true
      while (!signal.aborted) {
        hand.dataset.guideStep = String(current + 1)
        onTarget(targets[current])
        const hold = duration('--research-guide-position-duration', 1000)
        if (current === 0) {
          // The initial visibility delay already supplies the first pause.
          if (!starting) await wait(2000)
        } else {
          await wait(hold / 2)
          const pulse = Math.min(300, hold / 2)
          const glyph = hand.querySelector('.research-hover-guide__pulse')!
          const ring = hand.querySelector('.research-hover-guide__ring')!
          const panel = stage.querySelector<HTMLElement>('.research-source')
          const panelPulse: Promise<void>[] = []
          if (panel) {
            const style = getComputedStyle(panel)
            const color = getComputedStyle(stage).getPropertyValue('--research-figure-label-color').trim()
            const normal = { borderColor: style.borderTopColor, boxShadow: '0 0 0 0 transparent, inset 0 0 0 0 transparent' }
            const pressed = {
              borderColor: color,
              // One pixel on either side of the existing border: 3px visually,
              // with no changes to layout, padding or the scrollable content.
              boxShadow: `0 0 0 1px ${color}, inset 0 0 0 1px ${color}`,
            }
            panelPulse.push(animate(panel, [normal, pressed, normal], { duration: pulse, easing: 'ease-in-out' }))
          }
          await Promise.all([
            ...panelPulse,
            animate(glyph, [{ scale: '1' }, { scale: '.78' }, { scale: '1' }], { duration: pulse, easing: 'ease-in-out' }),
            animate(ring, [{ opacity: 0, scale: '.5', offset: 0 }, { opacity: 0, scale: '.5', offset: .49 }, { opacity: .8, scale: '.6', offset: .5 }, { opacity: 0, scale: '1.5', offset: 1 }], { duration: pulse, easing: 'ease-out' }),
          ])
          await wait(Math.max(0, hold / 2 - pulse))
        }
        starting = false
        onTarget(null)
        const next = (current + 1) % targets.length
        const points = positions()
        const opacity = next === 0 ? '0' : '1'
        await animate(hand, [
          { transform: transform(points[current]), opacity: current === 0 ? '0' : '1' },
          { transform: transform(points[next]), opacity },
        ], { duration: duration('--research-guide-movement-duration', 700), easing: 'ease-in-out', fill: 'forwards' })
        hand.style.transform = transform(points[next])
        hand.style.opacity = opacity
        current = next
      }
    }
    const observer = new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .98
      if (!visible || reducedMotion.matches) { stop(); return }
      if (timer || controller) return
      timer = window.setTimeout(() => {
        timer = 0
        controller = new AbortController()
        void run(controller.signal).catch(error => { if (error.name !== 'AbortError') console.error(error) })
      }, 2000)
    }, { threshold: [0, .98, 1], rootMargin: '2px' })
    observer.observe(container)
    const resize = () => { stop(); observer.unobserve(container); observer.observe(container) }
    window.addEventListener('resize', resize)
    reducedMotion.addEventListener('change', resize)
    return () => {
      stop()
      observer.disconnect()
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', resize)
    }
  }, [tableRef, onTarget, enabled])
  return <div ref={handRef} hidden className="research-hover-guide" aria-hidden="true">
    <div className="research-hover-guide__pulse"><div className="research-hover-guide__glyph"><PointingHandIcon /></div></div>
    <span className="research-hover-guide__ring" />
  </div>
}
