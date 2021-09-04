import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useHistory } from 'react-router-dom'

const GoToExecutionButton = ({ executionId }) => {
  const { t } = useTranslation()
  const history = useHistory()

  const handleGoToExecution = useCallback(() => executionId && history.push(`/executions/${executionId}`), [executionId, history])

  return (
    <Button key='goToExecution' size='sm' color='success' onClick={handleGoToExecution}>
      {t('Workflow.Buttons.GoToExecution')}
    </Button>
  )
}

GoToExecutionButton.propTypes = {
  executionId: PropTypes.string
}

export default GoToExecutionButton
