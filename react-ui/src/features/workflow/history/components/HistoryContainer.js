import React, { useCallback, useState } from 'react'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { HISTORY_QUERY } from '../queries/HistoryQuery'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import Grid from '@mui/material/Grid'
import { FakeText } from '@totalsoft/rocket-ui'
import CompareDefinition from 'features/workflow/edit/components/workflowHistory/modals/CompareDefinition'

const HistoryContainer = () => {
  const [flow, setFlow] = useState(null)
  const { loading, data } = useQueryWithErrorHandling(HISTORY_QUERY, { variables: {} })

  const flows = data?.allWorkflowHistory || []

  const onViewClick = useCallback(
    event => {
      const name = event.currentTarget.id
      setFlow(data?.allWorkflowHistory[name])
    },
    [setFlow, data?.allWorkflowHistory]
  )

  if (loading) return <FakeText lines={8} />

  return (
    <>
      <Grid container>
        <Grid item xs={2} style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 150px)' }}>
          <List>
            {Object.keys(flows).map((workflow, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton disabled={workflow === `${flow?.current?.name}_${flow?.current?.version}`} id={workflow} name={workflow} onClick={onViewClick}>
                  <ListItemText style={{ wordBreak: 'break-all' }} primary={`${flows[workflow].current.name}/${flows[workflow].current.version}`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={10} style={{ overflowY: 'scroll', maxHeight: 'calc(100vh - 150px)' }}>
          {flow && <CompareDefinition definition={flow?.latest?.definition} currentDefinition={flow?.current} showDates={true} />}
        </Grid>
      </Grid>
    </>
  )
}

export default HistoryContainer
