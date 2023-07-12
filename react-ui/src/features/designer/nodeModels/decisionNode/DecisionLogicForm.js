import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import { get, set } from '@totalsoft/rules-algebra-react'
import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { decisionHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import { Grid } from '@mui/material'

const DecisionLogicForm = ({ inputsLens, toggle }) => {
  const { t } = useTranslation()
  const caseExpression = toggle
  const caseValue = !caseExpression

  return (
    <>
      {caseValue && (
        <Grid container alignItems='center' spacing={1}>
          <Grid item xs={11}>
            <TextField
              fullWidth
              label={t('WorkflowTask.Decision.CaseValueParam')}
              value={(inputsLens?.caseValueParam |> get) || emptyString}
              onChange={inputsLens.caseValueParam |> set |> onTextBoxChange}
              variant='outlined'
            />
          </Grid>
          <Grid item xs={1}>
            <Help icon={<CustomHelpIcon />} helpConfig={decisionHelpConfig.CASE_VALUE_PARAM} hasTranslations={true} />
          </Grid>
        </Grid>
      )}
      {caseExpression && (
        <AceEditor
          mode={'javascript'}
          width='100%'
          height={'300px'}
          theme='tomorrow'
          fontSize={16}
          value={(inputsLens?.caseExpression |> get) || emptyString}
          onChange={inputsLens.caseExpression |> set}
          wrapEnabled={true}
        />
      )}
    </>
  )
}

DecisionLogicForm.propTypes = {
  inputsLens: PropTypes.object.isRequired,
  toggle: PropTypes.bool.isRequired
}

export default DecisionLogicForm
