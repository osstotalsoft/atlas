import React, { useState, useCallback, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import { List, ListItem, Collapse, ListItemText, ListItemIcon, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'

import userMenuStyle from 'assets/jss/components/userMenuStyle'
import cx from 'classnames'
import LanguageSelector from './LanguageSelector'
import avatar_default from 'assets/img/default-avatar.png'
import { useTranslation } from 'react-i18next'
import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import userMenuConfig from 'constants/userMenuConfig'
import UserMenuItem from './UserMenuItem'
import { useLocation } from 'react-router-dom'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'

import { useLazyQuery } from '@apollo/client'
import { TenantContext } from 'providers/TenantAuthenticationProvider'
import TenantSelector, { MY_TENANTS_QUERY } from './TenantSelector'

const useStyles = makeStyles(userMenuStyle)

function UserMenu({ drawerOpen, avatar, language, changeLanguage, withGradient }) {
  const [openAvatar, setOpenAvatar] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation()
  const location = useLocation()
  const { oidcUser, logout } = useReactOidc()

  const activeRoute = useCallback(routeName => location.pathname.indexOf(routeName) > -1, [location.pathname])
  const userMenuItems = userMenuConfig

  const openCollapseAvatar = useCallback(
    e => {
      setOpenAvatar(!openAvatar)
      e.preventDefault()
    },
    [openAvatar]
  )

  const setContextTenant = useContext(TenantContext)

  // // TODO: might have the issue https://github.com/apollographql/apollo-client/issues/5179
  const [callMyTenantsQuery, { called, loading: tenantsLoading, data }] = useLazyQuery(MY_TENANTS_QUERY)

  useEffect(() => {
    if (!oidcUser || called || tenantsLoading) {
      return
    }

    //callMyTenantsQuery()
  }, [callMyTenantsQuery, called, tenantsLoading, oidcUser])
  const myTenants = data?.myTenants
  const logoutAction = useCallback(
    e => {
      e.preventDefault()
      logout()
      setContextTenant()
    },
    [logout, setContextTenant]
  )

  const userName = oidcUser?.profile?.firstName
    ? `${oidcUser?.profile.name} ${oidcUser?.profile.lastName}`
    : oidcUser?.profile?.name
    ? oidcUser?.profile?.name.split('@')[0]
    : 'User'
  const [tenant, setTenant] = useState(
    myTenants && oidcUser?.profile?.tid && myTenants.find(t => t.externalId.toUpperCase() === oidcUser?.profile?.tid.toUpperCase())
  )
  useEffect(() => {
    const localTenant =
      myTenants && oidcUser?.profile?.tid && myTenants.find(t => t.externalId.toUpperCase() === oidcUser?.profile?.tid.toUpperCase())
    if (!localTenant || tenant) {
      return
    }
    setTenant(localTenant)
  }, [myTenants, oidcUser, tenant])

  const handleTenantChange = useCallback(
    e => {
      setTenant(e)
      setContextTenant(e.code)
    },
    [setContextTenant]
  )

  const tenantName = tenant?.name ? ` - ${tenant.name}` : ''
  const itemText =
    classes.itemText +
    ' ' +
    cx({
      [classes.itemTextMini]: !drawerOpen
    })
  const displayName = `${userName}${tenantName}`

  return (
    <List className={classes.userMenuContainer}>
      <ListItem className={classes.item + ' ' + classes.userItem}>
        <NavLink to={'/'} className={classes.itemLink} onClick={openCollapseAvatar}>
          <ListItemIcon className={classes.itemIcon}>
            <img src={avatar ? avatar : avatar_default} className={classes.photo} alt='...' />
          </ListItemIcon>
          <ListItemText
            primary={displayName}
            secondary={openAvatar ? <ArrowDropUp className={classes.caret} /> : <ArrowDropDown className={classes.caret} />}
            disableTypography={true}
            className={itemText}
          />
        </NavLink>
        <Collapse in={openAvatar} unmountOnExit classes={{ wrapper: classes.collapseWrapper }}>
          <List className={classes.list + classes.collapseList}>
            {userMenuItems.map((userMenu, key) => {
              return (
                <UserMenuItem key={key} userMenu={userMenu} drawerOpen={drawerOpen} activeRoute={activeRoute} withGradient={withGradient} />
              )
            })}
            {oidcUser && (
              <Tooltip disableHoverListener={drawerOpen} title={t('Tooltips.Logout')}>
                <ListItem className={classes.collapseItem}>
                  <NavLink to={'/'} className={classes.itemLink} onClick={logoutAction}>
                    <ListItemIcon className={classes.itemIcon}>
                      <PowerSettingsNew />
                    </ListItemIcon>
                    <ListItemText primary={t('Tooltips.Logout')} disableTypography={true} className={itemText} />
                  </NavLink>
                </ListItem>
              </Tooltip>
            )}
            <ListItem className={classes.selectorItem}>
              <LanguageSelector language={language} changeLanguage={changeLanguage} drawerOpen={drawerOpen} />
            </ListItem>
            {!tenantsLoading && myTenants?.length > 1 && (
              <Tooltip disableHoverListener={drawerOpen} title={t('Tooltips.TenantList')}>
                <ListItem className={classes.selectorItem}>
                  <TenantSelector tenant={tenant} tenants={myTenants} changeTenant={handleTenantChange} drawerOpen={drawerOpen} />
                </ListItem>
              </Tooltip>
            )}{' '}
          </List>
        </Collapse>
      </ListItem>
    </List>
  )
}

UserMenu.propTypes = {
  avatar: PropTypes.string,
  drawerOpen: PropTypes.bool.isRequired,
  changeLanguage: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  withGradient: PropTypes.bool.isRequired
}

export default UserMenu
