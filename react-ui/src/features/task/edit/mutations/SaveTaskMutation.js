import { gql } from '@apollo/client'

export const SAVE_TASK_MUTATION = gql`
  mutation saveTask($input: [TaskDefInput]!) {
    registerTaskDef(apiMetadataTaskdefs2Input: $input)
  }
`
