import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import KeyValueTable from './KeyValueTable'
import { Link } from '@material-ui/core'
import LaunchIcon from '@material-ui/icons/Launch'

const TaskSummary = ({ taskResult, changeFlow }) => {
  // To accommodate unexecuted tasks, read type & name & ref out of workflowTask

  const changeWorkflow = id => changeFlow(id)

  const data = [
    { label: 'Task Type', value: taskResult.workflowTask.type },
    { label: 'Status', value: taskResult.status || 'Not executed' },
    { label: 'Task Name', value: taskResult.workflowTask.name },
    {
      label: 'Task Reference',
      value: taskResult.workflowTask.taskReferenceName
    }
  ]

  if (taskResult.workflowTask.type === 'SUB_WORKFLOW') {
    if (_.get(taskResult, 'outputData.subWorkflowId')) {
      data.push({
        label: 'Subworkflow ID',
        value: (
          <Link component='button' variant='body2' onClick={changeWorkflow(taskResult.outputData.subWorkflowId)}>
            {taskResult.outputData.subWorkflowId}
            <LaunchIcon fontSize='small' style={{ verticalAlign: 'middle' }} />
          </Link>
        )
      })
    }
  }

  if (taskResult.domain) {
    data.push({ label: 'Domain', value: taskResult.domain })
  }

  if (taskResult.taskId) {
    data.push({ label: 'Task Execution ID', value: taskResult.taskId })
  }

  if (_.isFinite(taskResult.retryCount)) {
    data.push({ label: 'Retry Count', value: taskResult.retryCount })
  }

  if (taskResult.scheduledTime) {
    data.push({
      label: 'Scheduled Time',
      value: taskResult.scheduledTime > 0 && taskResult.scheduledTime,
      type: 'date'
    })
  }
  if (taskResult.startTime) {
    data.push({
      label: 'Start Time',
      value: taskResult.startTime > 0 && taskResult.startTime,
      type: 'date'
    })
  }
  if (taskResult.endTime) {
    data.push({ label: 'End Time', value: taskResult.endTime, type: 'date' })
  }
  if (taskResult.startTime && taskResult.endTime) {
    data.push({
      label: 'Duration',
      value: taskResult.startTime > 0 && taskResult.endTime - taskResult.startTime,
      type: 'duration'
    })
  }
  if (!_.isNil(taskResult.retrycount)) {
    data.push({ label: 'Retry Count', value: taskResult.retryCount })
  }
  if (taskResult.reasonForIncompletion) {
    data.push({
      label: 'Reason for Incompletion',
      value: taskResult.reasonForIncompletion
    })
  }
  if (taskResult.workerId) {
    data.push({
      label: 'Worker',
      value: taskResult.workerId,
      type: 'workerId'
    })
  }
  if (taskResult.taskType === 'DECISION') {
    data.push({
      label: 'Evaluated Case',
      value: taskResult.outputData.caseOutput[0]
    })
  }
  if (taskResult.externalOutputPayloadStoragePath) {
    data.push({
      label: 'External Output',
      value: taskResult.externalOutputPayloadStoragePath
    })
  }

  return <KeyValueTable data={data} />
}

TaskSummary.propTypes = {
  taskResult: PropTypes.object,
  changeFlow: PropTypes.func
}

export default TaskSummary
