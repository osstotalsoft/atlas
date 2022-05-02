import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { get, set } from '@totalsoft/rules-algebra-react'
import TextFields from '@material-ui/icons/TextFields'
import StandardHeader from 'components/layout/StandardHeader.js'
import { useHeader } from 'providers/AreasProvider'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { Autocomplete, CustomTextField, IconCard, LoadingFakeText } from '@bit/totalsoft_oss.react-mui.kit.core'
import { getErrors, isValid } from '@totalsoft/pure-validations-react'

const Task = ({ taskLens, validation, loading, saving, onSave, isDirty, timeoutPolicyList, retryLogicList }) => {
  const { t } = useTranslation()
  const [, setHeader] = useHeader(<StandardHeader />)

  const task = taskLens |> get
  const {
    name,
    readOnly,
    description,
    ownerEmail,
    retryCount,
    retryLogic,
    retryDelaySeconds,
    timeoutPolicy,
    timeoutSeconds,
    responseTimeoutSeconds,
    inputKeys,
    outputKeys
  } = task

  const createTime = t('DATE_FORMAT', { date: { value: taskLens?.createTime |> get, format: 'DD-MM-YYYY HH:mm:ss' } })

  useEffect(() => {
    setHeader(<StandardHeader headerText={name} path='/tasks' saving={saving} onSave={onSave} disableSaving={!isDirty || readOnly} />)
  }, [isDirty, name, onSave, readOnly, saving, setHeader])

  if (loading) {
    return <LoadingFakeText lines={3} />
  }

  return (
    <IconCard
      icon={TextFields}
      title={t('Task.Data')}
      content={
        <form>
          <fieldset disabled={readOnly} style={{ border: 'none' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  label={t('Task.Name')}
                  value={name || emptyString}
                  onChange={taskLens.name |> set |> onTextBoxChange}
                  error={!isValid(validation?.name)}
                  helperText={getErrors(validation?.name)}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  label={t('Task.Description')}
                  value={description || emptyString}
                  onChange={taskLens.description |> set |> onTextBoxChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField disabled fullWidth label={t('Task.CreateTime')} value={createTime || emptyString} />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField disabled fullWidth label={t('Task.OwnerEmail')} value={ownerEmail || emptyString} />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  isNumeric
                  label={t('Task.RetryCount')}
                  value={retryCount || emptyString}
                  onChange={taskLens.retryCount |> set}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Autocomplete
                  label={t('Task.RetryLogic')}
                  simpleValue
                  valueKey={'name'}
                  options={retryLogicList}
                  value={retryLogic || emptyString}
                  onChange={taskLens.retryLogic |> set}
                  disabled={readOnly} //To be removed after we fix Autocomplete to inherit disable prop
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  isNumeric
                  label={t('Task.RetryDelaySeconds')}
                  value={retryDelaySeconds || emptyString}
                  onChange={taskLens.retryDelaySeconds |> set}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Autocomplete
                  label={t('Task.TimeoutPolicy')}
                  simpleValue
                  valueKey={'name'}
                  options={timeoutPolicyList}
                  value={timeoutPolicy || emptyString}
                  onChange={taskLens.timeoutPolicy |> set}
                  disabled={readOnly} //To be removed after we fix Autocomplete to inherit disable prop
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  isNumeric
                  label={t('Task.TimeoutSeconds')}
                  value={timeoutSeconds || emptyString}
                  onChange={taskLens.timeoutSeconds |> set}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  isNumeric
                  label={t('Task.ResponseTimeoutSeconds')}
                  value={responseTimeoutSeconds || emptyString}
                  onChange={taskLens.responseTimeoutSeconds |> set}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  label={t('Task.InputKeys')}
                  value={inputKeys || emptyString}
                  onChange={taskLens.inputKeys |> set |> onTextBoxChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomTextField
                  fullWidth
                  label={t('Task.OutputKeys')}
                  value={outputKeys || emptyString}
                  onChange={taskLens.outputKeys |> set |> onTextBoxChange}
                />
              </Grid>
            </Grid>
          </fieldset>
        </form>
      }
    />
  )
}

Task.propTypes = {
  taskLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isDirty: PropTypes.bool.isRequired,
  timeoutPolicyList: PropTypes.array.isRequired,
  retryLogicList: PropTypes.array.isRequired
}

export default Task
