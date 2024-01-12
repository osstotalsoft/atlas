import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { HISTORY_QUERY } from '../queries/HistoryQuery'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Grid from '@mui/material/Grid'
import CompareDefinition from 'features/workflow/edit/components/workflowHistory/modals/CompareDefinition'

const HistoryContainer = () => {
  const [flow, setFlow] = useState(null)
  const { t } = useTranslation()
  const { loading, data } = useQueryWithErrorHandling(HISTORY_QUERY, { variables: {} })

  const flows = data?.allWorkflowHistory || []

  const onViewClick = useCallback(
    event => {
      const name = event.currentTarget.id
      setFlow(data?.allWorkflowHistory[name])
    },
    [setFlow, data?.allWorkflowHistory]
  )

  return (
    <>
      <Grid container>
        <Grid item xs={2} style={{overflowY: 'scroll', maxHeight: 'calc(100vh - 150px)'}}>
          <List>
            {Object.keys(flows).map((flow, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton id={flow} name={flow} onClick={onViewClick}>
                  <ListItemText style={{ wordBreak: 'break-all' }} primary={flows[flow].current.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} style={{overflowY: 'scroll', maxHeight: 'calc(100vh - 150px)'}}>
          {flow && <CompareDefinition definition={flow?.latest?.definition} currentDefinition={flow?.current} />}
        </Grid>
      </Grid>
    </>
  )
}

export default HistoryContainer
