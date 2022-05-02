import { gql } from '@apollo/client'

export const CREATE_UPDATE_WORKFLOW_MUTATION = gql`
  mutation createOrUpdateWorkflow($input: WorkflowDefInput!) {
    createOrUpdateWorkflow(input: $input)
  }
`
