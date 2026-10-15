type ContactIconName = 'location' | 'email' | 'document'

export function ContactIcon({ name }: { name: ContactIconName }) {
  if (name === 'location') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.24 6-11a6 6 0 1 0-12 0c0 5.76 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></svg>
  if (name === 'email') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 7 8 6 8-6" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v5h5" /></svg>
}
