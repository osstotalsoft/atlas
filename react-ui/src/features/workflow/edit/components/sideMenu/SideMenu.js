import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import WorkflowExecutionListContainer from '../workflowExecution/WorkflowExecutionListContainer'
import { Tabs, Tab, Grid, AppBar } from '@mui/material'
import { makeStyles } from '@mui/styles'
import TabPanel from 'features/common/components/TabPanel/TabPanel'
import SideMenuOpenButton from './SideMenuOpenButton'
import SideMenuCloseButton from './SideMenuCloseButton'
import infoSideMenuStyle from './sideMenuStyle'
import { useTranslation } from 'react-i18next'
import { Drawer } from '@mui/material'
import WorkflowHistoryListContainer from '../workflowHistory/components/WorkflowHistoryListContainer'
import workflowConfig from 'features/designer/constants/WorkflowConfig'

const useStyles = makeStyles(infoSideMenuStyle)

const SideMenu = ({ workflow }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(0)

  const handleTabChange = useCallback((_, newValue) => {
    setValue(newValue)
  }, [])

  const toggleDrawer = useCallback(() => {
    setOpen(current => !current)
  }, [])

  return (
    <>
      <SideMenuOpenButton onClick={toggleDrawer} />
      <Drawer
        variant='persistent'
        anchor='right'
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
        PaperProps={{ elevation: 9 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppBar position='static' color='default'>
              <Tabs value={value} onChange={handleTabChange} indicatorColor='secondary' textColor='secondary' variant='fullWidth'>
                <Tab className={classes.tabLabel} label={t('Workflow.SideMenu.Tabs.Executions')} />
                <Tab className={classes.tabLabel} label={t('Workflow.SideMenu.Tabs.History')} />
              </Tabs>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            <TabPanel value={value} index={0}>
              <WorkflowExecutionListContainer
                workflowName={workflow?.name}
                version={workflow?.version || workflowConfig.version}
                displayData={open && value === 0}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <WorkflowHistoryListContainer workflow={workflow} displayData={open && value === 1} />
            </TabPanel>
          </Grid>
          <Grid item xs={12}>
            <SideMenuCloseButton onClick={toggleDrawer} />
          </Grid>
        </Grid>
      </Drawer>
    </>
  )
}

SideMenu.propTypes = {
  workflow: PropTypes.object
}

export default SideMenu
