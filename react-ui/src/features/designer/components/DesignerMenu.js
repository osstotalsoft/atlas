import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Tab, Tabs } from '@material-ui/core'
import styles from '../styles/sidebarStyles'
import menuConfig from '../constants/DesignerMenuConfig'
import { useTranslation } from 'react-i18next'
import { tasksConfig } from '../constants/TasksConfig'

const useStyles = makeStyles(styles)

const DesignerMenu = ({ setActiveTask }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = useCallback(
    (_event, newValue) => {
      setTabIndex(newValue)
      switch (newValue) {
        case 0:
          setActiveTask(tasksConfig.SYSTEM_TASKS)
          break
        case 1:
          setActiveTask(tasksConfig.TASKS)
          break
        case 2:
          setActiveTask(tasksConfig.WORKFLOWS)
          break
      }
    },
    [setActiveTask]
  )

  return (
    <>
      <Tabs
        value={tabIndex}
        variant='fullWidth'
        scrollButtons='auto'
        indicatorColor='secondary'
        textColor='secondary'
        onChange={handleTabChange}
        style={{ margin: '0px 10px 0px 10px' }}
      >
        {menuConfig?.map((menu, index) => {
          return (
            <Tab
              key={index}
              id={menu.name}
              label={t(menu.text)}
              icon={menu.icon}
              style={{ minWidth: '60px' }}
              classes={{
                root: classes.pills,
                selected: classes.selectedPills
              }}
            />
          )
        })}
      </Tabs>
    </>
  )
}

DesignerMenu.propTypes = {
  setActiveTask: PropTypes.func.isRequired
}

export default DesignerMenu
