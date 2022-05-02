import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Checkbox, FormControlLabel, Grid } from '@material-ui/core'
import { CustomTextField, Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { set, get } from '@totalsoft/change-tracking-react'
import { onCheckBoxChange } from 'utils/propertyChangeAdapters'
import { emptyString } from 'utils/constants'

const GeneralSettingsModal = ({ workflowLens }) => {
  const { t } = useTranslation()

  const workflow = workflowLens |> get

  const handleChange = useCallback(
    propPath => event => {
      set(workflowLens[propPath], event.target.value)
    },
    [workflowLens]
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label={t('Workflow.Description')}
          value={workflow?.description || emptyString}
          onChange={handleChange('description')}
          debounceBy={100}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          isNumeric
          label={t('Workflow.Version')}
          value={workflow?.timeoutSeconds || 0}
          onChange={workflowLens.timeoutSeconds |> set}
          inputProps={{
            decimalScale: 0,
            thousandSeparator: true,
            allowNegative: false
          }}
          debounceBy={100}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          fullWidth
          label={t('Workflow.FailureWorkflow')}
          value={workflow?.failureWorkflow || emptyString}
          onChange={handleChange('failureWorkflow')}
          debounceBy={100}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              color='primary'
              checked={workflow?.workflowStatusListenerEnabled}
              onChange={workflowLens.workflowStatusListenerEnabled |> set |> onCheckBoxChange}
            />
          }
          label={
            <Typography color={'textSecondary'} variant={'caption'}>
              {t('Workflow.WorkflowStatusListenerEnabled')}
            </Typography>
          }
        />
      </Grid>
    </Grid>
  )
}

GeneralSettingsModal.propTypes = {
  workflowLens: PropTypes.object.isRequired
}

export default GeneralSettingsModal
