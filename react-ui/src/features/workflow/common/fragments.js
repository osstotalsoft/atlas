import { gql } from '@apollo/client'

const Fragments = {
  workflowTask: gql`
    fragment workflowTask on WorkflowTask {
      name
      description
      type
      caseValueParam
      caseExpression
      decisionCases
      inputParameters
      taskReferenceName
      subWorkflowParam {
        name
        version
      }
      optional
      startDelay
      asyncComplete
    }
  `
}

export default Fragments
