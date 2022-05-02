import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@material-ui/core'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import { useTranslation } from 'react-i18next'
import { get, set } from '@totalsoft/react-state-lens'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig, eventHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import { emptyString } from 'utils/constants'

const EventNodeAdvancedSettings = ({ inputsLens }) => {
  const { t } = useTranslation()

  const handleToggleChange = useCallback(
    value => {
      set(inputsLens?.asyncComplete, value)
    },
    [inputsLens?.asyncComplete]
  )

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={6} container alignItems='center'>
        <Grid item xs={4} container justifyContent='space-between'>
          <Typography>{t('WorkflowTask.Event.AsyncComplete')}</Typography>
        </Grid>
        <Grid item xs={7}>
          <SwitchWithInternalState
            checked={(inputsLens?.asyncComplete |> get) || false}
            onChange={handleToggleChange}
            labelOff={t('General.Buttons.False')}
            labelOn={t('General.Buttons.True')}
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={commonTaskDefHelpConfig.ASYNC_COMPLETE} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={6} container alignItems='center' spacing={1}>
        <Grid item xs={11}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Event.Sink')}
            value={(inputsLens?.sink |> get) || emptyString}
            onChange={inputsLens.sink |> set |> onTextBoxChange}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={eventHelpConfig.SINK} hasTranslations={true} />
        </Grid>
      </Grid>
    </Grid>
  )
}

EventNodeAdvancedSettings.propTypes = {
  inputsLens: PropTypes.object.isRequired
}

export default EventNodeAdvancedSettings
