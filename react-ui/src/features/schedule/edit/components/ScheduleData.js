import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { TextField, DateTime } from '@totalsoft/rocket-ui'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyString } from 'utils/constants'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { isValid, getErrors } from '@totalsoft/pure-validations-react'
import { Card, FakeText, Autocomplete } from '@totalsoft/rocket-ui'
import { Info } from '@mui/icons-material'
import { Typography } from '@totalsoft/rocket-ui'
import { get, set } from '@totalsoft/react-state-lens'
import Editor from '@monaco-editor/react'

const ScheduleData = ({ scheduleLens, validation, loading, workflows }) => {
  const { t } = useTranslation()
  const schedule = scheduleLens |> get

  const handleActiveChanged = useCallback(() => {
    set(scheduleLens.enabled, !schedule?.enabled)
  }, [schedule?.enabled, scheduleLens])

  const handleParalledRunsChanged = useCallback(
    _ => {
      set(scheduleLens.parallelRuns, !schedule?.parallelRuns)
    },
    [schedule?.parallelRuns, scheduleLens]
  )
  const handleWorkflowChange = useCallback(
    workflow => {
      const pieces = workflow.split('/')

      set(scheduleLens.workflowName, pieces[0])
      set(scheduleLens.workflowVersion, pieces[1])
    },
    [scheduleLens]
  )
  const onContextChange = useCallback(
    value => {
      set(scheduleLens.workflowContext, value)
    },
    [scheduleLens.workflowContext]
  )

  if (loading) return <FakeText lines={3} />

  return (
    <Card icon={Info} title={t('Schedule.Data')}>
      <Grid container spacing={2} justifyContent='flex-start' alignItems='flex-end'>
        <Grid item xs={12} sm={12} lg={12}>
          <TextField
            label={t('Schedule.Name')}
            fullWidth
            value={schedule?.name || emptyString}
            onChange={scheduleLens.name |> set |> onTextBoxChange}
            error={!isValid(validation?.name)}
            helperText={getErrors(validation?.name)}
            debounceBy={200}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <TextField
            label={t('Schedule.CronString')}
            fullWidth
            value={schedule?.cronString || emptyString}
            onChange={scheduleLens.cronString |> set |> onTextBoxChange}
            error={!isValid(validation?.cronString)}
            helperText={getErrors(validation?.cronString)}
            debounceBy={200}
          />
        </Grid>

        <Grid item xs={12} sm={12}>
          <Autocomplete
            fullWidth
            options={workflows}
            valueKey='name'
            simpleValue
            value={`${schedule?.workflowName}/${schedule?.workflowVersion}` || emptyString}
            onChange={handleWorkflowChange}
            error={!isValid(validation?.workflowName)}
            helperText={getErrors(validation?.workflowName)}
          />
        </Grid>
        <Grid item xs={3} sm={3}>
          <DateTime clearable label={t('Schedule.From')} value={schedule?.fromDate} onChange={scheduleLens.fromDate |> set} />
        </Grid>
        <Grid item xs={3} sm={3}>
          <DateTime clearable label={t('Schedule.To')} value={schedule?.toDate} onChange={scheduleLens.toDate |> set} />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <SwitchWithInternalState
            labelOn={t('Schedule.Enabled')}
            labelOff={t('Schedule.Disabled')}
            checked={schedule?.enabled || false}
            onChange={handleActiveChanged}
          />
        </Grid>
        <Grid item xs={12} sm={12} lg={12}>
          <SwitchWithInternalState
            labelOn={t('Schedule.ParallelRuns')}
            labelOff={t('Schedule.ParallelRuns')}
            checked={schedule?.parallelRuns || false}
            onChange={handleParalledRunsChanged}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={12}>
          <Typography variant='body1'>{t('Schedule.WorkflowContext')}</Typography>
          <Editor
            theme='vs-light'
            language='json'
            autoIndent={true}
            options={{
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              selectOnLineNumbers: true,
              minimap: {
                enabled: false
              }
            }}
            width='100%'
            height={'300px'}
            value={(scheduleLens?.workflowContext |> get) || emptyString}
            onChange={onContextChange}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

ScheduleData.propTypes = {
  scheduleLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  workflows: PropTypes.array
}

export default ScheduleData
