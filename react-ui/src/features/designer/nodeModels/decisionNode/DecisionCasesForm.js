import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Grid, makeStyles } from '@material-ui/core'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import AddButton from '@bit/totalsoft_oss.react-mui.add-button'
import { useTranslation } from 'react-i18next'
import DecisionCasesList from './DecisionCasesList'
import { emptyString } from 'utils/constants'
import { set, get } from '@totalsoft/rules-algebra-react'
import taskEditModalStyle from 'assets/jss/components/taskEditModalStyle'
import Help from 'features/common/Help/Help'
import CustomHelpIcon from 'features/common/Help/CustomHelpIcon'
import { decisionHelpConfig } from 'features/common/Help/constants/SysTaskDefHelpConfig'
import SwitchWithInternalState from 'features/common/components/SwitchWithInternalState'
import Typography from '@bit/totalsoft_oss.react-mui.typography'

const useStyles = makeStyles(taskEditModalStyle)

const DecisionCasesForm = ({ inputsLens }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const inputs = inputsLens |> get
  const [localCase, setLocalCase] = useState()
  const [defaultCase, setDefaultCase] = useState(inputs?.hasDefaultCase ? true : false)

  const handleAddCase = useCallback(() => {
    if (localCase) {
      set(inputsLens.decisionCases[localCase], [])
      setLocalCase(emptyString)
    }
  }, [inputsLens.decisionCases, localCase])

  const handleDefaultCaseChange = useCallback(
    value => {
      setDefaultCase(value)
      set(inputsLens.hasDefaultCase, value)
    },
    [inputsLens]
  )

  const handleChange = useCallback(event => {
    setLocalCase(event.target.value)
  }, [])

  const handleKeyPressed = useCallback(({ keyCode }) => keyCode === 13 && handleAddCase(), [handleAddCase])

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} spacing={2} style={{ minHeight: '90px' }} onKeyDown={handleKeyPressed}>
        <Grid item xs={10}>
          <CustomTextField
            fullWidth
            label={t('WorkflowTask.Decision.AddCaseValue')}
            value={localCase || emptyString}
            onChange={handleChange}
            debounceBy={100}
            variant='outlined'
          />
        </Grid>
        <Grid item xs={2} container alignItems='center'>
          <AddButton
            key='addButton'
            color={'themeNoBackground'}
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
      <Grid item container xs={12} spacing={2} style={{ minHeight: '90px' }} onKeyDown={handleKeyPressed}>
        <Grid item xs={10} sm={10}>
          <Box border={1} borderRadius={'4px'}>
            <Typography variant='subtitle2' style={{ margin: '13px' }}>
              {t('WorkflowTask.Decision.DefaultCase')}
            </Typography>
          </Box>
        </Grid>
        <Grid item container xs={2} alignItems='center'>
          <SwitchWithInternalState checked={defaultCase} onChange={handleDefaultCaseChange} />
        </Grid>
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
