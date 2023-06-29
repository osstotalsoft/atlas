import React, { useState } from 'react'
import PropTypes from 'prop-types'
import SwitchParameterOrExpression from './SwitchParameterOrExpression'
import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import decisionNodeStyle from './decisionNodeStyle'
import { useTranslation } from 'react-i18next'
import { Divider } from '@mui/material'
import DecisionCasesForm from './DecisionCasesForm'
import DecisionLogicForm from './DecisionLogicForm'
import { get } from '@totalsoft/rules-algebra-react'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { decisionHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const useStyles = makeStyles(decisionNodeStyle)

const DecisionNodeGeneralSettings = ({ inputsLens }) => {
  const classes = useStyles()

  const inputs = inputsLens |> get

  const [toggle, setToggle] = useState(inputs?.caseExpression ? true : false)
  const { t } = useTranslation()

  return (
    <Grid container alignItems='flex-start' spacing={2}>
      <Grid item container spacing={2} xs={12} md={6}>
        <Grid item container xs={12} spacing={2} justifyContent='center' alignItems='center' className={classes.generalSettingsContainer}>
          <Grid item xs={3}>
            <Typography variant='subtitle2'>{t('WorkflowTask.Decision.CaseValueParam')}</Typography>
          </Grid>
          <Grid item xs={3} className={classes.centeredSwitch}>
            <SwitchParameterOrExpression toggle={toggle} setToggle={setToggle} inputsLens={inputsLens} />
          </Grid>
          <Grid item xs={3}>
            <Typography variant='subtitle2'>{t('WorkflowTask.Decision.CaseExpression')}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Help icon={<CustomHelpIcon />} helpConfig={decisionHelpConfig.PARAMETER_OR_EXPRESSION} hasTranslations={true} />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <DecisionLogicForm toggle={toggle} inputsLens={inputsLens} />
        </Grid>
      </Grid>
      <Grid item container xs={12} md={6}>
        <DecisionCasesForm inputsLens={inputsLens} />
      </Grid>
    </Grid>
  )
}

DecisionNodeGeneralSettings.propTypes = {
  inputsLens: PropTypes.object.isRequired
}

export default DecisionNodeGeneralSettings
