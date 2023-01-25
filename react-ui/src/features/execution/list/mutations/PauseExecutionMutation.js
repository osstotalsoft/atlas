import { gql } from '@apollo/client'

export const PAUSE_EXECUTION_MUTATION = gql`
  mutation pauseExecution($workflowId: String!) {
    pauseWorkflow(workflowId: $workflowId)
  }
`
