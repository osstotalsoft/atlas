import React from 'react'
import PropTypes from 'prop-types'
import styles from 'assets/jss/components/tableStyle'
import { Grid, makeStyles } from '@material-ui/core'
import StartWorkflowInputList from './StartWorkflowInputList'

const useStyles = makeStyles(styles)

const ActionDetailsStart = ({ actionDetailsLens, disableSave }) => {
  const classes = useStyles()

  return (
    <Grid container spacing={2} className={classes.tableContent}>
      <Grid item xs={12}>
        <StartWorkflowInputList inputLens={actionDetailsLens?.input} disableSave={disableSave} />
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
