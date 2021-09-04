import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import React from 'react'
import PropTypes from 'prop-types'
import { Divider, Grid, Typography } from '@material-ui/core'
import { get, set } from '@totalsoft/rules-algebra-react'
import { useTranslation } from 'react-i18next'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { lambdaHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const LambdaNodeInputParameters = ({ inputParametersLens }) => {
  const { t } = useTranslation()

  return (
    <>
      <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
      <Grid container spacing={1}>
        <Grid item>
          <Typography>{t('WorkflowTask.InputParameter.ScriptExpression')}</Typography>
        </Grid>
        <Grid item>
          <Help icon={<CustomHelpIcon />} helpConfig={lambdaHelpConfig.SCRIPT_EXPRESSION} hasTranslations={true} />
        </Grid>
        <Grid item xs={12}>
          <AceEditor
            mode={'javascript'}
            width='100%'
            height='300px'
            theme='tomorrow'
            fontSize={16}
            value={inputParametersLens?.scriptExpression |> get}
            onChange={inputParametersLens.scriptExpression |> set}
            wrapEnabled={true}
          />
        </Grid>
      </Grid>
    </>
  )
}

LambdaNodeInputParameters.propTypes = {
  inputParametersLens: PropTypes.object.isRequired
}

export default LambdaNodeInputParameters
