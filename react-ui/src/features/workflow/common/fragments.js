import { gql } from '@apollo/client'

const Fragments = {
  partialWorkflowDef: gql`
    fragment partialWorkflowDef on WorkflowDef {
      name
      version
      historyId
      description
      createdBy
      updatedBy
      ownerEmail
      createTime
      updateTime
      timeoutSeconds
      failureWorkflow
      workflowStatusListenerEnabled
      outputParameters
      inputParameters
      schemaVersion
      restartable
      readOnly
    }
  `,
  workflowTask: gql`
    fragment workflowTask on WorkflowTask {
      type
      name
      description
      caseValueParam
      caseExpression
      decisionCases
      inputParameters
      taskReferenceName
      subWorkflowParam {
        name
        version
      }
      dynamicForkTasksInputParamName
      dynamicForkTasksParam
      optional
      sink
      startDelay
      asyncComplete
    }
  `
}

export default Fragments
