import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
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
