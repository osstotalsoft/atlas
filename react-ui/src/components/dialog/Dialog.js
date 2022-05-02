import React from 'react'
import PropTypes from 'prop-types'
import { Dialog as MuiDialog, DialogTitle, DialogContent, makeStyles } from '@material-ui/core'
import dialogStyle from './dialogStyle'

const useStyles = makeStyles(dialogStyle)

const Dialog = ({ id, open, title, content, onClose, ...rest }) => {
  const classes = useStyles()

  return (
    <MuiDialog
      PaperProps={{
        className: classes.paper
      }}
      open={open}
      onClose={onClose}
      aria-labelledby={`${id}-dialog-display-title`}
      maxWidth={'lg'}
      {...rest}
    >
      <DialogTitle id={`${id}-dialog-display-title`}>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
    </MuiDialog>
  )
}

Dialog.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.node
}

export default Dialog
