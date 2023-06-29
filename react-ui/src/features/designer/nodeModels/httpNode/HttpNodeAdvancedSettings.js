import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { useTranslation } from 'react-i18next'
import { get, set } from '@totalsoft/react-state-lens'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const HttpNodeAdvancedSettings = ({ inputsParamsLens }) => {
  const { t } = useTranslation()

  const handleToggleChange = useCallback(
    value => {
      set(inputsParamsLens?.asyncComplete, value)
    },
    [inputsParamsLens?.asyncComplete]
  )

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={6} container alignItems='center'>
        <Grid item xs={4} container justifyContent='space-between'>
          <Typography>{t('WorkflowTask.Event.AsyncComplete')}</Typography>
        </Grid>
        <Grid item xs={7}>
          <SwitchWithInternalState
            checked={(inputsParamsLens?.asyncComplete |> get) || false}
            onChange={handleToggleChange}
            labelOff={t('General.Buttons.False')}
            labelOn={t('General.Buttons.True')}
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={commonTaskDefHelpConfig.ASYNC_COMPLETE} hasTranslations={true} />
        </Grid>
      </Grid>
    </Grid>
  )
}

HttpNodeAdvancedSettings.propTypes = {
  inputsParamsLens: PropTypes.object.isRequired
}

export default HttpNodeAdvancedSettings
