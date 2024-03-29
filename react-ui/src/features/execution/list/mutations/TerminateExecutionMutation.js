import { gql } from '@apollo/client'

export const TERMINATE_EXECUTION_MUTATION = gql`
  mutation terminateExecution($workflowId: String!) {
    terminate(workflowId: $workflowId)
  }
`
