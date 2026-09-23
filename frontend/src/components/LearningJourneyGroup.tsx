import { useLayoutEffect, useRef } from 'react'
import type { LearningJourneyStepSection } from '../types/page'
import { SectionRenderer } from './SectionRenderer'
import { sectionTone } from '../lib/sectionTone'

type Props = {
  sections: LearningJourneyStepSection[]
  startIndex: number
  startTone: 'light' | 'dark'
}

export function LearningJourneyGroup({ sections, startIndex, startTone }: Props) {
  const groupRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const group = groupRef.current
    if (!group) return

    const steps = [...group.querySelectorAll<HTMLElement>('.learning-journey-step')]
    const markers = steps.map((step) => step.querySelector<HTMLElement>('.learning-journey-step__marker span'))
    const solidSegments = [...group.querySelectorAll<HTMLElement>('.learning-journey-group__solid')]
    if (markers.some((marker) => !marker)) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reducedMotion) group.classList.add('learning-journey-group--animated')

    let measureFrame = 0
    let animationFrame = 0
    let previousTime = 0
    let displayedProgress = 0
    let targetProgress = 0
    let lineLength = 0
    let lineStartViewportY = 0
    let markerOffsets: number[] = []
    const revealReachedSteps = () => {
      markerOffsets.forEach((offset, index) => {
        if (targetProgress >= offset && displayedProgress >= offset) {
          const step = steps[index]
          if (!step || step.classList.contains('learning-journey-step--reached')) return
          step.classList.add('learning-journey-step--reached')
          solidSegments[index]?.classList.add('learning-journey-group__solid--visible')
        }
      })
    }

    const animate = (time: number) => {
      animationFrame = 0
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 0
      previousTime = time
      const styles = getComputedStyle(group)
      const configuredSpeed = Number.parseFloat(styles.getPropertyValue('--journey-line-speed'))
      const baseSpeed = Number.isFinite(configuredSpeed) && configuredSpeed > 0 ? configuredSpeed : 420
      const configuredBoost = Number.parseFloat(styles.getPropertyValue('--journey-line-speed-boost'))
      const boost = Number.isFinite(configuredBoost) && configuredBoost > 1 ? configuredBoost : 2
      const lineEndViewportY = lineStartViewportY + displayedProgress
      const speed = lineEndViewportY <= window.innerHeight * 0.25 ? baseSpeed * boost : baseSpeed
      const distance = targetProgress - displayedProgress
      const movement = Math.min(Math.abs(distance), speed * elapsed)
      displayedProgress += Math.sign(distance) * movement
      group.style.setProperty('--journey-line-progress', `${displayedProgress}px`)
      revealReachedSteps()
      if (Math.abs(targetProgress - displayedProgress) > 0.5) {
        animationFrame = window.requestAnimationFrame(animate)
      } else {
        displayedProgress = targetProgress
        group.style.setProperty('--journey-line-progress', `${displayedProgress}px`)
        revealReachedSteps()
        previousTime = 0
      }
    }

    const updateTarget = () => {
      measureFrame = 0
      steps.forEach((step, index) => {
        const marker = markers[index]
        const markerHost = marker?.parentElement
        if (!marker || !markerHost) return
        const centerX = markerHost.offsetLeft + marker.offsetLeft + marker.offsetWidth / 2
        const centerY = markerHost.offsetTop + marker.offsetTop + marker.offsetHeight / 2
        const visual = step.querySelector<HTMLElement>('.learning-journey-step__visual')
        const copy = step.querySelector<HTMLElement>('.learning-journey-step__copy')
        for (const element of [visual, copy]) {
          if (!element) continue
          element.style.setProperty('--journey-origin-x', `${centerX - element.offsetLeft - element.offsetWidth / 2}px`)
          element.style.setProperty('--journey-origin-y', `${centerY - element.offsetTop - element.offsetHeight / 2}px`)
        }
        const cardStack = step.querySelector<HTMLElement>('.learning-journey__starter-cards-stack')
        if (cardStack) {
          cardStack.querySelectorAll<HTMLElement>('.learning-journey__starter-card').forEach((card) => {
            const cardCenterX = cardStack.offsetLeft + card.offsetLeft + card.offsetWidth / 2
            const cardCenterY = cardStack.offsetTop + card.offsetTop + card.offsetHeight / 2
            card.style.setProperty('--journey-card-origin-x', `${centerX - cardCenterX}px`)
            card.style.setProperty('--journey-card-origin-y', `${centerY - cardCenterY}px`)
          })
        }
      })
      const groupRect = group.getBoundingClientRect()
      const centers = markers.map((marker) => {
        const rect = marker!.getBoundingClientRect()
        return rect.top + rect.height / 2
      })
      const first = centers[0]
      const last = centers[centers.length - 1]
      const firstMarker = markers[0]?.getBoundingClientRect()
      if (first === undefined || last === undefined || !firstMarker) return

      lineLength = Math.max(0, last - groupRect.top)
      lineStartViewportY = groupRect.top
      markerOffsets = centers.map((center) => center - groupRect.top)
      const initialProgress = (markerOffsets[0] ?? 0) * 0.25
      const cursor = window.innerHeight * 0.74
      displayedProgress = Math.min(lineLength, Math.max(displayedProgress, initialProgress))
      targetProgress = Math.min(lineLength, Math.max(targetProgress, initialProgress, cursor - groupRect.top, 0))

      solidSegments.forEach((segment, index) => {
        const start = index === 0 ? 0 : markerOffsets[index - 1]
        const end = markerOffsets[index]
        if (start === undefined || end === undefined) return
        segment.style.top = `${start}px`
        segment.style.height = `${Math.max(0, end - start)}px`
      })

      group.style.setProperty('--journey-line-top', '0px')
      group.style.setProperty('--journey-line-left', `${firstMarker.left + firstMarker.width / 2 - groupRect.left}px`)
      group.style.setProperty('--journey-line-length', `${lineLength}px`)

      if (reducedMotion) {
        displayedProgress = lineLength
        group.style.setProperty('--journey-line-progress', `${lineLength}px`)
        solidSegments.forEach((segment) => segment.classList.add('learning-journey-group__solid--visible'))
      } else {
        group.style.setProperty('--journey-line-progress', `${displayedProgress}px`)
        revealReachedSteps()
        if (!animationFrame && Math.abs(targetProgress - displayedProgress) > 0.5) {
          previousTime = 0
          animationFrame = window.requestAnimationFrame(animate)
        }
      }
    }

    const scheduleUpdate = () => {
      if (!measureFrame) measureFrame = window.requestAnimationFrame(updateTarget)
    }
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(group)
    markers.forEach((marker) => marker && observer.observe(marker))
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    updateTarget()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (measureFrame) window.cancelAnimationFrame(measureFrame)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [sections])

  return <div ref={groupRef} className="learning-journey-group">
    <span className="learning-journey-group__line" aria-hidden="true">
      {sections.map((section) => <span key={section.id} className="learning-journey-group__solid" />)}
    </span>
    {sections.map((section, index) => <SectionRenderer
      key={section.id}
      section={section}
      tone={sectionTone(startIndex + index, startTone)}
    />)}
  </div>
}
