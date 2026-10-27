export function MenuIcon({ close = false }: { close?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={close ? 'M5 5l14 14M19 5 5 19' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
}
