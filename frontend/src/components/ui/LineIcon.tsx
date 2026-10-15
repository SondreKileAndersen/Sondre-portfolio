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

  if (name === 'cube') {
    return <svg {...commonProps}><path d="m4 7 8-4 8 4v10l-8 4-8-4Z" /><path d="m4 7 8 4 8-4M12 11v10" /></svg>
  }

  if (name === 'workflow') {
    return <svg {...commonProps}><circle cx="12" cy="5" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><path d="M12 7v5M6 16v-4h12v4" /></svg>
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
