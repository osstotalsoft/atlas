import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { List } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useLocation } from 'react-router-dom'
import menuConfig from 'constants/menuConfig'
import menuStyle from 'assets/jss/components/menuStyle'
import MenuItem from './MenuItem'
import CollapsibleMenuItem from './CollapsibleMenuItem'
import { gql } from '@apollo/client'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import ScheduleIcon from '@mui/icons-material/Schedule'

export const FEATURE_FLAGS = gql`
  query featureFlags {
    features {
      schedule
    }
  }
`

const useStyles = makeStyles(menuStyle)

function Menu({ drawerOpen, withGradient }) {
  const classes = useStyles()
  const location = useLocation()
  const [menuItems, setMenuItems] = useState([])

  const activeRoute = useCallback(routeName => location.pathname.indexOf(routeName) > -1, [location.pathname])

  const { loading, data } = useQueryWithErrorHandling(FEATURE_FLAGS, { variables: {} })

  useEffect(() => {
    setMenuItems(menuConfig)
    if (data?.features?.schedule) {
      setMenuItems([...menuConfig, { icon: <ScheduleIcon />, text: 'NavBar.Schedule', path: '/schedule', name: 'Schedule' }])
    }
  }, [data])

  if (loading) return <Fragment></Fragment>

  return (
    menuItems && (
      <nav>
        <List className={classes.menuList}>
          {menuItems.map((menu, key) => {
            const menuItemProps = { key, menu, drawerOpen, activeRoute, withGradient }
            return menu.children ? <CollapsibleMenuItem {...menuItemProps} /> : <MenuItem {...menuItemProps} />
          })}
        </List>
      </nav>
    )
  )
}

Menu.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default Menu
