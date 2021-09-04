import { gql } from '@apollo/client'

export const TASK_LIST_QUERY = gql`
  query getTaskList($limit: Int!) {
    getTaskDefs(limit: $limit) {
      name
      description
      createTime
    }
  }
`
