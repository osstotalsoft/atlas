import { gql } from '@apollo/client'

export const SAVE_WORKFLOW_MUTATION = gql`
  mutation saveWorkflow($input: WorkflowDefInput!) {
    create(workflowDefInput: $input)
  }
`
