import { gql } from '@apollo/client'

export const IMPORT_WORKFLOW_MUTATION = gql`
  mutation importWorkflows($input: String!, $replacements: String!) {
    importWorkflows(input: $input, replacements: $replacements)
  }
`
