import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, makeStyles } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import GoToExecutionButton from 'features/workflow/common/components/GoToExecutionButton'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { curry, remove } from 'ramda'
import { emptyObject, emptyString } from 'utils/constants'
import { get, set } from '@totalsoft/react-state-lens'
import { Button, DialogDisplay, LoadingFakeText } from '@bit/totalsoft_oss.react-mui.kit.core'
import { useTranslation } from 'react-i18next'
import styles from '../common/styles'
import { EXECUTION_LIST_QUERY } from 'features/execution/list/queries/ExecutionListQuery'
import { EXECUTION_DETAILS_QUERY } from 'features/execution/list/queries/ExecutionDetailsQuery'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { updateCacheList } from 'features/execution/common/functions'
import { sortStartTimeDesc } from 'features/common/constants'
import { useMutation } from '@apollo/client'
import { EXECUTE_WORKFLOW_MUTATION } from '../list/mutations/ExecuteWorkflowMutation'
import { executionStatus } from '../common/constants'
import { WORKFLOW_QUERY } from '../edit/queries/WorkflowQuery'
import { useStateLens } from '@totalsoft/react-state-lens'
import { executionsPager } from 'apollo/cacheKeyFunctions'
import { defaults } from 'apollo/defaultCacheData'

const defaultPager = defaults[executionsPager]

const useStyles = makeStyles(styles)

const ExecuteWorkflowModal = ({ open, toggleExecDialog, name }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const showError = useError()
  const clientQuery = useClientQueryWithErrorHandling()

  const [status, setStatus] = useState(executionStatus.NOT_STARTED)
  const [executionId, setExecutionId] = useState()
  const inputLens = useStateLens(emptyObject)

  const { loading, data } = useQueryWithErrorHandling(WORKFLOW_QUERY, {
    variables: { name, skip: !open }
  })
  const workflow = data?.getWorkflow

  const inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim
  const workflowStr = JSON.stringify(workflow)
  let match = inputCaptureRegex.exec(workflowStr)
  const inputsArray = []
  while (match != null) {
    inputsArray.push(match[1])
    match = inputCaptureRegex.exec(workflowStr)
  }
  const inputParameters = [...new Set(inputsArray)]

  const inputs = inputLens |> get
  const handleChange = curry((key, value) => {
    set(inputLens, { ...inputs, [key]: value })
  })

  const updateCache = async (cache, req) => {
    try {
      const variables = { size: defaultPager.pageSize, start: defaultPager.start, freeText: emptyString, sort: sortStartTimeDesc }
      const cachedExecutionList = cache.readQuery({
        query: EXECUTION_LIST_QUERY,
        variables
      })
      const { results: existingExecutions, totalHits } = cachedExecutionList?.search1
      const workflowId = req?.data?.startWorkflow
      const { data } = await clientQuery(EXECUTION_DETAILS_QUERY, {
        variables: { includeTasks: true, workflowId }
      })
      const workflow = data?.getExecution
      const newExecution = { ...workflow, workflowType: workflow?.workflowName }
      const newCollection = [newExecution, ...(existingExecutions |> remove(defaultPager.pageSize - 1, 1))]
      updateCacheList(cache, newCollection, totalHits, variables)
    } catch (error) {
      return
    }
  }

  const [executeWorkflow, { loading: execLoading }] = useMutation(EXECUTE_WORKFLOW_MUTATION, {
    onCompleted: data => {
      setStatus(executionStatus.EXECUTED)
      setExecutionId(data?.startWorkflow)
    },
    update: updateCache,
    onError: error => showError(error)
  })

  const handleExecuteWorkflow = useCallback(() => {
    const startWorkflowRequestInput = { name: workflow?.name, version: workflow?.version, input: inputLens |> get }
    executeWorkflow({ variables: { startWorkflowRequestInput } })
  }, [executeWorkflow, inputLens, workflow?.name, workflow?.version])

  const handleCloseDialog = useCallback(() => {
    toggleExecDialog()
    setStatus(executionStatus.NOT_STARTED)
  }, [toggleExecDialog])

  return (
    <DialogDisplay
      id='execDialog'
      title={t('Designer.UtilitiesBar.ExecuteWorkflowDialogTitle')}
      maxWidth='md'
      PaperProps={{
        className: classes.paper
      }}
      open={open}
      onClose={handleCloseDialog}
      actions={
        status === executionStatus.EXECUTED
          ? [<GoToExecutionButton key='goToExecution' executionId={executionId} />]
          : [
              <Button key='exec' color='primary' size='sm' disabled={execLoading} onClick={handleExecuteWorkflow}>
                {execLoading ? t('Workflow.Buttons.Executing') : t('Workflow.Buttons.Execute')}
              </Button>
            ]
      }
      content={
        <>
          {loading && <LoadingFakeText lines={3} />}
          <Grid container spacing={2} style={{ marginBottom: '4px' }}>
            {inputParameters?.map(key => (
              <Grid item xs={12} md={6} key={key}>
                <CustomTextField
                  fullWidth
                  label={key}
                  value={inputParameters[key] || emptyString}
                  onChange={onTextBoxChange(handleChange(key))}
                  debounceBy={100}
                  variant='outlined'
                />
              </Grid>
            ))}
          </Grid>
        </>
      }
    />
  )
}

ExecuteWorkflowModal.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleExecDialog: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default ExecuteWorkflowModal
