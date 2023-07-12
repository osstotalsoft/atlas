import React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import styles from './tabPanelStyle'

const useStyles = makeStyles(styles)

const TabPanel = ({ children, value, index, ...other }) => {
  const classes = useStyles()

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box className={classes.root}>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

export default TabPanel
