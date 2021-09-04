import React, { useRef, useEffect, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import appStyle from 'assets/jss/components/appStyle'
import logo from 'assets/img/logo.png'
import miniLogo from 'assets/img/miniLogo.png'
import cx from 'classnames'

import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
import Footer from './layout/Footer'

import AppRoutes from 'routes/AppRoutes'

import { ToastContainer, CheckInternetConnection } from '@bit/totalsoft_oss.react-mui.kit.core'
import { SidebarContext } from 'providers/SidebarProvider'

const useStyles = makeStyles(appStyle)

function App(props) {
  const mainPanelRef = useRef()
  const classes = useStyles()
  const { location } = props
  const { i18n } = useTranslation()

  const [drawerOpen, setDrawerOpen] = useContext(SidebarContext)

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(!drawerOpen)
  }, [drawerOpen, setDrawerOpen])

  const handleCloseDrawer = useCallback(() => {
    if (!drawerOpen) return
    setDrawerOpen(false)
  }, [drawerOpen, setDrawerOpen])

  const changeLanguage = useCallback(
    lng => {
      i18n.changeLanguage(lng.target.value)
    },
    [i18n]
  )

  useEffect(() => {
    mainPanelRef.current.scrollTop = 0
  }, [location.pathname])

  const mainPanel =
    classes.mainPanel +
    ' ' +
    cx({
      [classes.mainPanelSidebarMini]: !drawerOpen
    })

  return (
    <div className={classes.wrapper}>
      <Sidebar
        logo={drawerOpen ? logo : miniLogo}
        closeDrawer={handleCloseDrawer}
        changeLanguage={changeLanguage}
        drawerOpen={drawerOpen}
      />
      <div className={mainPanel} ref={mainPanelRef}>
        <Header drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
        <AppRoutes />
        <Footer fluid />
      </div>
      <ToastContainer />
      <CheckInternetConnection />
    </div>
  )
}

App.propTypes = {
  location: PropTypes.object.isRequired
}

export default App
