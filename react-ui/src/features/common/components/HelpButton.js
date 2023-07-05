import React from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@totalsoft/rocket-ui'
import MenuBookIcon from '@mui/icons-material/MenuBook'

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
