import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, Grid } from '@mui/material'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import DecisionCasesList from './DecisionCasesList'
import { emptyString } from 'utils/constants'
import { set } from '@totalsoft/rules-algebra-react'
import taskEditModalStyle from 'assets/jss/components/taskEditModalStyle'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { decisionHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'

const useStyles = makeStyles(taskEditModalStyle)

const DecisionCasesForm = ({ inputsLens }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const [localCase, setLocalCase] = useState()

  const handleAddCase = useCallback(() => {
    if (localCase) {
      set(inputsLens.decisionCases[localCase], [])
      setLocalCase(emptyString)
    }
  }, [inputsLens.decisionCases, localCase])

  const handleChange = useCallback(value => {
    setLocalCase(value)
  }, [])

  const handleKeyPressed = useCallback(({ keyCode }) => keyCode === 13 && handleAddCase(), [handleAddCase])

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} spacing={2} style={{ minHeight: '90px' }} onKeyDown={handleKeyPressed}>
        <Grid item xs={10}>
          <TextField
            fullWidth
            label={t('WorkflowTask.Decision.AddCaseValue')}
            value={localCase || emptyString}
            onChange={handleChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={2} container alignItems='center'>
          <IconButton
            key='addButton'
            type='add'
            color='secondary'
            size='small'
            fontSize='small'
            title={t('WorkflowTask.Decision.Buttons.AddCaseValue')}
            onClick={handleAddCase}
          />
          <Help icon={<CustomHelpIcon />} iconSize='small' helpConfig={decisionHelpConfig.ADD_NEW_CASE_VALUE} hasTranslations={true} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item container xs={12} spacing={2} className={classes.content}>
        <DecisionCasesList casesLens={inputsLens?.decisionCases} />
      </Grid>
    </Grid>
  )
}

DecisionCasesForm.propTypes = {
  inputsLens: PropTypes.object.isRequired
}

export default DecisionCasesForm
