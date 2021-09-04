import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'

const HelpImportant = ({ text, gutterBottom }) => {
  return (
    <Typography display='block' variant='caption' color='error' gutterBottom={gutterBottom}>
      {text}
    </Typography>
  )
}

HelpImportant.defaultProps = {
  gutterBottom: false
}

HelpImportant.propTypes = {
  text: PropTypes.string.isRequired,
  gutterBottom: PropTypes.bool
}

export default HelpImportant
