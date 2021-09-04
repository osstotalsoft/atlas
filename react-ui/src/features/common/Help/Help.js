import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Popover } from '@material-ui/core'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import HelpIcon from '@material-ui/icons/HelpOutline'
import HelpContainer from './HelpContainer'
import helperStyles from 'assets/jss/components/helperStyle'

const useStyles = makeStyles(helperStyles)

const Help = ({ helpConfig, hasTranslations, icon, iconSize }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const handleClick = useCallback(event => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }, [])

  const handlePopoverClose = useCallback(event => {
    event.stopPropagation()
    setAnchorEl(null)
  }, [])
  const open = Boolean(anchorEl)
  return (
    <>
      <IconButton
        size={iconSize}
        customClass='help'
        onClick={handleClick}
        color='themeNoBackground'
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup='true'
      >
        {icon}
      </IconButton>
      <Popover
        id='mouse-over-popover'
        open={open}
        anchorEl={anchorEl}
        classes={{ paper: classes.paper, root: classes.root }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <HelpContainer helpConfig={helpConfig} hasTranslations={hasTranslations} />
      </Popover>
    </>
  )
}

Help.defaultProps = {
  icon: <HelpIcon />,
  iconSize: 'small'
}

Help.propTypes = {
  helpConfig: PropTypes.array.isRequired,
  iconSize: PropTypes.oneOf(['small', 'medium']),
  icon: PropTypes.node,
  hasTranslations: PropTypes.bool
}

export default Help
