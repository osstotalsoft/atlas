import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { Grid } from '@mui/material'
import { get, set } from '@totalsoft/rules-algebra-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { TextField } from '@totalsoft/rocket-ui'
import DecisionNodeGeneralSettings from 'features/designer/nodeModels/decisionNode/DecisionNodeGeneralSettings'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { commonTaskDefHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import { getErrors, isValid } from '@totalsoft/pure-validations-react'

const GeneralSettings = ({ inputsLens, validation }) => {
  const { t } = useTranslation()
  const nodeType = inputsLens?.type |> get

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} container spacing={1} alignItems='center' justifyContent='space-evenly'>
        <Grid item xs={11}>
          <TextField
            fullWidth
            label={t('WorkflowTask.Name')}
            value={(inputsLens?.name |> get) || emptyString}
            onChange={inputsLens.name |> set |> onTextBoxChange}
            error={!isValid(validation?.name)}
            helperText={getErrors(validation?.name)}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} iconSize='small' helpConfig={commonTaskDefHelpConfig.NAME} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={1} alignItems='center' justifyContent='space-evenly'>
        <Grid item xs={11}>
          <TextField
            fullWidth
            label={t('WorkflowTask.TaskReferenceName')}
            value={(inputsLens?.taskReferenceName |> get) || emptyString}
            onChange={inputsLens.taskReferenceName |> set |> onTextBoxChange}
            error={!isValid(validation?.taskReferenceName)}
            helperText={getErrors(validation?.taskReferenceName)}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} iconSize='small' helpConfig={commonTaskDefHelpConfig.TASK_REF_NAME} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={12} container spacing={1} alignItems='center' justifyContent='space-evenly'>
        <Grid item xs={11}>
          <TextField
            fullWidth
            label={t('WorkflowTask.Description')}
            value={(inputsLens?.description |> get) || emptyString}
            onChange={inputsLens.description |> set |> onTextBoxChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={1}>
          <Help icon={<CustomHelpIcon />} iconSize='small' helpConfig={commonTaskDefHelpConfig.DESCRIPTION} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {nodeType === nodeConfig.DECISION.type && <DecisionNodeGeneralSettings inputsLens={inputsLens} />}
      </Grid>
    </Grid>
  )
}

GeneralSettings.propTypes = {
  inputsLens: PropTypes.object.isRequired,
  validation: PropTypes.object.isRequired
}

export default GeneralSettings
