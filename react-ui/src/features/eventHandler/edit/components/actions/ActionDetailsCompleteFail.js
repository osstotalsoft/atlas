import React from 'react'
import PropTypes from 'prop-types'
import styles from 'assets/jss/components/tableStyle'
import { Grid, makeStyles } from '@material-ui/core'
import { CustomTextField } from '@bit/totalsoft_oss.react-mui.kit.core'
import CompleteFailWorkflowInputList from './CompleteFailWorkflowInputList'
import { useTranslation } from 'react-i18next'
import { get, set } from '@totalsoft/react-state-lens'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyString } from 'utils/constants'

const useStyles = makeStyles(styles)

const ActionDetailsCompleteFail = ({ actionDetailsLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const actionDetails = actionDetailsLens |> get

  return (
    <Grid container spacing={2} className={classes.tableContent}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.WorkflowId')}
          fullWidth
          value={actionDetails?.workflowId || emptyString}
          onChange={actionDetailsLens.workflowId |> set |> onTextBoxChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.TaskRefName')}
          fullWidth
          value={actionDetails?.taskRefName || emptyString}
          onChange={actionDetailsLens.taskRefName |> set |> onTextBoxChange}
        />
      </Grid>
      <Grid item xs={12}>
        <CompleteFailWorkflowInputList outputLens={actionDetailsLens.output} disableSave={disableSave} />
      </Grid>
      <Grid item xs={10} />
    </Grid>
  )
}

ActionDetailsCompleteFail.propTypes = {
  actionDetailsLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default ActionDetailsCompleteFail
