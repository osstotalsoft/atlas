import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Box, Grid, Paper } from '@material-ui/core'
import { Typography, CustomTextField, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { EXECUTE_WORKFLOW_MUTATION } from 'features/workflow/list/mutations/ExecuteWorkflowMutation'
import { useMutation } from '@apollo/client'
import { useCallback } from 'react'
import { curry, prop, isNil } from 'ramda'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyObject } from 'utils/constants'
import { useStateLens, get, set } from '@totalsoft/react-state-lens'
import { executionStatus } from 'features/workflow/common/constants'
import GoToExecutionButton from 'features/workflow/common/components/GoToExecutionButton'
import { isJsonString } from 'utils/functions'

const ExecutionEditRerun = ({ workflow }) => {
  const { t } = useTranslation()

  const [status, setStatus] = useState(executionStatus.NOT_STARTED)
  const [executionId, setExecutionId] = useState()

  const input = workflow?.input || emptyObject
  const inputLens = useStateLens(input)
  const localInput = inputLens |> get

  let inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim
  const workflowStr = JSON.stringify(workflow)
  let match = inputCaptureRegex.exec(workflowStr)

  const inputsArray = []

  while (match != null) {
    inputsArray.push(match[1])
    match = inputCaptureRegex.exec(workflowStr)
  }

  const keys = [...new Set(inputsArray)]
  const values = []
  keys.map(k => values.push(!isNil(prop(k, input)) ? prop(k, input) : ''))

  const [executeWorkflow, { loading }] = useMutation(EXECUTE_WORKFLOW_MUTATION, {
    onCompleted: data => {
      setStatus(executionStatus.EXECUTED)
      setExecutionId(data?.executeWorkflow)
    }
  })

  const handleExecuteWorkflow = useCallback(() => {
    const startWorkflowRequestInput = { name: workflow?.workflowName, input: localInput }
    executeWorkflow({ variables: { startWorkflowRequestInput } })
  }, [executeWorkflow, localInput, workflow?.workflowName])

  const handleChange = curry((key, value) => {
    set(inputLens[key], isJsonString(value) ? JSON.parse(value) : value)
  })

  return (
    <Grid container direction='column' spacing={2} style={{ minHeight: '250px', padding: '10px' }}>
      <Paper style={{ padding: '6px' }}>
        <Grid container alignItems='flex-start' spacing={3}>
          <Grid item xs={12}>
            <Typography variant='h6'>{t('Execution.EditRerunWorkflow')}</Typography>
          </Grid>
          {keys.map((key, index) => (
            <Grid item xs={12} md={6} key={key}>
              <CustomTextField
                label={key}
                fullWidth
                value={typeof values[index] === 'object' ? JSON.stringify(values[index]) : values[index]}
                debounceBy={200}
                variant='outlined'
                onChange={onTextBoxChange(handleChange(key))}
                multiline
                maxRows={10}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent='flex-end'>
          <Grid item container justifyContent='flex-end' xs={2}>
            <Box padding='10px' alignSelf='center' whiteSpace='nowrap'>
              {status === executionStatus.EXECUTED ? (
                <GoToExecutionButton executionId={executionId} />
              ) : (
                <Button size='sm' color='primary' onClick={handleExecuteWorkflow} disabled={loading}>
                  {loading ? t('Workflow.Buttons.Executing') : t('Workflow.Buttons.Execute')}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

ExecutionEditRerun.propTypes = {
  workflow: PropTypes.object.isRequired
}

export default ExecutionEditRerun
