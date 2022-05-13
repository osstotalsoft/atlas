import React, { useCallback } from 'react'
import { Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import IconButton from '@bit/totalsoft_oss.react-mui.icon-button'
import CloseIcon from '@material-ui/icons/Close'
import PauseIcon from '@material-ui/icons/Pause'
import ReplayIcon from '@material-ui/icons/Replay'
import RepeatIcon from '@material-ui/icons/Repeat'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import { Typography, useToast } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import { executionStatus } from '../../constants/executionStatusList'
import { useError } from 'hooks/errorHandling'
import { useMutation } from '@apollo/client'
import { RESUME_EXECUTION_MUTATION } from '../../mutations/ResumeExecutionMutation'
import { RESTART_EXECUTION_MUTATION } from '../../mutations/RestartExecutionMutation'
import { TERMINATE_EXECUTION_MUTATION } from '../../mutations/TerminateExecutionMutation'
import { PAUSE_EXECUTION_MUTATION } from '../../mutations/PauseExecutionMutation'
import { RETRY_EXECUTION_MUTATION } from '../../mutations/RetryExecutionMutation'

const ExecutionActions = ({ workflowId, status, startPolling, readOnly }) => {
  const { t } = useTranslation()
  const showError = useError()
  const addToast = useToast()

  const [retryExecution] = useMutation(RETRY_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onCompleted: () => addToast(t('Execution.Notifications.Retry'), 'success'),
    onError: error => showError(error)
  })

  const [pauseExecution] = useMutation(PAUSE_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onCompleted: () => addToast(t('Execution.Notifications.Pause'), 'success'),
    onError: error => showError(error)
  })

  const [terminateExecution] = useMutation(TERMINATE_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onCompleted: () => addToast(t('Execution.Notifications.Terminate'), 'success'),
    onError: error => showError(error)
  })

  const [restartExecution] = useMutation(RESTART_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onCompleted: () => addToast(t('Execution.Notifications.Restart'), 'success'),
    onError: error => showError(error)
  })

  const [resumeExecution] = useMutation(RESUME_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onCompleted: () => addToast(t('Execution.Notifications.Resume'), 'success'),
    onError: error => showError(error)
  })

  const handleRetryExecution = useCallback(() => {
    retryExecution()
    startPolling(1000)
  }, [retryExecution, startPolling])

  const handleTerminateExecution = useCallback(() => {
    terminateExecution()
    startPolling(1000)
  }, [startPolling, terminateExecution])

  const handlePauseExecution = useCallback(() => {
    pauseExecution()
    startPolling(1000)
  }, [pauseExecution, startPolling])

  const handleRestartExecution = useCallback(() => {
    restartExecution()
    startPolling(1000)
  }, [restartExecution, startPolling])

  const handleResumeExecution = useCallback(() => {
    resumeExecution()
    startPolling(1000)
  }, [resumeExecution, startPolling])

  const renderActions = useCallback(() => {
    switch (status) {
      case executionStatus.TERMINATED:
      case executionStatus.COMPLETED:
        return (
          <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Restart')} onClick={handleRestartExecution} disabled={readOnly}>
            <RepeatIcon fontSize='small' />
          </IconButton>
        )
      case executionStatus.FAILED:
        return (
          <Grid container>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Restart')} onClick={handleRestartExecution} disabled={readOnly}>
              <RepeatIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Retry')} onClick={handleRetryExecution} disabled={readOnly}>
              <ReplayIcon fontSize='small' />
            </IconButton>
          </Grid>
        )
      case executionStatus.PAUSED:
        return (
          <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Resume')} onClick={handleResumeExecution} disabled={readOnly}>
            <PlayArrowIcon fontSize='small' />
          </IconButton>
        )
      case executionStatus.RUNNING:
        return (
          <Grid container>
            <IconButton
              size='small'
              color='themeNoBackground'
              tooltip={t('Execution.Buttons.Terminate')}
              onClick={handleTerminateExecution}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' color='themeNoBackground' tooltip={t('Execution.Buttons.Pause')} onClick={handlePauseExecution} disabled={readOnly}>
              <PauseIcon fontSize='small' />
            </IconButton>
          </Grid>
        )
      default:
        return <Typography>{t('Execution.NoActions')}</Typography>
    }
  }, [handlePauseExecution, handleRestartExecution, handleResumeExecution, handleRetryExecution, handleTerminateExecution, readOnly, status, t])

  return <>{renderActions()}</>
}

ExecutionActions.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  workflowId: PropTypes.string.isRequired,
  status: PropTypes.string,
  startPolling: PropTypes.func.isRequired
}

export default ExecutionActions
