import React from 'react'
import PropTypes from 'prop-types'
import { IconButton, makeStyles } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import infoSideMenuStyle from './sideMenuStyle'

const useStyles = makeStyles(infoSideMenuStyle)

const SideMenuOpenButton = ({ onClick }) => {
  const classes = useStyles()

  return (
    <div className={classes.buttonContainerOpen}>
      <IconButton onClick={onClick} className={classes.button}>
        <ArrowBackIosIcon />
      </IconButton>
    </div>
  )
}

SideMenuOpenButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SideMenuOpenButton
