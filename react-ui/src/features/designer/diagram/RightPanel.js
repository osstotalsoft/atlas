import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Paper } from '@mui/material'
import PropTypes from 'prop-types'
import TaskSummary from './TaskSummary'
import ReactJson from 'react-json-view'
import { makeStyles } from '@mui/styles'
import _ from 'lodash'

const useStyles = makeStyles(() => ({
  margin: {
    margin: 15,
    wordBreak: 'break-all'
  },
  dfSelect: {
    padding: 15,
    backgroundColor: '#efefef'
  },
  panelTab: {
    minWidth: '100px'
  }
}))

export default function RightPanel({ selectedTask, dag, onChangeFlow }) {
  const [tabIndex, setTabIndex] = useState(0)

  const classes = useStyles()

  const changeTab = tab => () => setTabIndex(tab)

  useEffect(() => {
    setTabIndex(0) // Reset to Status Tab on ref change
  }, [selectedTask])

  let taskResult = null
  //retryOptions = null;
  if (!selectedTask) {
    return null
  } else {
    const { ref, taskId } = selectedTask
    const node = dag.graph.node(ref.ref)
    if (node) {
      if (node.taskResults.length > 1) {
        //retryOptions = node.taskResults;
      }

      if (taskId) {
        taskResult = node.taskResults.find(task => task.taskId === taskId)
      } else {
        taskResult = _.last(node.taskResults)
      }
    }
  }

  if (!taskResult) {
    return <Paper />
  }

  return (
    <Paper>
      <Tabs value={tabIndex}>
        <Tab className={classes.panelTab} label='Summary' onClick={changeTab(0)} />
        <Tab className={classes.panelTab} label='Input' onClick={changeTab(1)} disabled={!taskResult.status} />
        <Tab className={classes.panelTab} label='Output' onClick={changeTab(2)} disabled={!taskResult.status} />
        <Tab className={classes.panelTab} label='JSON' onClick={changeTab(3)} disabled={!taskResult.status} />
        <Tab className={classes.panelTab} label='Definition' onClick={changeTab(4)} />
      </Tabs>
      <div className={classes.wrapper}>
        {tabIndex === 0 && <TaskSummary taskResult={taskResult} changeFlow={onChangeFlow} />}
        {tabIndex === 1 && (
          <ReactJson
            style={{ wordBreak: 'break-all' }}
            displayDataTypes={false}
            className={classes.margin}
            src={taskResult.inputData}
            collapsed={1}
            title='Task Input'
          />
        )}
        {tabIndex === 2 && (
          <>
            <ReactJson
              style={{ wordBreak: 'break-all' }}
              displayDataTypes={false}
              className={classes.margin}
              src={taskResult.outputData}
              collapsed={1}
              title='Task Output'
            />
          </>
        )}
        {tabIndex === 3 && (
          <ReactJson
            style={{ wordBreak: 'break-all' }}
            displayDataTypes={false}
            className={classes.margin}
            src={taskResult}
            collapsed={1}
            title='Task Execution JSON'
          />
        )}
        {tabIndex === 4 && (
          <ReactJson
            style={{ wordBreak: 'break-all' }}
            displayDataTypes={false}
            className={classes.margin}
            src={taskResult.workflowTask}
            collapsed={1}
            title='Task Definition/Runtime Config'
          />
        )}
      </div>
    </Paper>
  )
}

RightPanel.propTypes = {
  selectedTask: PropTypes.object,
  dag: PropTypes.object,
  onTaskChange: PropTypes.func,
  onChangeFlow: PropTypes.func
}
