import { gql } from '@apollo/client'

export const RETRY_EXECUTION_MUTATION = gql`
  mutation retryExecution($workflowId: String!) {
    retry1(workflowId: $workflowId)
  }
`
