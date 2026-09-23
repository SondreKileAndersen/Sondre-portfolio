import type { ButtonHTMLAttributes } from 'react'

type CarouselArrowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: 'previous' | 'next'
  label: string
}

export function CarouselArrow({ direction, label, className = '', ...props }: CarouselArrowProps) {
  return (
    <button
      {...props}
      type="button"
      className={`carousel-arrow carousel-arrow--${direction} ${className}`}
      aria-label={label}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d={direction === 'previous' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'} />
      </svg>
    </button>
  )
}
