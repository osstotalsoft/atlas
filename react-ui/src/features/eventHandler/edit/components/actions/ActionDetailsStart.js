import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import styles from 'assets/jss/components/tableStyle'
import { Grid, makeStyles } from '@material-ui/core'
import { CustomTextField } from '@bit/totalsoft_oss.react-mui.kit.core'
import StartWorkflowInputList from './StartWorkflowInputList'
import { get, set } from '@totalsoft/react-state-lens'
import { emptyString } from 'utils/constants'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const useStyles = makeStyles(styles)

const ActionDetailsStart = ({ actionDetailsLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const actionDetails = actionDetailsLens |> get

  return (
    <Grid container spacing={2} className={classes.tableContent}>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.WorkflowName')}
          fullWidth
          value={actionDetails?.name || emptyString}
          onChange={actionDetailsLens.name |> set |> onTextBoxChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label={t('EventHandler.Version')}
          fullWidth
          isNumeric
          customInputProps={{
            decimalScale: 0,
            thousandSeparator: false,
            allowNegative: false
          }}
          value={actionDetails?.version || emptyString}
          onChange={actionDetailsLens.version |> set}
        />
      </Grid>
      <Grid item xs={12}>
        <StartWorkflowInputList inputLens={actionDetailsLens.input} disableSave={disableSave} />
      </Grid>
      <Grid item xs={12} sm={4} lg={4} />
    </Grid>
  )
}

ActionDetailsStart.propTypes = {
  actionDetailsLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default ActionDetailsStart
