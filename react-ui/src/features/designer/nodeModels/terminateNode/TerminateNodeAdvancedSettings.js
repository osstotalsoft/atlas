import React, { useCallback } from 'react'
import { Grid, Typography } from '@mui/material'
import { get, set } from '@totalsoft/rules-algebra-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import PropTypes from 'prop-types'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import { useTranslation } from 'react-i18next'
import { TextField } from '@totalsoft/rocket-ui'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { terminateHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const TerminateNodeAdvancedSettings = ({ inputsParamsLens }) => {
  const { t } = useTranslation()
  const { completed, failed } = nodeConfig.TERMINATE.terminationStatus
  const checked = (inputsParamsLens?.terminationStatus |> get) === completed

  const handleToggleChange = useCallback(
    value => {
      const terminationStatus = value ? completed : failed
      set(inputsParamsLens?.terminationStatus, terminationStatus)
    },
    [completed, failed, inputsParamsLens?.terminationStatus]
  )

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item container xs={6} spacing={2} alignItems='center'>
        <Grid item xs={4}>
          <Typography display='inline'>{t('WorkflowTask.Terminate.Failed')}</Typography>
        </Grid>
        <Grid item xs={3}>
          <SwitchWithInternalState checked={checked} onChange={handleToggleChange} />
        </Grid>
        <Grid item xs={4}>
          <Typography display='inline'>{t('WorkflowTask.Terminate.Completed')}</Typography>
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={terminateHelpConfig.FAILED_OR_COMPLETED} hasTranslations={true} />
        </Grid>
        <Grid item xs={11}>
          <TextField
            fullWidth
            label={t('WorkflowTask.Terminate.WorkflowOutput')}
            value={inputsParamsLens?.workflowOutput |> get}
            onChange={inputsParamsLens.workflowOutput |> set |> onTextBoxChange}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} helpConfig={terminateHelpConfig.WORKFLOW_OUTPUT} hasTranslations={true} />
        </Grid>
      </Grid>
    </Grid>
  )
}

TerminateNodeAdvancedSettings.propTypes = {
  inputsParamsLens: PropTypes.object.isRequired
}

export default TerminateNodeAdvancedSettings
