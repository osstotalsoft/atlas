import { gql } from '@apollo/client'

export const RESTART_EXECUTION_MUTATION = gql`
  mutation restartExecution($workflowId: String!) {
    restart(workflowId: $workflowId)
  }
`
