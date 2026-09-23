export function sectionTone(index: number, startTone: 'light' | 'dark' = 'light'): 'light' | 'dark' {
  return index % 2 === 0 ? startTone : startTone === 'light' ? 'dark' : 'light'
}
