import React from 'react'
import PropTypes from 'prop-types'
import ExecuteIcon from '@material-ui/icons/PlayCircleFilledWhite'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'

const ExecuteButton = ({ title, onClick }) => (
  <IconButton size={'small'} color={'themeNoBackground'} onClick={onClick} tooltip={title}>
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
