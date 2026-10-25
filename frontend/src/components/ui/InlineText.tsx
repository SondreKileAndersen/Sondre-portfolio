import type { ReactNode } from 'react'

/** Render **bold** emphasis from content data without interpreting HTML. */
export function InlineText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let cursor = 0
  for (const match of text.matchAll(/\*\*(.+?)\*\*/g)) {
    parts.push(text.slice(cursor, match.index))
    parts.push(<strong key={match.index}>{match[1]}</strong>)
    cursor = match.index + match[0].length
  }
  parts.push(text.slice(cursor))
  return <>{parts}</>
}
