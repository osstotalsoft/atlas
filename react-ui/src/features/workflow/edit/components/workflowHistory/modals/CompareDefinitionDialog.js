import React from 'react'
import PropTypes from 'prop-types'
import DialogDisplay from '@bit/totalsoft_oss.react-mui.dialog-display'
import CompareDefinition from './CompareDefinition'
import styles from '../styles'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(styles)

const CompareDefinitionDialog = ({ open, onToggleDialog, definition, currentDefinition }) => {
  const classes = useStyles()

  return (
    <DialogDisplay
      id='compareDefinition'
      open={open}
      onClose={onToggleDialog}
      className={classes.bodyContent}
      content={<CompareDefinition definition={definition} currentDefinition={currentDefinition} />}
    />
  )
}

CompareDefinitionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggleDialog: PropTypes.func.isRequired,
  definition: PropTypes.object.isRequired,
  currentDefinition: PropTypes.object
}

export default CompareDefinitionDialog
