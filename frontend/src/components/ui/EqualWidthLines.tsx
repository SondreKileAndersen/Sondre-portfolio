import { useLayoutEffect, useRef, useState } from 'react'

/** Match preceding lines to the last line's natural body typography. */
export function EqualWidthLines({ lines, onWidthChange }: { lines: string[]; onWidthChange?: (width: number) => void }) {
  const reference = useRef<SVGTextElement>(null)
  const [size, setSize] = useState({ width: 600, lineHeight: 28, fontSize: 18 })
  useLayoutEffect(() => {
    let disposed = false
    const measure = () => {
      if (disposed || !reference.current) return
      const styles = getComputedStyle(reference.current)
      const fontSize = Number.parseFloat(styles.fontSize)
      const lineHeight = Number.parseFloat(styles.lineHeight)
      const width = reference.current.getComputedTextLength()
      onWidthChange?.(width)
      setSize({ width, fontSize,
        lineHeight: Number.isFinite(lineHeight) ? lineHeight : fontSize * 1.2 })
    }
    measure()
    void document.fonts.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => { disposed = true; window.removeEventListener('resize', measure) }
  }, [lines, onWidthChange])
  return <div className="equal-width-lines">
    <svg style={{ width: size.width }} viewBox={`0 0 ${size.width} ${lines.length * size.lineHeight}`} role="img" aria-label={lines.join(' ')}>
      {lines.map((line, index) => <text key={line} x="0" y={size.fontSize + index * size.lineHeight}
        ref={index === lines.length - 1 ? reference : undefined}
        textLength={index === lines.length - 1 ? undefined : size.width}
        lengthAdjust="spacing" aria-hidden="true">{line}</text>)}
    </svg>
  </div>
}
