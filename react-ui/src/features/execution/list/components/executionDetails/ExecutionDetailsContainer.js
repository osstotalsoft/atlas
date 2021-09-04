import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ExecutionSummary from './ExecutionSummary'
import TaskDetailList from './TaskDetailList'
import ExecutionIO from './ExecutionIO'
import ExecutionJSON from './ExecutionJSON'
import ExecutionEditRerun from './ExecutionEditRerun'
import { Tabs, Tab, makeStyles, Grid } from '@material-ui/core'
import TabPanel from 'features/common/components/TabPanel'
import styles from '../../styles'
import { executionStatus } from '../../constants/executionStatusList'
import { EXECUTION_DETAILS_QUERY } from '../../queries/ExecutionDetailsQuery'
import { RETRY_EXECUTION_MUTATION } from '../../mutations/RetryExecutionMutation'
import { PAUSE_EXECUTION_MUTATION } from '../../mutations/PauseExecutionMutation'
import { RESTART_EXECUTION_MUTATION } from '../../mutations/RestartExecutionMutation'
import { TERMINATE_EXECUTION_MUTATION } from '../../mutations/TerminateExecutionMutation'
import { RESUME_EXECUTION_MUTATION } from '../../mutations/ResumeExecutionMutation'
import { useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useMutation } from '@apollo/client'
import LoadingFakeText from '@bit/totalsoft_oss.react-mui.fake-text'
import { emptyArray } from 'utils/constants'
import Grapher from 'features/designer/diagram/Grapher'
import { useRouteMatch } from 'react-router-dom'
import { useHeader } from 'providers/AreasProvider'
import StandardHeader from 'components/layout/StandardHeader'
import AppBar from '@material-ui/core/AppBar'
import { EXECUTION_SUMMARY_QUERY } from '../../queries/ExecutionSummaryQuery'

const useStyles = makeStyles(styles)

const ExecutionDetailsContainer = () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const match = useRouteMatch()
  const showError = useError()

  const [value, setValue] = useState(0)
  const [, setHeader] = useHeader(<StandardHeader />)

  const workflowId = match.params.workflowId

  const { data: summaryData } = useQueryWithErrorHandling(EXECUTION_SUMMARY_QUERY, {
    variables: { query: `workflowId="${workflowId}"` }
  })

  const { loading, data, startPolling, stopPolling } = useQueryWithErrorHandling(EXECUTION_DETAILS_QUERY, {
    variables: { includeTasks: true, workflowId }
  })
  const executionDetails = data?.getExecution

  const [retryExecution] = useMutation(RETRY_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onError: error => showError(error)
  })

  const [pauseExecution] = useMutation(PAUSE_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onError: error => showError(error)
  })

  const [terminateExecution] = useMutation(TERMINATE_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onError: error => showError(error)
  })

  const [restartExecution] = useMutation(RESTART_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onError: error => showError(error)
  })

  const [resumeExecution] = useMutation(RESUME_EXECUTION_MUTATION, {
    variables: {
      workflowId
    },
    onError: error => showError(error)
  })

  const handleRetryExecution = useCallback(() => {
    retryExecution()
    startPolling(500)
  }, [retryExecution, startPolling])

  const handleTerminateExecution = useCallback(() => {
    terminateExecution()
    startPolling(500)
  }, [startPolling, terminateExecution])

  const handlePauseExecution = useCallback(() => {
    pauseExecution()
    startPolling(500)
  }, [pauseExecution, startPolling])

  const handleRestartExecution = useCallback(() => {
    restartExecution()
    startPolling(500)
  }, [restartExecution, startPolling])

  const handleResumeExecution = useCallback(() => {
    resumeExecution()
    startPolling(500)
  }, [resumeExecution, startPolling])

  useEffect(() => {
    if (!executionDetails?.status) return
    if (executionDetails.status === executionStatus.RUNNING) startPolling(500)
    else stopPolling()
  }, [executionDetails, startPolling, stopPolling])

  useEffect(() => {
    setHeader(<StandardHeader headerText={executionDetails?.workflowName} path='/executions' />)
  }, [executionDetails?.workflowName, setHeader])

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue)
  }, [])

  if (loading) return <LoadingFakeText lines={8} />

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ExecutionSummary
          execution={executionDetails}
          summary={summaryData?.search1?.results[0]}
          onRetry={handleRetryExecution}
          onPause={handlePauseExecution}
          onTerminate={handleTerminateExecution}
          onRestart={handleRestartExecution}
          onResume={handleResumeExecution}
        />
      </Grid>
      <Grid item xs={12}>
        <AppBar position='static' color='default'>
          <Tabs value={value} onChange={handleChange} indicatorColor='secondary' textColor='secondary' variant='fullWidth'>
            <Tab className={classes.tabLabel} label={t('Execution.TaskDetails')} />
            <Tab className={classes.tabLabel} label={t('Execution.IO')} />
            <Tab className={classes.tabLabel} label={t('Execution.JSON')} />
            <Tab
              className={classes.tabLabel}
              label={t('Execution.EditRerun')}
              disabled={executionDetails?.status === executionStatus.RUNNING}
            />
            <Tab className={classes.tabLabel} label={t('Execution.ExecutionFlow')} />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={value} index={0}>
          <TaskDetailList tasks={executionDetails?.tasks ?? emptyArray} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ExecutionIO executionDetails={executionDetails} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ExecutionJSON workflow={executionDetails} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ExecutionEditRerun workflow={executionDetails} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Grapher workflow={executionDetails} layout='TD-auto' />
        </TabPanel>
      </Grid>
    </Grid>
  )
}

export default ExecutionDetailsContainer
