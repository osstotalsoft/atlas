import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import MenuBookIcon from '@material-ui/icons/MenuBook'

const HelpButton = ({ onClick }) => {
  return (
    <IconButton size='medium' onClick={onClick}>
      <MenuBookIcon fontSize='small' />
    </IconButton>
  )
}

HelpButton.propTypes = {
  onClick: PropTypes.func
}

export default HelpButton
