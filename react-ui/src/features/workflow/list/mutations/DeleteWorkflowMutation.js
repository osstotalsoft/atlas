import { gql } from '@apollo/client'

export const DELETE_WORKFLOW_MUTATION = gql`
  mutation deleteWorkflow($name: String!, $version: Int!) {
    unregisterWorkflowDef(name: $name, version: $version)
  }
`
