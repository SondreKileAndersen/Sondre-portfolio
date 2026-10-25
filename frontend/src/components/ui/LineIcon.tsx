import type { LineIconName } from '../../types/page'

type LineIconProps = {
  name: LineIconName
}

export function LineIcon({ name }: LineIconProps) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'arrowUp') {
    return <svg {...commonProps} viewBox="-2 -2 28 28"><path d="m12 2 9 11h-6v9H9v-9H3Z" /></svg>
  }

  if (name === 'check') {
    return <svg {...commonProps}><path d="m5 12 4 4L19 6" /></svg>
  }

  if (name === 'lightbulb') {
    return <svg {...commonProps}><path d="M9 18h6M10 21h4M9 16v-1c0-2-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5-3 7v1M12 1V0M3 4 1 3M21 4l2-1M3 10H1M21 10h2" /></svg>
  }
  if (name === 'headphones') {
    return <svg {...commonProps}><path d="M4 14v-3a8 8 0 0 1 16 0v3" /><rect x="3" y="12" width="4" height="8" rx="2" /><rect x="17" y="12" width="4" height="8" rx="2" /></svg>
  }
  if (name === 'palette') {
    return <svg {...commonProps}><path d="M21 12a9 9 0 1 0-9 9h1a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6H18a3 3 0 0 0 3-3Z" /><circle cx="7" cy="10" r="1" /><circle cx="10" cy="6" r="1" /><circle cx="15" cy="7" r="1" /><circle cx="7" cy="15" r="1" /></svg>
  }
  if (name === 'pointer') {
    return <svg {...commonProps}><path d="m5 3 14 9-7 1-3 7-4-17ZM14 15l5 6" /></svg>
  }
  if (name === 'film') {
    return <svg {...commonProps}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4m-11-7 5 3-5 3Z" /></svg>
  }
  if (name === 'cube') {
    return <svg {...commonProps}><path d="m4 7 8-4 8 4v10l-8 4-8-4Z" /><path d="m4 7 8 4 8-4M12 11v10" /></svg>
  }

  if (name === 'workflow') {
    return <svg {...commonProps}><circle cx="12" cy="5" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M12 7v5M6 16v-4h12v4" /></svg>
  }
  if (name === 'books') {
    return <svg {...commonProps}><path d="m3 6 12-3 6 3-12 3-6-3Zm0 0v5l6 3 12-3V6M3 12v5l6 3 12-3v-5M9 9v5M9 14v6" /></svg>
  }
  if (name === 'conversation') {
    return <svg {...commonProps}><path d="M14 14a7 7 0 1 0-9-1l-2 5 6-2a7 7 0 0 0 5-2Z" /><path d="M16 7a6 6 0 0 1 4 10l1 4-5-2a6 6 0 0 1-5-1" /></svg>
  }
  if (name === 'shieldLock') {
    return <svg {...commonProps}><path d="m12 2 9 3v6c0 6-9 11-9 11S3 17 3 11V5l9-3Z" /><rect x="8.5" y="10" width="7" height="6" rx="1" /><path d="M10 10V8a2 2 0 0 1 4 0v2" /></svg>
  }

  if (name === 'database') {
    return <svg {...commonProps}><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>
  }

  if (name === 'document') {
    return <svg {...commonProps}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
  }

  if (name === 'people') {
    return <svg {...commonProps}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20v-2c0-3 2.7-5 6-5s6 2 6 5v2M15 14c3 0 5 1.6 5 4v2" /></svg>
  }

  if (name === 'monitor') {
    return <svg {...commonProps}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></svg>
  }

  if (name === 'camera') {
    return <svg {...commonProps}><path d="M8 6 9.5 3h5L16 6h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" /><circle cx="12" cy="13" r="4" /></svg>
  }

  if (name === 'settings') {
    return <svg {...commonProps}><path d="m9 3 1-2h4l1 2 2 1 2-.2 2 3-1 2v3l1 2-2 3-2-.2-2 1-1 2h-4l-1-2-2-1-2 .2-2-3 1-2V9L3 7l2-3L7 4Z" /><circle cx="12" cy="10" r="3" /></svg>
  }

  return <svg {...commonProps}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
}
