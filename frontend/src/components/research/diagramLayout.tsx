import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import { momentColors } from '../../data/researchVisualizationPresentation'

export type Point = { x: number; y: number }
export type Box = Point & { width: number; height: number }
export type DiagramLayoutProps = { positions: Record<string, Point>; onMove: (id: string, point: Point) => void }
export const momentStyle = (id: string): CSSProperties => ({ '--moment-color': `var(--research-moment-${id?.replace('M_', '').toLowerCase()}, ${momentColors[id]})` } as CSSProperties)
export function fitBox(point: Point, size: { width: number; height: number }, width: number, height: number): Box {
  return { ...size, x: Math.max(8, Math.min(width - size.width - 8, point.x)), y: Math.max(8, Math.min(height - size.height - 8, point.y)) }
}

/** SVG units match CSS pixels so labels retain the surrounding paragraph size. */
export function useDiagramCanvas(fallbackWidth: number, enabled = true) {
  const ref = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(fallbackWidth)
  const [sizes, setSizes] = useState<Record<string, { width: number; height: number }>>({})
  useLayoutEffect(() => {
    const svg = ref.current
    if (!svg) return
    const measure = () => {
      setWidth(svg.getBoundingClientRect().width)
      const next: typeof sizes = {}
      svg.querySelectorAll<SVGTextElement>('[data-node-label]').forEach(text => {
        const bounds = text.getBBox()
        next[text.dataset.nodeLabel!] = { width: Math.ceil(bounds.width) + 28, height: Math.ceil(bounds.height) + 20 }
      })
      svg.querySelectorAll<HTMLElement>('[data-node-description]').forEach(node => {
        next[node.dataset.nodeDescription!] = { width: Math.ceil(node.scrollWidth) + 28, height: Math.ceil(node.scrollHeight) + 24 }
      })
      setSizes(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    measure()
    void document.fonts.ready.then(measure)
    document.fonts.addEventListener('loadingdone', measure)
    return () => { observer.disconnect(); document.fonts.removeEventListener('loadingdone', measure) }
  }, [enabled])
  return { ref, width, sizes }
}

export function connection(from: Box, to: Box, offset = 0) {
  // Intersect a center-to-center ray with each rectangle, including after nodes cross sides.
  const center = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
  const a = center(from), b = center(to)
  const anchor = (box: Box, point: Point, other: Point) => {
    const dx = other.x - point.x, dy = other.y - point.y
    const scale = 1 / Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2), 1e-6)
    return { x: point.x + dx * scale, y: point.y + dy * scale }
  }
  const start = anchor(from, a, b), end = anchor(to, b, a)
  const dx = end.x - start.x, dy = end.y - start.y
  const length = Math.hypot(dx, dy) || 1
  const ox = -dy / length * offset, oy = dx / length * offset
  return `M${start.x},${start.y} C${start.x + dx * .4 + ox},${start.y + oy} ${end.x - dx * .4 + ox},${end.y + oy} ${end.x},${end.y}`
}

export function useDraggableNode({ id, box, canvas, height, onMove }: { id: string; box: Box; canvas: RefObject<SVGSVGElement | null>; height: number; onMove: DiagramLayoutProps['onMove'] }) {
  const drag = useRef<{ pointer: number; start: Point; origin: Point; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const localPoint = (event: PointerEvent<SVGGElement>) => {
    const matrix = canvas.current?.getScreenCTM()
    return matrix ? new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse()) : null
  }
  const move = (point: Point) => {
    const width = canvas.current?.viewBox.baseVal.width ?? 940
    onMove(id, { x: Math.max(8, Math.min(width - box.width - 8, point.x)), y: Math.max(8, Math.min(height - box.height - 8, point.y)) })
  }
  return {
    onPointerDown: (event: PointerEvent<SVGGElement>) => {
      if (event.button !== 0 || !event.isPrimary) return
      const point = localPoint(event)
      if (!point) return
      suppressClick.current = false
      drag.current = { pointer: event.pointerId, start: point, origin: { x: box.x, y: box.y }, moved: false }
      event.currentTarget.focus()
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    onPointerMove: (event: PointerEvent<SVGGElement>) => {
      const state = drag.current, point = localPoint(event)
      if (!state || state.pointer !== event.pointerId || !point) return
      const dx = point.x - state.start.x, dy = point.y - state.start.y
      if (!state.moved && Math.hypot(dx, dy) < 4) return
      state.moved = true
      event.preventDefault()
      move({ x: state.origin.x + dx, y: state.origin.y + dy })
    },
    onPointerUp: (event: PointerEvent<SVGGElement>) => {
      if (drag.current?.pointer !== event.pointerId) return
      suppressClick.current = drag.current.moved
      drag.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    },
    onLostPointerCapture: () => { drag.current = null },
    onPointerCancel: () => { drag.current = null; suppressClick.current = false },
    onClickCapture: (event: MouseEvent<SVGGElement>) => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false }
    },
    onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
      const delta: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } }
      const direction = delta[event.key]
      if (!direction) return
      event.preventDefault()
      const step = event.shiftKey ? 30 : 10
      move({ x: box.x + direction.x * step, y: box.y + direction.y * step })
    },
  }
}
