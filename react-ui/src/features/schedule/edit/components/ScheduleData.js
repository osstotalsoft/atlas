import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyString } from 'utils/constants'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { isValid, getErrors } from '@totalsoft/pure-validations-react'
import { IconCard, LoadingFakeText, Autocomplete } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Info } from '@material-ui/icons'
import DateTime from '@bit/totalsoft_oss.react-mui.date-time'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { get, set } from '@totalsoft/react-state-lens'
import JsonLint from 'jsonlint-mod'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'

const ScheduleData = ({ scheduleLens, validation, loading, workflows }) => {
  const { t } = useTranslation()
  const schedule = scheduleLens |> get

  const [annotations, setAnnotations] = useState()

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
      try {
        JsonLint.parse(value)
        setAnnotations(null)
      } catch (e) {
        const row = parseInt(e.message.match(/Parse error on line (\d+)/)[1]) - 1
        const annotation = { row, text: e.message, type: 'error' }
        setAnnotations([annotation])
      }
    },
    [scheduleLens.workflowContext]
  )

  if (loading) return <LoadingFakeText lines={3} />

  return (
    <IconCard
      icon={Info}
      title={t('Schedule.Data')}
      content={
        <Grid container spacing={2} justifyContent='flex-start' alignItems='flex-end'>
          <Grid item xs={12} sm={12} lg={12}>
            <CustomTextField
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
            <CustomTextField
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
            <AceEditor
              mode={'json'}
              width='100%'
              height={'300px'}
              theme='tomorrow'
              fontSize={16}
              annotations={annotations}
              debounceChangePeriod={200}
              value={(scheduleLens?.workflowContext |> get) || emptyString}
              onChange={onContextChange}
              wrapEnabled={true}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

ScheduleData.propTypes = {
  scheduleLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  workflows: PropTypes.array
}

export default ScheduleData
