import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@totalsoft/rocket-ui'
import CompareDefinition from './CompareDefinition'
import styles from '../styles'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(styles)

const CompareDefinitionDialog = ({ open, onToggleDialog, definition, currentDefinition }) => {
  const classes = useStyles()

  return (
    <Dialog
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
