import { useEffect, useRef, type ReactNode } from 'react'
import { traceContent } from '../lib/contentSource'

export function ContentSourceBoundary({ sectionId, children }: { sectionId: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const update = () => traceContent(root, sectionId)
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [sectionId])
  return <div ref={ref} className="content-source-boundary" data-content-section={sectionId}>{children}</div>
}
