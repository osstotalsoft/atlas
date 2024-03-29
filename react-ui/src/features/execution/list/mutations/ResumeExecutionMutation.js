import { gql } from '@apollo/client'

export const RESUME_EXECUTION_MUTATION = gql`
  mutation resumeExecution($workflowId: String!) {
    resumeWorkflow(workflowId: $workflowId)
  }
`
