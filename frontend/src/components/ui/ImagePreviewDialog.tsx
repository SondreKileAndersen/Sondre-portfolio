import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import type { ImageCompareSection } from '../../types/page'
import { CarouselArrow } from './CarouselArrow'

export type ImagePreviewSelection = { index: number; kind: 'before' | 'after' }

export function ImagePreviewDialog({ groups, selection, onChange, onClose }: {
  groups: ImageCompareSection['groups']
  selection: ImagePreviewSelection
  onChange: (selection: ImagePreviewSelection) => void
  onClose: () => void
}) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const group = groups[selection.index]
  const image = group?.images.find(item => item.id === selection.kind)
  const mainIndexes = groups.flatMap((item, index) => item.images.some(figure => figure.id === 'after') ? [index] : [])
  const navigate = (direction: number) => {
    if (!mainIndexes.length) return
    const position = mainIndexes.indexOf(selection.index)
    onChange({ index: mainIndexes[(position + direction + mainIndexes.length) % mainIndexes.length], kind: 'after' })
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()
    return () => {
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])

  return createPortal(<dialog ref={dialogRef} className="image-preview-dialog" aria-label={image?.alt}
    onClose={onClose} onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      event.preventDefault()
      event.stopPropagation()
      navigate(event.key === 'ArrowRight' ? 1 : -1)
    }}>
    <button type="button" className="image-preview-dialog__close" aria-label={t('actions.close')} onClick={onClose} autoFocus>×</button>
    {mainIndexes.length > 1 && <CarouselArrow direction="previous" label={t('gallery.previous')} onClick={() => navigate(-1)} />}
    {image && <figure className="image-preview-dialog__figure">
      <img src={image.src} alt={image.alt} decoding="async" />
      {image.label && <figcaption>{image.label}</figcaption>}
    </figure>}
    {mainIndexes.length > 1 && <CarouselArrow direction="next" label={t('gallery.next')} onClick={() => navigate(1)} />}
  </dialog>, document.body)
}
