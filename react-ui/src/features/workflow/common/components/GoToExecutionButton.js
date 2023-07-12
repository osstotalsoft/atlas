import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Button } from '@totalsoft/rocket-ui'
import { useNavigate } from 'react-router-dom'

const GoToExecutionButton = ({ executionId }) => {
  const { t } = useTranslation()
  const history = useNavigate()

  const handleGoToExecution = useCallback(() => executionId && history(`/executions/${executionId}`), [executionId, history])

  return (
    <Button key='goToExecution' size='small' color='success' onClick={handleGoToExecution}>
      {t('Workflow.Buttons.GoToExecution')}
    </Button>
  )
}

GoToExecutionButton.propTypes = {
  executionId: PropTypes.string
}

export default GoToExecutionButton
