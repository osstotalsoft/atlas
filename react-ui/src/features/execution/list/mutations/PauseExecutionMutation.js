import { gql } from '@apollo/client'

export const PAUSE_EXECUTION_MUTATION = gql`
  mutation pauseExecution($workflowId: String!) {
    pauseWorkflow1(workflowId: $workflowId)
  }
`
