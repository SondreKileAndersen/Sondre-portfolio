import { useTranslation } from 'react-i18next'
import { scopedEvidenceCodes, type EvidenceCell, type EvidenceCode, type Filters } from '../../lib/researchVisualization/model'
import { momentStyle } from './diagramLayout'

const momentIds: Record<string, string> = { formidlingsrammer: 'M_FORM', prosjektgrunnlag: 'M_PROJ', utviklergrunnlag: 'M_DEV', pressemateriale: 'M_PRESS' }

// Presentation only: keep the supplied codebook text unchanged in the dataset.
export function formatEvidenceSentence(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return ''
  const sentence = trimmed.charAt(0).toLocaleUpperCase('nb') + trimmed.slice(1)
  return /[.!?…]$/.test(sentence) ? sentence : `${sentence}.`
}

function CodeList({ codes }: { codes: EvidenceCode[] }) {
  const { t } = useTranslation()
  const seen = new Set<string>()
  const unique = codes.filter(code => {
    const key = `${code.informant}|${code.text.trim().toLocaleLowerCase('nb')}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const people = [...new Set(unique.map(code => code.informant))].sort()
  return <>{people.map(person => <section key={person} className="research-source__record">
    <strong>{person === 'Z' ? t('research.curatedEvidence.expert') : t('research.informantName', { id: person })}</strong>
    <ul>{unique.filter(code => code.informant === person).map(code => <li key={code.codeId} data-code-id={code.codeId} data-evidence-role={code.evidenceRole}>
      <p>{formatEvidenceSentence(code.text)}</p>
    </li>)}</ul>
  </section>)}</>
}

export function CuratedEvidence({ cells, filters }: { cells: EvidenceCell[]; filters: Filters }) {
  const { t } = useTranslation()
  return <>{cells.map(cell => {
    const primary = scopedEvidenceCodes(cell.primaryCodes, filters).filter(code => code.text.trim())
    const context = scopedEvidenceCodes(cell.contextCodes, filters).filter(code => code.text.trim())
    return <section key={cell.id} data-evidence-cell={cell.id}>
      <p className="research-source__assessment">{t('research.assessmentOf')} <strong className="research-source__moment" style={momentStyle(momentIds[cell.id.split('__')[0]])}>{cell.vurderingsmoment}</strong> {t('research.assessmentIn')} <strong>{cell.paratekst}</strong></p>
      {cell.primaryCodes.length > 0 && primary.length === 0 && <p>{t('research.curatedEvidence.scopeEmpty')}</p>}
      <CodeList codes={[...primary, ...context]} />
    </section>
  })}</>
}
