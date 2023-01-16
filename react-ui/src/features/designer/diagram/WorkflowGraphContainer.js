import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import WorkflowGraph from './WorkflowGraph'
import WorkflowDAG from './WorkflowDAG'
import { Tooltip } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import RightPanel from './RightPanel'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { useTranslation } from 'react-i18next'
import { Autocomplete } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Link } from '@material-ui/core'
import LaunchIcon from '@material-ui/icons/Launch'

const useStyles = makeStyles({
  wrapper: {
    height: '100%'
  },
  drawer: {
    zIndex: 999,
    position: 'relative',
    top: 0,
    right: 0,
    bottom: 0,
    width: state => (state.isFullWidth ? '100%' : state.drawerWidth)
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-end',
    height: 80,
    flexShrink: 0,
    boxShadow: '0 4px 8px 0 rgb(0 0 0 / 10%), 0 0 2px 0 rgb(0 0 0 / 10%)',
    zIndex: 1,
    backgroundColor: '#fff'
  },
  dragger: {
    display: state => (state.isFullWidth ? 'none' : 'block'),
    width: '5px',
    cursor: 'ew-resize',
    padding: '4px 0 0',
    position: 'absolute',
    height: '100%',
    zIndex: '100',
    backgroundColor: '#f4f7f9'
  },
  drawerMain: {
    paddingLeft: state => (state.isFullWidth ? 0 : 4),
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  drawerContent: {
    flex: '1 1 auto',
    backgroundColor: '#fff',
    position: 'relative'
  },
  content: {
    overflowY: 'scroll',
    height: '100%'
  },
  contentShift: {
    marginRight: state => state.drawerWidth
  },
  headerSubtitle: {
    marginBottom: 20
  },

  fr: {
    display: 'flex',
    position: 'relative',
    float: 'right',
    marginRight: 50,
    marginTop: 10,
    zIndex: 1
  },
  frItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 15
  }
})
const INIT_DRAWER_WIDTH = 500
const initialDrawerState = {
  drawerWidth: INIT_DRAWER_WIDTH,
  isFullWidth: false,
  isResizing: false,
  selectedTask: null
}

const WorkflowGraphContainer = ({ flow }) => {
  const [selectedTask, setSelectedTask] = useState(null)
  const dag = useMemo(() => (flow ? new WorkflowDAG(flow) : null), [flow])
  const classes = useStyles(initialDrawerState)
  const { t } = useTranslation()

  const handleClose = useCallback(() => {
    setSelectedTask(null)
  }, [])

  const failedTaskError = workflow => {
    const failedTask = workflow.tasks.find(a => a.status === 'FAILED' && a.retried === false)
    if (failedTask) {
      return t(failedTask.outputData?.payload?.Code || failedTask.outputData?.payload?.Message)
    }

    return ''
  }

  const error = failedTaskError(flow)
  const handleChangeFlow = useCallback(flowId => {}, [])

  const handleSelectedTask = useCallback(task => {
    setSelectedTask({
      ref: task.ref
    })
  }, [])

  const getTaskResult = () => {
    let taskResult,
      retryOptions = null
    if (!selectedTask) {
      return null
    } else {
      const { ref, taskId } = selectedTask
      const node = dag.graph.node(ref.ref)
      if (!node) return { taskResult: null, retryOptions: null }
      if (node.taskResults.length > 1) {
        retryOptions = node.taskResults
      }

      if (taskId) {
        taskResult = node.taskResults.find(task => task.taskId === taskId)
      } else {
        taskResult = _.last(node.taskResults)
      }
    }

    return { taskResult, retryOptions }
  }

  const changeDfOption = useCallback(v => {
    setSelectedTask({
      ref: v
    })
  }, [])
  const changeRetryOption = useCallback(
    selectedTask => v => {
      setSelectedTask({
        ref: selectedTask.ref,
        taskId: v
      })
    },
    []
  )

  let dfOptions = selectedTask ? dag.getSiblings(selectedTask.ref) : null
  if (selectedTask) {
    var { taskResult, retryOptions } = getTaskResult(selectedTask.ref)
  }
  const getLabel = useCallback(x => `${dropdownIcon(x.status)} ${x.ref}`, [])
  const getRetryLabel = useCallback(t => `${dropdownIcon(t.status)} Attempt ${t.retryCount} - ${t.taskId}`, [])

  return (
    <>
      {error && <Alert severity='error'>{error}</Alert>}
      <div style={{ display: 'flex' }}>
        <WorkflowGraph
          selectedTask={selectedTask}
          executionMode={true}
          dag={dag}
          onClick={handleSelectedTask}
          changeFlow={handleChangeFlow}
          t={t}
        />
        {selectedTask && (
          <div className={classes.drawer}>
            <div id='dragger' />
            <div className={classes.drawerMain}>
              <div className={classes.drawerHeader}>
                <div>
                  {dfOptions && dfOptions.length > 0 && (
                    <div className={classes.dfSelect}>
                      <Autocomplete
                        onChange={changeDfOption}
                        disableClearable
                        options={dfOptions}
                        value={selectedTask.ref.ref}
                        getOptionLabel={getLabel}
                        valueKey='ref'
                        simpleValue
                        style={{ width: 400 }}
                      />
                    </div>
                  )}

                  {retryOptions && (
                    <div className={classes.dfSelect}>
                      <Autocomplete
                        onChange={changeRetryOption(selectedTask)}
                        disableClearable
                        options={retryOptions}
                        value={selectedTask.taskId ?? taskResult.taskId}
                        getOptionLabel={getRetryLabel}
                        valueKey='taskId'
                        simpleValue
                        style={{ width: 400 }}
                      />
                    </div>
                  )}
                </div>
                <Tooltip title={t('General.Buttons.Close')}>
                  <IconButton onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={classes.drawerContent}>
                <RightPanel selectedTask={selectedTask} onTaskChange={handleSelectedTask} onChangeFlow={handleChangeFlow} dag={dag} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function dropdownIcon(status) {
  let icon
  switch (status) {
    case 'COMPLETED':
      icon = '\u2705'
      break // Green-checkmark
    case 'COMPLETED_WITH_ERRORS':
      icon = '\u2757'
      break // Exclamation
    case 'CANCELED':
      icon = '\uD83D\uDED1'
      break // stopsign
    case 'IN_PROGRESS':
    case 'SCHUEDULED':
      icon = '\u231B'
      break // hourglass
    default:
      icon = '\u274C' // red-X
  }
  return icon + '\u2003'
}

WorkflowGraphContainer.propTypes = {
  flow: PropTypes.object.isRequired
}

export default WorkflowGraphContainer
