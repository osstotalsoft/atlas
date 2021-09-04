import { gql } from '@apollo/client'

export const EXECUTE_WORKFLOW_MUTATION = gql`
  mutation startWorkflow($startWorkflowRequestInput: StartWorkflowRequestInput!) {
    startWorkflow(startWorkflowRequestInput: $startWorkflowRequestInput)
  }
`
