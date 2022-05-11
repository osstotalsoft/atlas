import { gql } from '@apollo/client'

export const TASK_NAMES_QUERY = gql`
  query getTaskNames($limit: Int!) {
    getTaskDefs(limit: $limit) {
      name
    }
  }
`
