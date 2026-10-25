import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

export function useColumnOrder(ids: string[], storageKey: string) {
  const [order, setOrder] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      if (Array.isArray(saved)) return [...new Set([...saved.filter((id): id is string => typeof id === 'string' && ids.includes(id)), ...ids])]
    } catch { /* Storage is optional; the default layout always works. */ }
    return [...ids]
  })
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(order)) } catch { /* Keep the in-memory order when storage is unavailable. */ }
  }, [order, storageKey])
  const reorder = (source: string, target: string) => setOrder(previous => {
    const from = previous.indexOf(source), to = previous.indexOf(target)
    if (from < 0 || to < 0 || from === to) return previous
    const next = [...previous]
    next.splice(from, 1)
    next.splice(to, 0, source)
    return next
  })
  return { order, reorder, reset: () => setOrder([...ids]) }
}

export function useColumnDrag(reorder: (source: string, target: string) => void) {
  const table = useRef<HTMLTableElement>(null)
  const drag = useRef<{ source: string; pointer: number; x: number; y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const begin = (source: string, event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary) return
    suppressClick.current = false
    drag.current = { source, pointer: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
  }
  const cancel = () => { drag.current = null; setDraggedColumn(null) }
  const handlers = {
    onPointerMove: (event: PointerEvent<HTMLTableElement>) => {
      const state = drag.current
      if (!state || state.pointer !== event.pointerId) return
      const dx = Math.abs(event.clientX - state.x), dy = Math.abs(event.clientY - state.y)
      if (!state.moved) {
        if (Math.max(dx, dy) < 6) return
        if (dy > dx) { cancel(); return }
        state.moved = true
        setDraggedColumn(state.source)
        event.currentTarget.setPointerCapture(event.pointerId)
      }
      event.preventDefault()
      const headings = [...event.currentTarget.querySelectorAll<HTMLElement>('[data-source-heading]')]
      const target = headings.reduce<HTMLElement | null>((nearest, heading) => {
        const distance = (element: HTMLElement) => { const rect = element.getBoundingClientRect(); return Math.abs(rect.x + rect.width / 2 - event.clientX) }
        return !nearest || distance(heading) < distance(nearest) ? heading : nearest
      }, null)
      if (target?.dataset.sourceHeading) reorder(state.source, target.dataset.sourceHeading)
    },
    onPointerUp: (event: PointerEvent<HTMLTableElement>) => {
      if (drag.current?.pointer !== event.pointerId) return
      suppressClick.current = drag.current.moved
      cancel()
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    },
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
    onPointerLeave: () => { if (!drag.current?.moved) cancel() },
    onClickCapture: (event: MouseEvent<HTMLTableElement>) => {
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false }
    },
  }
  return { table, begin, handlers, draggedColumn }
}
