import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ExecutionSummary from './ExecutionSummary'
import TaskDetailList from './TaskDetailList'
import ExecutionIO from './ExecutionIO'
import ExecutionEditRerun from './ExecutionEditRerun'
import { Tabs, Tab, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import TabPanel from 'features/common/components/TabPanel/TabPanel'
import styles from '../../styles'
import { executionStatus } from '../../constants/executionStatusList'
import { EXECUTION_DETAILS_QUERY } from '../../queries/ExecutionDetailsQuery'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { FakeText } from '@totalsoft/rocket-ui'
import { emptyArray } from 'utils/constants'
import WorkflowGraphContainer from '../../../../designer/diagram/WorkflowGraphContainer'
import { useParams } from 'react-router-dom'
import { useHeader } from 'providers/AreasProvider'
import StandardHeader from 'components/layout/StandardHeader'
import AppBar from '@mui/material/AppBar'
import JsonViewer from 'features/common/components/JsonViewer'

const useStyles = makeStyles(styles)

const ExecutionDetailsContainer = () => {
  const { t } = useTranslation()
  const classes = useStyles()
  const { workflowId } = useParams()

  const [value, setValue] = useState(4)
  const [, setHeader] = useHeader(<StandardHeader />)

  const { loading, data, startPolling, stopPolling } = useQueryWithErrorHandling(EXECUTION_DETAILS_QUERY, {
    variables: { includeTasks: true, workflowId }
  })
  const executionDetails = data?.getExecution

  useEffect(() => {
    if (!executionDetails?.status) return
    if (executionDetails.status === executionStatus.RUNNING) startPolling(5000)
    else stopPolling()
  }, [executionDetails, startPolling, stopPolling])

  useEffect(() => {
    setHeader(
      <StandardHeader
        headerText={executionDetails?.workflowName}
        path='/executions'
        parentPath={executionDetails?.parentWorkflowId ? `/executions/${executionDetails?.parentWorkflowId}` : null}
      />
    )
  }, [executionDetails?.workflowName, executionDetails?.parentWorkflowId, setHeader])

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue)
  }, [])

  if (loading) return <FakeText lines={8} />

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ExecutionSummary execution={executionDetails} workflowId={workflowId} startPolling={startPolling} />
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
              disabled={executionDetails?.status === executionStatus.RUNNING || executionDetails?.readOnly}
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
          <JsonViewer workflow={executionDetails} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ExecutionEditRerun workflow={executionDetails} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <WorkflowGraphContainer flow={executionDetails} />
        </TabPanel>
      </Grid>
    </Grid>
  )
}

export default ExecutionDetailsContainer
