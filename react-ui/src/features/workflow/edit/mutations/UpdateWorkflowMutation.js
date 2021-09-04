import { gql } from '@apollo/client'

export const UPDATE_WORKFLOW_MUTATION = gql`
  mutation updateWorkflow($input: [WorkflowDefInput]!) {
    update(apiMetadataWorkflowInput: $input)
  }
`
