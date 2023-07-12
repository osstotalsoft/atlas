import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Grid, Tabs, Tab } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import DiagramTaskSummary from './DiagramTaskSummary'
import { emptyObject } from 'utils/constants'
import DiagramTaskJson from './DiagramTaskJson'

const DiagramTaskModal = ({ selectedTask }) => {
  const { t } = useTranslation()
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabChange = useCallback((_event, newValue) => {
    setTabIndex(newValue)
  }, [])

  return (
    <Grid container justifyContent='flex-end' alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <AppBar position='static' color='default'>
          <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor='secondary' textColor='secondary' variant='fullWidth'>
            <Tab label={t('Execution.Diagram.Tabs.Summary')} />
            <Tab label={t('Execution.Diagram.Tabs.Json')} />
          </Tabs>
        </AppBar>
        <Grid style={{ marginTop: '20px' }} item xs={12}>
          {tabIndex == 0 && <DiagramTaskSummary selectedTask={selectedTask || emptyObject} />}
          {tabIndex == 1 && <DiagramTaskJson selectedTask={selectedTask || emptyObject} />}
        </Grid>
      </Grid>
    </Grid>
  )
}

DiagramTaskModal.propTypes = {
  selectedTask: PropTypes.object.isRequired
}

export default DiagramTaskModal
