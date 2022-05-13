import { gql } from '@apollo/client'
import Fragments from '../../../workflow/common/fragments'

export const EXECUTION_DETAILS_QUERY = gql`
  query getExecutionDetails($includeTasks: Boolean, $workflowId: String!) {
    getExecution(includeTasks: $includeTasks, workflowId: $workflowId) {
      correlationId
      createTime
      createdBy
      endTime
      event
      failedReferenceTaskNames
      input
      output
      ownerApp
      parentWorkflowId
      parentWorkflowTaskId
      reRunFromWorkflowId
      reasonForIncompletion
      startTime
      status
      readOnly
      taskToDomain
      tasks {
        callbackAfterSeconds
        callbackFromWorker
        correlationId
        domain
        endTime
        executed
        externalInputPayloadStoragePath
        externalOutputPayloadStoragePath
        inputData
        outputData
        pollCount
        queueWaitTime
        rateLimitFrequencyInSeconds
        rateLimitPerFrequency
        reasonForIncompletion
        referenceTaskName
        responseTimeoutSeconds
        retried
        retriedTaskId
        retryCount
        scheduledTime
        seq
        startDelayInSeconds
        startTime
        status
        taskDefName
        taskId
        taskType
        updateTime
        workerId
        workflowInstanceId
        workflowTask {
          ...workflowTask
        }
        workflowType
      }
      updateTime
      updatedBy
      workflowDefinition {
        ...partialWorkflowDef
        tasks {
          ...workflowTask
          forkTasks {
            ...workflowTask
          }
          defaultCase {
            ...workflowTask
          }
        }
      }
      workflowId
      workflowName
      workflowVersion
    }
  }
  ${Fragments.workflowTask}
  ${Fragments.partialWorkflowDef}
`
