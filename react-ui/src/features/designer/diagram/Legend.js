import React from 'react'
import { useTranslation } from 'react-i18next'
import './classes.css'

const Legend = () => {
  const { t } = useTranslation()

  return (
    <div style={{ marginTop: '20px', display: 'grid', verticalAlign: 'top' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={'square scheduled'} />
        {t('Execution.Diagram.Legend.Scheduled')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={'square inProgress'} />
        {t('Execution.Diagram.Legend.InProgress')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={'square executed'} />
        {t('Execution.Diagram.Legend.Executed')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={'square notExecuted'} />
        {t('Execution.Diagram.Legend.NotExecuted')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={'square error'} />
        {t('Execution.Diagram.Legend.Error')}
      </div>
    </div>
  )
}

export default Legend
