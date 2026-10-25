import './questionMarkBadge.css'

export function QuestionMarkBadge({ className = '' }: { className?: string }) {
  return <span className={`question-mark-badge ${className}`} aria-hidden="true">?</span>
}
