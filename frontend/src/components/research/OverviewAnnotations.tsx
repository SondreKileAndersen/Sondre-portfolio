import { useTranslation } from 'react-i18next'

export function OverviewAnnotations() {
  const { t } = useTranslation()
  return <div className="research-viz__annotations">
    <ul className="research-viz__legend research-viz__legend--compact">
      <li><span className="research-viz__dot research-viz__dot--active research-viz__dot--legend-clear" />{t('research.connection.clear')}</li>
      <li><span className="research-viz__dot research-viz__dot--possible" />{t('research.connection.possible')}</li>
    </ul>
    <p className="research-viz__muted research-viz__explanation">{t('research.connection.externalInfoNote')}</p>
    <p className="research-viz__muted research-viz__explanation">{t('research.connection.explanation')}</p>
  </div>
}
