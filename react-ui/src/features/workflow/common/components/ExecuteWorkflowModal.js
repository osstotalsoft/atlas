import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextField } from '@totalsoft/rocket-ui'
import GoToExecutionButton from 'features/workflow/common/components/GoToExecutionButton'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { curry } from 'ramda'
import { emptyObject } from 'utils/constants'
import { get, set } from '@totalsoft/react-state-lens'
import { Button, Dialog, FakeText } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import styles from '../styles'
import { useClientQueryWithErrorHandling, useError, useQueryWithErrorHandling } from 'hooks/errorHandling'
import { useMutation } from '@apollo/client'
import { EXECUTE_WORKFLOW_MUTATION } from '../../list/mutations/ExecuteWorkflowMutation'
import { executionStatus } from '../constants'
import { WORKFLOW_QUERY } from '../../edit/queries/WorkflowQuery'
import { useStateLens } from '@totalsoft/react-state-lens'
import { EXECUTION_LIST_QUERY } from 'features/execution/list/queries/ExecutionListQuery'
import { generateFreeText } from 'features/execution/common/functions'
import { sortStartTimeDesc } from 'features/common/constants'
import { isJsonString } from 'utils/functions'

const useStyles = makeStyles(styles)

const ExecuteWorkflowModal = ({ open, toggleExecDialog, name, version }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const showError = useError()
  const clientQuery = useClientQueryWithErrorHandling()

  const [status, setStatus] = useState(executionStatus.NOT_STARTED)
  const [executionId, setExecutionId] = useState()
  const inputLens = useStateLens(emptyObject)

  const { loading, data } = useQueryWithErrorHandling(WORKFLOW_QUERY, {
    variables: { name, version, skip: !open }
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

  const handleChange = curry((key, value) => {
    set(inputLens[key], isJsonString(value) ? JSON.parse(value) : value)
  })

  const updateCache = async () => {
    try {
      //Delay the query for one second to wait for the conductor to synchronize with elastic
      setTimeout(async () => {
        await clientQuery(EXECUTION_LIST_QUERY, {
          variables: {
            freeText: generateFreeText({ workflowType: name, version }, true),
            sort: sortStartTimeDesc
          },
          fetchPolicy: 'network-only'
        })
      }, 1000)
    } catch (error) {
      return
    }
  }

  const [executeWorkflow, { loading: execLoading }] = useMutation(EXECUTE_WORKFLOW_MUTATION, {
    onCompleted: workflowData => {
      setStatus(executionStatus.EXECUTED)
      setExecutionId(workflowData?.executeWorkflow)
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
    <Dialog
      id='execDialog'
      title={
        <>
          <p>{t('Workflow.Dialog.ExecuteWorkflowDialogTitle')}</p>
          <p>{t('Workflow.Dialog.ExecuteWorkflowDialogSubtitle')}</p>
        </>
      }
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
              <Button key='exec' color='primary' size='small' disabled={execLoading} onClick={handleExecuteWorkflow}>
                {execLoading ? t('Workflow.Buttons.Executing') : t('Workflow.Buttons.Execute')}
              </Button>
            ]
      }
      content={
        <>
          {loading && <FakeText lines={3} />}
          <Grid container spacing={2} style={{ marginBottom: '4px' }}>
            {inputParameters?.map(key => (
              <Grid item xs={12} md={6} key={key}>
                <TextField
                  fullWidth
                  label={key}
                  onChange={onTextBoxChange(handleChange(key))}
                  debounceBy={100}
                  variant='outlined'
                  multiline
                  maxRows={10}
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
  name: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired
}

export default ExecuteWorkflowModal
