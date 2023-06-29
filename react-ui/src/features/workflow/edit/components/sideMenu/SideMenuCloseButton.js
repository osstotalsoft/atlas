import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import infoSideMenuStyle from './sideMenuStyle'

const useStyles = makeStyles(infoSideMenuStyle)

const SideMenuCloseButton = ({ onClick }) => {
  const classes = useStyles()

  return (
    <div className={classes.buttonContainerClose}>
      <IconButton onClick={onClick} className={classes.button}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  )
}

SideMenuCloseButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SideMenuCloseButton
