import { useLayoutEffect, useState, type RefObject } from 'react'

export function useOverviewLayout(figure: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const [layout, setLayout] = useState({ stacked: false, figureWidth: 0 })
  useLayoutEffect(() => {
    const stage = figure.current?.querySelector<HTMLElement>('.research-viz__stage--overview')
    if (!enabled || !stage) return
    const measure = () => {
      const style = getComputedStyle(stage)
      const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const pixels = (value: string, reference: number): number => {
        const number = parseFloat(value)
        if (value.trim().endsWith('rem') || value.trim().endsWith('em')) return number * rootFont
        if (value.trim().endsWith('%')) return number / 100 * reference
        if (value.trim().endsWith('vw')) return number / 100 * innerWidth
        return number
      }
      const reference = pixels(style.getPropertyValue('--main-content-max-width') || '90rem', stage.clientWidth)
      const target = pixels(style.getPropertyValue('--research-overview-width-target'), reference)
      const minimum = pixels(style.getPropertyValue('--research-overview-width-min'), reference)
      const sourceMinimum = pixels(style.getPropertyValue('--research-source-width-min'), reference)
      const gap = parseFloat(style.columnGap)
      const stacked = stage.clientWidth < minimum + sourceMinimum + gap
      const figureWidth = Math.max(minimum, Math.min(target, stage.clientWidth - sourceMinimum - gap))
      setLayout(previous => previous.stacked === stacked && previous.figureWidth === figureWidth ? previous : { stacked, figureWidth })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    const styles = new MutationObserver(measure)
    styles.observe(document.head, { childList: true, subtree: true, characterData: true })
    styles.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    window.addEventListener('resize', measure)
    return () => { observer.disconnect(); styles.disconnect(); window.removeEventListener('resize', measure) }
  }, [enabled, figure])
  return layout
}
