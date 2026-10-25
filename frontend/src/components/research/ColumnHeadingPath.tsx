import { useLayoutEffect, useRef, useState } from 'react'

export function ColumnHeadingPath() {
  const ref = useRef<SVGSVGElement>(null)
  const [geometry, setGeometry] = useState({ width: 1, height: 1, path: '' })
  useLayoutEffect(() => {
    const heading = ref.current?.parentElement
    const button = heading?.querySelector('button')
    if (!heading || !button) return
    const textMeasure = document.createElement('canvas').getContext('2d')
    const measure = () => {
      const { width, height } = heading.getBoundingClientRect()
      const style = getComputedStyle(button)
      const transform = new DOMMatrixReadOnly(style.transform)
      const tick = parseFloat(style.bottom) || 0
      // Reserve the largest hover/selected label size, independently of its current state.
      const baseFontSize = parseFloat(getComputedStyle(heading).fontSize)
      const maximumFontSize = baseFontSize * 1.04
      if (textMeasure) textMeasure.font = `700 ${maximumFontSize}px ${style.fontFamily}`
      const maximumWidth = (textMeasure?.measureText(button.textContent ?? '').width ?? button.offsetWidth) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const lineRatio = parseFloat(style.lineHeight) / parseFloat(style.fontSize) || 1.45
      const maximumHeight = maximumFontSize * lineRatio + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
      const requiredHeight = Math.ceil(tick + maximumWidth * Math.abs(transform.b) + maximumHeight * Math.abs(transform.a) + 12)
      heading.style.height = requiredHeight + 'px'
      const x = width / 2, y = height - tick
      const path = `M${x},${height} L${x},${y} L${x + button.offsetWidth * transform.a},${y + button.offsetWidth * transform.b}`
      setGeometry(previous => previous.width === width && previous.height === height && previous.path === path ? previous : { width, height, path })
    }
    const observer = new ResizeObserver(measure)
    observer.observe(heading)
    observer.observe(button)
    measure()
    return () => observer.disconnect()
  }, [])
  return <svg ref={ref} className="research-viz__heading-path" viewBox={`0 0 ${geometry.width} ${geometry.height}`} preserveAspectRatio="none" aria-hidden="true"><path d={geometry.path} /></svg>
}
