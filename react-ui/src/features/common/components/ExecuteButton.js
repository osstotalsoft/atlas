import React from 'react'
import PropTypes from 'prop-types'
import ExecuteIcon from '@mui/icons-material/PlayCircleFilledWhite'
import { IconButton } from '@totalsoft/rocket-ui'

const ExecuteButton = ({ title, onClick }) => (
  <IconButton variant='text' size='tiny' color='secondary' onClick={onClick} tooltip={title}>
    <ExecuteIcon mr={2} />
  </IconButton>
)

ExecuteButton.defaultProps = {
  disabled: true
}

ExecuteButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func
}

export default ExecuteButton
