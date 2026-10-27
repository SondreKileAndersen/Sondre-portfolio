import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import './abstractDialog.css'

export function AbstractDialog({ label, text, language }: { label: string; text: string; language: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const node = dialog.current!
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    node.showModal()
    return () => {
      node.close()
      document.body.style.overflow = previousOverflow
      trigger.current?.focus({ preventScroll:true })
    }
  }, [open])

  return <>
    <button ref={trigger} type="button" className="abstract-dialog-trigger" aria-haspopup="dialog" onClick={() => setOpen(true)}>{label}<span aria-hidden="true">↗</span></button>
    {open && createPortal(<dialog ref={dialog} className="abstract-dialog" lang={language} aria-labelledby={titleId}
      onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
      onClick={event => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setOpen(false)
      }}>
      <button type="button" className="abstract-dialog__close" aria-label={t('actions.close')} onClick={() => setOpen(false)}>×</button>
      <h2 id={titleId}>{label}</h2>
      <p>{text}</p>
    </dialog>, document.body)}
  </>
}
