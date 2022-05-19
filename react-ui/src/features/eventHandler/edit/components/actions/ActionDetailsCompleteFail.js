import React from 'react'
import PropTypes from 'prop-types'
import styles from 'assets/jss/components/tableStyle'
import { Grid, makeStyles } from '@material-ui/core'
import CompleteFailWorkflowInputList from './CompleteFailWorkflowInputList'

const useStyles = makeStyles(styles)

const ActionDetailsCompleteFail = ({ actionDetailsLens, disableSave }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2} className={classes.tableContent}>
      <Grid item xs={12}>
        <CompleteFailWorkflowInputList outputLens={actionDetailsLens?.output} disableSave={disableSave} />
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
