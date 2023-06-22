import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { get, set } from '@totalsoft/rules-algebra-react'
import { useTranslation } from 'react-i18next'
import { Grid, Typography } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import TerminateNodeAdvancedSettings from 'features/designer/nodeModels/terminateNode/TerminateNodeAdvancedSettings'
import EventNodeAdvancedSettings from 'features/designer/nodeModels/eventNode/EventNodeAdvancedSettings'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import HttpNodeAdvancedSettings from 'features/designer/nodeModels/httpNode/HttpNodeAdvancedSettings'

const AdvancedSettings = ({ inputsLens, validation }) => {
  const inputs = inputsLens |> get
  const { t } = useTranslation()

  const handleToggleChange = useCallback(
    value => {
      set(inputsLens?.optional, value)
    },
    [inputsLens?.optional]
  )

  return (
    <>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={6} container alignItems='center'>
          <Grid item xs={4} container justifyContent='space-between'>
            <Typography display='inline'>{t('WorkflowTask.Optional')}</Typography>
          </Grid>
          <Grid item xs={7}>
            <SwitchWithInternalState
              checked={inputs?.optional}
              onChange={handleToggleChange}
              disabled={inputs?.type === nodeConfig.TERMINATE.type}
              labelOff={t('General.Buttons.False')}
              labelOn={t('General.Buttons.True')}
            />
          </Grid>
          <Grid item xs={1}>
            <Help icon={<CustomHelpIcon />} helpConfig={commonTaskDefHelpConfig.OPTIONAL} hasTranslations={true} />
          </Grid>
        </Grid>
        <Grid item xs={6} />
        <Grid item xs={6} container alignItems='center' spacing={1}>
          <Grid item xs={11}>
            <CustomTextField
              fullWidth
              isNumeric
              label={t('WorkflowTask.StartDelay')}
              value={inputsLens?.startDelay |> get}
              onChange={inputsLens.startDelay |> set}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={1}>
            <Help icon={<CustomHelpIcon />} helpConfig={commonTaskDefHelpConfig.START_DELAY} hasTranslations={true} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {inputs?.type === nodeConfig.TERMINATE.type && <TerminateNodeAdvancedSettings inputsParamsLens={inputsLens?.inputParameters} />}
          {inputs?.type === nodeConfig.EVENT.type && <EventNodeAdvancedSettings inputsLens={inputsLens} validation={validation} />}
          {inputs?.type === nodeConfig.HTTP.type && <HttpNodeAdvancedSettings inputsParamsLens={inputsLens?.inputParameters} />}
        </Grid>
      </Grid>
    </>
  )
}

AdvancedSettings.propTypes = {
  inputsLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired
}

export default AdvancedSettings
